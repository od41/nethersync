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
import { Loader2, Upload, X } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

import axios from "axios";
import { APILLION_AUTH_SECRET, APILLON_BUCKET_UUID } from "@/client/config";
import { TransferContext } from "@/context/transfers";
import { NSFile, NSTransfer } from "@/lib/types";

import { Progress } from "@/components/ui/progress";
import { v4 as uuidv4 } from "uuid";

const successImage = require("@/assets/successful-send.png");

interface FileWithPreview extends File {
  preview: string;
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
  );

export function SendCard() {
  const { setTransfer: setActiveTransferDisplay } = useContext(TransferContext);
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
  const [uploadProgress, setUploadProgress] = useState(0);

  const { toast } = useToast();

  const isPaid = watch("isPaid", false);

  const storeMetadata = async (transferMetadata: NSTransfer) => {
    const response = await axios.post(
      "/api/transfers/upload",
      transferMetadata
    );
    return response.data;
  };

  const startUploadSession = async (
    formData: z.infer<typeof FormSchema>,
    sendId: string
  ) => {
    const { files, sendersEmail } = formData;
    const url = `https://api.apillon.io/storage/buckets/${APILLON_BUCKET_UUID}/upload`;
    const headers = {
      Authorization: `${APILLION_AUTH_SECRET}`,
      "Content-Type": "application/json",
    };
    const data = {
      files: files.map((file) => ({
        fileName: file.name,
        path: `send/${sendId}`,
        contentType: file.type,
      })),
    };

    const response = await axios.post(url, data, { headers });
    return response.data.data;
  };

  const uploadFileToSignedUrl = async (url: string, file: FileWithPreview) => {
    const headers = {
      "Content-Type": "application/octet-stream",
    };

    await axios.put(url, file, {
      headers,
      onUploadProgress: (progressEvent) => {
        setUploadProgress(0); //always start at zero
        const progress = (progressEvent.loaded / progressEvent.total!) * 100;
        setUploadProgress(progress);
        file.uploadComplete = true;
      },
    });
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

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const SEND_FILE_ID = uuidv4();
      // Step 1: Initialize upload session and get signed URLs
      const { sessionUuid: sessionId, files: signedUrls } =
        await startUploadSession(data, SEND_FILE_ID);

      const uploadTimestamp = Date.now();

      // Step 2: Upload files to signed URLs
      await Promise.all(
        signedUrls.map((signedUrl: any, index: number) =>
          uploadFileToSignedUrl(signedUrl.url, uploadedFiles[index])
        )
      );

      // Step 3: End the upload session
      await endUploadSession(sessionId);

      const totalSize = data.files.reduce(
        (total, file) => total + file.size,
        0
      );
      const filesInNs: NSFile[] = data.files.map((item, index) => {
        return {
          id: signedUrls[index].fileUuid,
          path: signedUrls[index].path,
          name: item.name,
          format: item.type,
          uploadTimestamp,
          size: `${String((item.size / 1000000).toFixed(2))} MB`,
          receiver: data.receiversEmail,
          isPaid: data.isPaid,
          paymentAmount: data.paymentAmount,
        };
      });

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
      };

      // Step 4: Store file data in db
      await storeMetadata(transferMetaData);
      setActiveTransferDisplay(transferMetaData);
      setSendStatus(true);
      toast({
        description: "Your files have been sent.",
      });
    } catch (error) {
      // console.error("Error uploading files:", error);
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
    const filePreviews = files.map((file: File) => ({
      ...file,
      preview: URL.createObjectURL(file),
    }));
    setUploadedFiles((prevFiles) => [...prevFiles, ...filePreviews]);
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
      const filePreviews = files.map((file: File) => ({
        ...file,
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
        <Card>
          <CardHeader>
            <CardTitle>Upload files</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-[480px] h-[20rem]">
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
                      <div className="grid grid-cols-4 gap-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="my-2 relative ">
                            {isSubmitting && (
                              <>
                                <Progress
                                  value={uploadProgress}
                                  className="w-[80%] mx-auto absolute bottom-2 left-1.5 z-10"
                                />
                                <div className="aspect-square w-full h-full bg-background absolute top-0 left-0 opacity-40"></div>
                              </>
                            )}
                            {file.uploadComplete && (
                              <>
                                <Progress
                                  value={100}
                                  className="w-[80%] mx-auto absolute bottom-2 left-1.5 z-10"
                                />
                                <div className="aspect-square w-full h-full bg-background absolute top-0 left-0 opacity-40"></div>
                              </>
                            )}
                            <Image
                              src={file.preview}
                              alt={`preview of ${file.name}`}
                              className="aspect-square w-full border border-muted rounded-md hover:border-primary object-cover"
                              height="40"
                              width="40"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute -top-1.5 -right-1.5 rounded-full p-0.5 h-5 w-5"
                              onClick={() => handleRemoveFile(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            <p>{file.name}</p>
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
                              Amount (USDC or USDT)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="0 USDC"
                                type="number"
                                {...field}
                              />
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
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...{" "}
                  {uploadProgress != undefined && uploadProgress}
                </>
              ) : (
                <>Send Files</>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

function SuccessDisplay() {
  const router = useRouter();
  const navigateToSend = () => {
    router.refresh();
  };
  return (
    <>
      <Card className="min-h-[300px]">
        <CardHeader>
          <Image
            src={String(successImage.default.src)}
            width={500}
            height={500}
            alt="Files sent successfully"
          />
          <CardTitle>All done!</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          Your files have been sent - it’ll be available for the next 14 days.
        </CardContent>
        <CardFooter className="grid gap-3">
          <PreviewSheet />

          <Button className="w-full" onClick={navigateToSend}>
            Send more files
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
