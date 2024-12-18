"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PreviewSheet } from "./preview-sheet";
import { useContext, useState } from "react";
import { Check, Loader2, Upload, X } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

import * as LitJsSdk from "@lit-protocol/lit-node-client";

import { Signer } from "ethers";

import axios from "axios";
import {
  APILLION_AUTH_SECRET,
  APILLON_BUCKET_UUID,
  URL_ROOT,
} from "@/client/config";
import { TransferContext } from "@/context/transfers";
import { EncryptedFile, NSFile, NSTransfer } from "@/lib/types";

import { Progress } from "@/components/ui/progress";
import { v4 as uuidv4 } from "uuid";

import { firestore } from "@/lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";

import {
  initLitClient,
  encryptFile,
  getSessionSignatures,
} from "@/lib/lit-protocol";
import { type SessionSigsMap } from "@lit-protocol/types";
import { useEthersSigner } from "@/lib/ethers-signer";

import {
  useAccount,
} from "@particle-network/connectkit";
import { FilePreview } from "@/components/ui/file-preview";
// import { ConnectButton } from "@/components/my-connect-button";
import { ConnectButton } from "@particle-network/connectkit";

const successImage = require("@/assets/successful-send.png");

export interface FileWithPreview extends File {
  name: string;
  type: string;
  size: number;
  lastModified: number;
  preview: string;
  progress?: number;
  uploadComplete?: boolean;
}

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const FormSchema = z
  .object({
    sendersEmail: z.string().email(),
    receiversEmail: z.string().email(),
    title: z.string().min(1, "Title cannot be empty"),
    message: z.string().optional(),
    isPaid: z.boolean(),
    walletAddress: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address")
      .optional(),
    paymentAmount: z.union([
      z.coerce
        .number()
        .positive()
        .min(0, "Payment amount must be positive")
        .optional(),
      z.literal(0), // Allow zero if isPaid is false
    ]),
    files: z
      .array(
        z.instanceof(File).refine((file) => file.size <= MAX_FILE_SIZE, {
          message: "File size should not exceed 100MB",
        })
      )
      .min(1, "Please upload at least one file")
      .max(10, "You can upload a maximum of 10 files"),
  })
  .refine(
    (data) =>
      !data.isPaid ||
      (data.paymentAmount !== undefined && data.paymentAmount > 0),
    {
      message:
        "Payment amount must be greater than zero if the message is paid",
      path: ["paymentAmount"],
    }
  )
  .refine(
    (data) =>
      !data.isPaid ||
      (data.walletAddress !== undefined && data.walletAddress !== ""),
    {
      message: "Enter a valid wallet address",
      path: ["walletAddress"],
    }
  );

export function SendCard() {
  const { setTransfer: setActiveTransferDisplay } = useContext(TransferContext);
  const { isConnected } = useAccount();
  const [sendStatus, setSendStatus] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      isPaid: false,
      files: [],
    },
    mode: "onChange",
  });
  const { formState, watch } = form;
  const { isValid, isSubmitting, errors: formErrors } = formState;
  const [currentUploadIndex, setCurrentUploadIndex] = useState(1);

  const { toast } = useToast();
  const signer = useEthersSigner();

  const isPaid = watch("isPaid", false);

  const storeMetadata = async (transferMetadata: NSTransfer) => {
    const {
      id: sessionId,
      sendersEmail,
      receiversEmail,
      files,
      isPaid,
      paymentAmount,
      title,
      message,
      size,
      downloadCount,
      sentTimestamp,
      paymentStatus,
      walletAddress,
    } = transferMetadata;

    try {
      const TRANSFERS_COLLECTION = collection(firestore, "transfers");
      const docRef = doc(TRANSFERS_COLLECTION, sessionId);
      await setDoc(docRef, {
        sendersEmail,
        receiversEmail,
        files,
        title,
        size,
        downloadCount,
        sentTimestamp,
        paymentStatus,
        isPaid,
        paymentAmount: isPaid ? paymentAmount : 0,
        message: message ? message : "",
        walletAddress: isPaid ? walletAddress : "",
      });
    } catch (error: any) {
      throw new Error("Error writing to database. Details: " + error.message);
    }
  };

  const startUploadSession = async (files: File[], sendId: string) => {
    const url = `https://api.apillon.io/storage/buckets/${APILLON_BUCKET_UUID}/upload`;
    const headers = {
      Authorization: `${APILLION_AUTH_SECRET}`,
      "Content-Type": "application/json",
    };
    const data = {
      files: files.map((file) => ({
        fileName: file.name,
        path: `send/${sendId}`,
        contentType: "application/octet-stream", // file is encrypted
      })),
    };
    try {
      const response = await axios.post(url, data, { headers });
      return response.data.data;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: `Error uploading files`,
        description: error.message
          ? error.message
          : "Please, wait a moment and try again.",
      });
    }
  };

  const uploadFileToSignedUrl = async (
    url: string,
    file: File,
    currentUpload: number
  ) => {
    const headers = {
      "Content-Type": "application/octet-stream",
    };

    try {
      await axios.put(url, file, {
        headers,
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total!) * 100;
          const updatedFileUploadProgress = uploadedFiles.map(
            (uploadedFile, index) => {
              if (currentUpload == index) {
                return { ...uploadedFile, progress };
              } else {
                return uploadedFile;
              }
            }
          );
          setUploadedFiles(updatedFileUploadProgress);
          if (progress > 99) {
            setCurrentUploadIndex(currentUpload + 1);
            const completedUploadFiles = uploadedFiles.map(
              (uploadedFile, index) => {
                if (currentUpload == index) {
                  return { ...uploadedFile, uploadComplete: true };
                } else {
                  return uploadedFile;
                }
              }
            );
            setUploadedFiles(completedUploadFiles);
          }
        },
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error uploading ${file.name}`,
        description: "Please, wait a moment and try again.",
      });
    }
  };

  const endUploadSession = async (sessionId: string) => {
    const url = `https://api.apillon.io/storage/buckets/${APILLON_BUCKET_UUID}/upload/${sessionId}/end`;
    const headers = {
      Authorization: `${APILLION_AUTH_SECRET}`,
      "Content-Type": "application/json",
    };

    const response = await axios.post(url, {}, { headers });
    return response.data;
  };

  const handleEncryptFiles = async (
    file: File,
    litNodeClient: LitJsSdk.LitNodeClient,
    sessionSigs: SessionSigsMap
  ) => {
    // init litnodeclient
    const encryptedResult = await encryptFile(
      file,
      litNodeClient!,
      sessionSigs
    );

    return encryptedResult as File;
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect a wallet and try again",
      });
      return;
    }
    // generate unique ID for the transfer
    const SEND_FILE_ID = uuidv4();

    // initiate lit client
    const litNodeClient = await initLitClient();
    // initiate session
    const sessionSigs = await getSessionSignatures(
      litNodeClient!,
      signer as Signer
    );

    // encrypt files
    const encryptFilesResponse = await Promise.all(
      data.files.map((file) =>
        handleEncryptFiles(file, litNodeClient!, sessionSigs!)
      ) // pass lit session to handle encrypt function
    );

    try {
      // Step 1: Initialize upload session and get signed URLs
      const { sessionUuid: sessionId, files: signedUrls } =
        await startUploadSession(encryptFilesResponse, SEND_FILE_ID);

      const uploadTimestamp = Date.now();
      // files metadata
      let filesInNs: NSFile[] = [];

      // Step 2: Upload files to signed URLs
      await Promise.all(
        signedUrls.map((signedUrl: any, currentUpload: number) => {
          filesInNs.push({
            id: signedUrl.fileUuid,
            path: signedUrl.path,
            name: data.files[currentUpload].name,
            format: data.files[currentUpload].type,
            uploadTimestamp,
            size: `${String(
              (data.files[currentUpload].size / 1000000).toFixed(2)
            )} MB`, // TODO change to save in kb or bytes
            receiver: data.receiversEmail,
          });
          return uploadFileToSignedUrl(
            signedUrl.url,
            encryptFilesResponse[currentUpload],
            currentUpload
          );
        })
      );

      // Step 3: End the upload session
      await endUploadSession(sessionId);

      const totalSize = data.files.reduce(
        (total, file) => total + file.size,
        0
      );

      const transferMetaData: NSTransfer = {
        id: SEND_FILE_ID,
        sendersEmail: data.sendersEmail,
        receiversEmail: data.receiversEmail,
        title: data.title,
        message: data.message ? data.message : undefined,
        files: filesInNs,
        size: `${String((totalSize / 1000000).toFixed(2))} MB`,
        downloadCount: 0,
        sentTimestamp: uploadTimestamp,
        isPaid: data.isPaid,
        paymentStatus: false,
        paymentAmount: data.paymentAmount,
        walletAddress: data.walletAddress,
      };

      // Step 4: Store file data in db
      await storeMetadata(transferMetaData);

      // Step 5: Send email alerts to sender and receiver
      const sendAlertUrl = `/api/alerts/new-transfer`;
      const alertOptions = {
        receiversEmail: data.receiversEmail,
        sendersEmail: data.sendersEmail,
        title: data.title,
        message: data.message ? data.message : "",
        downloadLink: `${URL_ROOT}/transfers/${SEND_FILE_ID}`,
        paymentWalletAddress: data.isPaid ? data.walletAddress : "",
        paymentAmount: data.isPaid ? data.paymentAmount : 0,
      };
      const response = await axios.post(sendAlertUrl, alertOptions, {});
      if (response.status != 200) {
        throw new Error("Error when trying to send alert, we'll keep trying.");
      }
      setActiveTransferDisplay(transferMetaData);
      setSendStatus(true);
      toast({
        title: "Success 😄",
        description: `The files are on their way to ${data.receiversEmail}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        // @ts-ignore
        description: (error as Error).message || error!.shortMessage,
      });
    }
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
    onChange: (files: File[]) => void
  ) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    // @ts-ignore
    const filePreviews: FileWithPreview[] = files.map((file: File) => ({
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
      preview: URL.createObjectURL(file),
    }));
    setUploadedFiles((prevFiles: FileWithPreview[]) => [
      ...prevFiles,
      ...filePreviews,
    ]);
    onChange([...form.getValues("files"), ...files]);
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);
    if (updatedFiles.length > 0) {
      // @ts-expect-error
      form.setValue("files", updatedFiles as [File, ...File[]], {
        shouldValidate: true,
      });
    } else {
      form.setValue("files", [], { shouldValidate: true });
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (files: File[]) => void
  ) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      // @ts-ignore
      const filePreviews: FileWithPreview[] = files.map((file: File) => ({
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        preview: URL.createObjectURL(file),
      }));
      setUploadedFiles((prevFiles) => [...prevFiles, ...filePreviews]);
      onChange([...form.getValues("files"), ...files]);
    }
  };

  if (sendStatus) {
    return <SuccessDisplay />;
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="max-h-[84vh] min-h-[40vh] justify-center md:max-h-[70vh]">
          <CardHeader>
            <CardTitle>Upload files</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-[480px] h-[23rem] md:h-[18rem]">
              <div className="grid gap-3">
                <div>
                  <Controller
                    name="files"
                    control={form.control}
                    render={({ field: { onChange } }) => (
                      <div
                        onDrop={(event) => handleDrop(event, onChange)}
                        onDragOver={(e) => e.preventDefault()}
                        className="flex p-4 w-full items-center justify-center rounded-md border border-dashed hover:border-primary hover:bg-muted"
                      >
                        <input
                          type="file"
                          multiple
                          onChange={(event) =>
                            handleFileChange(event, onChange)
                          }
                          style={{ display: "none" }}
                          id="fileInput"
                        />
                        <label
                          htmlFor="fileInput"
                          className="cursor-pointer flex items-center text-sm text-muted-foreground"
                        >
                          <div className="pr-4">
                            <Upload className="h-4 w-4 text-primary" />
                            <span className="sr-only">Upload files</span>
                          </div>
                          Upload files here
                        </label>
                      </div>
                    )}
                  />

                  {formErrors.files && (
                    <p className="text-[0.8rem] font-medium text-destructive mt-1">
                      {formErrors.files.message}
                    </p>
                  )}

                  {uploadedFiles.length > 0 && (
                    <ScrollArea className="w-full whitespace-nowrap rounded-md my-4">
                      <div
                        className="grid overflow-x-auto gap-2"
                        style={{
                          gridAutoColumns: "70px",
                          gridAutoFlow: "column",
                        }}
                      >
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="my-2 relative ">
                            {isSubmitting ||
                              (false && ( // TODO progress bar is buggy
                                <>
                                  <Progress
                                    value={file.progress ? file.progress : 0}
                                    className="w-[80%] mx-auto absolute bottom-2 left-1.5 z-10"
                                  />
                                  <div className="aspect-square w-full h-full bg-background absolute top-0 left-0 opacity-40"></div>
                                </>
                              ))}
                            {file.uploadComplete && (
                              <div className="bottom-2 w-5 h-5 absolute -top-1.5 -right-1.5 rounded-full p-0.5 flex items-center justify-center bg-primary">
                                <Check className="h-3 w-3" />
                                {/* <div className="aspect-square w-full h-full bg-background absolute top-0 left-0 opacity-40"></div> */}
                              </div>
                            )}
                            {file && <FilePreview file={file} />}
                            {!isSubmitting && !sendStatus && (
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute -top-1.5 -right-1.5 rounded-full p-0.5 h-5 w-5"
                                onClick={() => handleRemoveFile(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                            <p className="truncate w-[40px] text-xs text-muted-foreground">
                              {file.name}
                            </p>
                          </div>
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  )}
                </div>

                {!isSubmitting && (
                  <>
                    <FormField
                      control={form.control}
                      name="receiversEmail"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs">
                            Receiver&apos;s Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="other-email@mail.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sendersEmail"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs">
                            Sender&apos;s Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="your-email@mail.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs">Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Final files..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs">Message</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="A note about the file(s)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isPaid"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Request payment</FormLabel>
                            <FormDescription>
                              Receiver pays before downloading
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    {isPaid && (
                      <FormField
                        control={form.control}
                        name="paymentAmount"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-xs">
                              Amount (USDT)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="0 USDT"
                                type="number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {isPaid && (
                      <FormField
                        control={form.control}
                        name="walletAddress"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-xs">
                              Wallet Address
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="0x000...123" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </>
                )}
                <ScrollBar />
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            {isConnected ? (
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...{" "}
                    {`${currentUploadIndex} of ${uploadedFiles.length}`}
                  </>
                ) : (
                  <>Send Files</>
                )}
              </Button>
            ) : (
              <ConnectButton />
            )}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

function SuccessDisplay() {
  const router = useRouter();
  const sendMoreFiles = () => {
    router.refresh();
  };
  return (
    <>
      <Card className="max-h-[84vh] min-h-[40vh] justify-center md:max-h-[70vh]">
        <CardHeader className="">
          <Image
            src={String(successImage.default.src)}
            width={200}
            height={200}
            className="mx-auto"
            alt="Files sent successfully"
          />
          <CardTitle>All done!</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          Your files are on their way 🚀.
        </CardContent>
        <CardFooter className="grid gap-3">
          <PreviewSheet />
          {/* // TODO fix the refresh to send more files */}
          {/* <Button className="w-full" onClick={sendMoreFiles}>
            Send more files
          </Button> */}
        </CardFooter>
      </Card>
    </>
  );
}
