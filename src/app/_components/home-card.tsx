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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileInput, FileLock2 } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

enum UserActions {
  WorkContract = "work-contract",
  SendFiles = "send-files",
}
const FormSchema = z.object({
  userAction: z.enum(
    [UserActions.WorkContract, UserActions.SendFiles, "none"],
    {
      required_error: "Please choose an action.",
    }
  ),
});

export function HomeCard() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        userAction: UserActions.SendFiles,
      },
  });
  const router = useRouter();

  const { formState } = form;
  const { isValid } = formState;

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const navigateTo =
      data.userAction === UserActions.SendFiles ? "/send" : "/contract";
    router.push(navigateTo);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>What do you want to do?</CardTitle>
            {/* <CardDescription>Send a file</CardDescription> */}
          </CardHeader>
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="userAction"
              render={({ field }) => (
                <FormItem className="">
                  {/* <FormLabel>Notify me about...</FormLabel> */}
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div>
                        <FormItem className="">
                          <FormControl>
                            <RadioGroupItem
                              value={UserActions.SendFiles}
                              id={UserActions.SendFiles}
                              className="peer sr-only"
                            />
                          </FormControl>
                          <FormLabel
                            htmlFor={UserActions.SendFiles}
                            className="flex flex-col p-4 py-6 text-center items-center justify-between rounded-md border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <FileInput className="mb-1" />
                            Send Files
                          </FormLabel>
                        </FormItem>
                      </div>

                      <div>
                        <FormItem className="">
                          <FormControl>
                            <RadioGroupItem
                              value={UserActions.WorkContract}
                              id={UserActions.WorkContract}
                              className="peer sr-only"
                            />
                          </FormControl>
                          <FormLabel
                            htmlFor={UserActions.WorkContract}
                            className="flex flex-col p-4 py-6 text-center items-center justify-between rounded-md border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <FileLock2 className="mb-1" />
                            New Contract
                          </FormLabel>
                        </FormItem>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={!isValid} className="w-full">
              Continue
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
