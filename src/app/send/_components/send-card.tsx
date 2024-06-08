"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { useState } from "react";
import { Upload, X } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

const successImage = require("@/assets/successful-send.png");

interface FileWithPreview extends File {
  preview: string;
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
  const { isValid, isDirty, errors: formErrors } = formState;

  const { toast } = useToast();

  const isPaid = watch("isPaid", false);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("submit form data: ", data);
    toast({
      description: "Your files have been sent.",
    });
    setSendStatus(true);
  }

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
          <CardContent className="grid gap-3">
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
                      onChange={(event) => handleFileChange(event, onChange)}
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
                        <Image
                          src={file.preview}
                          alt={file.name}
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

            <FormField
              control={form.control}
              name="receiversEmail"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs">
                    Receiver&apos;s Email
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="other-email@mail.com" {...field} />
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
                  <FormLabel className="text-xs">Sender&apos;s Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your-email@mail.com" {...field} />
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
                    <Input placeholder="A note about the file(s)" {...field} />
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
                      <Input placeholder="0 USDC" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={!isValid} className="w-full">
              Send Files
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
            alt="Picture of the author"
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
