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
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { PreviewSheet } from "./preview-sheet";

const successImage = require("@/assets/successful-send.png");

const FormSchema = z
  .object({
    sendersEmail: z.string().email(),
    receiversEmail: z.string().email(),
    title: z.string().min(1, "Title cannot be empty"),
    message: z.string().optional(),
    isPaid: z.boolean(),
    paymentAmount: z.union([
      /* z.coerce.number().gte(0, {
    message: "Enter a positive number as collateral.",
  }) */
      z.coerce
        .number()
        .positive()
        .min(0, "Payment amount must be positive")
        .optional(),
      z.literal(0), // Allow zero if isPaid is false
    ]),
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
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      isPaid: false,
    },
  });
  const { formState, watch } = form;
  const { isValid, isDirty, errors: formErrors } = formState;

  const isPaid = watch("isPaid", false);

  console.log("errors", formErrors);
  console.log("isdirty", isDirty);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("submit form data: ", data);
  }

  if (true) {
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
