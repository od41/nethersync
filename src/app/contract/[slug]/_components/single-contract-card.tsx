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
import { SingleContractSheet } from "./single-contract-sheet";
import { useState } from "react";
import { ArrowLeft, Loader2, Upload, X } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

import axios from "axios";
import { APILLION_AUTH_SECRET, APILLON_BUCKET_UUID } from "@/client/config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const successImage = require("@/assets/successful-send.png");

enum MilestoneOptions {
  Start = 0,
  Quarter = 25,
  Halfway = 50,
  ThreeQuarters = 75,
  End = 100,
}

const msValues = [
  { id: "start", name: "Start", value: MilestoneOptions.Start },
  { id: "quarter", name: "Quarter", value: MilestoneOptions.Quarter },
  { id: "halfway", name: "Halfway", value: MilestoneOptions.Halfway },
  {
    id: "three-quarters",
    name: "ThreeQuarters",
    value: MilestoneOptions.ThreeQuarters,
  },
  { id: "end", name: "End", value: MilestoneOptions.End },
];

interface MilestoneType {
  description: string;
  dueDate: Date;
  milestoneCount: MilestoneOptions;
  includesPayout: boolean;
  payout: number;
}

const FormSchema = z
  .object({
    clientsEmail: z.string().email(),
    title: z.string().min(1, "Title cannot be empty"),
    description: z.string().optional(),
    paymentAmount: z.union([
      z.coerce
        .number()
        .positive()
        .min(0, "Payment amount must be positive")
        .optional(),
      z.literal(0), // Allow zero if isPaid is false
    ]),
    isPaid: z.boolean(),
    // list of milsestones
    // milestones: z
    //   .array(z.instanceof())
    //   .min(1, "Please add atleast one milestone")
    //   .max(4, "You can only have 4 milestones"),
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

export const SingleContractCard = () => {
  const [sendStatus, setSendStatus] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      isPaid: false,
    },
    mode: "onChange",
  });
  const { formState, watch } = form;
  const { isValid, isDirty, isSubmitting, errors: formErrors } = formState;
  const [formStep, setFormStep] = useState(0);
  const TOTAL_FORM_STEPS = 2;

  const { toast } = useToast();

  const isPaid = watch("isPaid", false);

  const dummyMilestones = [
    {
      id: "dafjahd898",
      description: "Early concepts and moodboard",
      milestoneCount: MilestoneOptions.Quarter,
      dueDate: new Date(2024, 6, 20),
    },
    {
      id: "32dafad",
      description: "Final deliverables",
      milestoneCount: MilestoneOptions.End,
      dueDate: new Date(2024, 7, 25),
    },
  ];

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    toast({
      description: "New contract created and sent to your client.",
    });
  };

  const renderView = () => {
    switch (formStep) {
      case 0:
        return (
          <>
            <CardHeader>
              <CardTitle>New Project</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <FormField
                control={form.control}
                name="clientsEmail"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs">
                      Client&apos;s Email
                    </FormLabel>
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
                    <FormLabel className="text-xs">Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Final files..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs">Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="A note about the contract & deliverables"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button onClick={() => setFormStep(1)} className="w-full">
                Continue
              </Button>
            </CardFooter>
          </>
        );
      case 1:
        return (
          <>
            <CardHeader className="flex flex-row items-center gap-2 space-y-0">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setFormStep(formStep - 1);
                }}
                aria-label="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="mt-0">Add Milestones</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <MilestoneList milestones={dummyMilestones} />
              <Separator />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs">Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="A note about the contract & deliverables"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs">Due date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="When is the milestone due?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-1">
                  <FormLabel htmlFor="milestone-option" className="text-xs">
                    Milestone option
                  </FormLabel>
                  <Select>
                    <SelectTrigger
                      id="milestone-option"
                      aria-label="Milestone option"
                    >
                      <SelectValue placeholder="Milestone option" />
                    </SelectTrigger>
                    <SelectContent>
                      {msValues.map((val) => (
                        <SelectItem key={`key-${val.id}`} value={val.id}>
                          {val.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={() => null} variant="ghost">
                  Clear
                </Button>
                <Button
                  onClick={() => null}
                  variant="secondary"
                  className="w-full"
                >
                  Save Milestone
                </Button>
              </div>
              <Separator />
            </CardContent>
            <CardFooter>
              <Button onClick={() => setFormStep(2)} className="w-full">
                Continue to Review
              </Button>
            </CardFooter>
          </>
        );
      case 2:
        return (
          <>
            <CardHeader className="flex flex-row items-center gap-2 space-y-0">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setFormStep(formStep - 1);
                }}
                aria-label="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="mt-0">Review Contract</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <MilestoneList milestones={dummyMilestones} />
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="w-full"
              >
                Send to Client
              </Button>
            </CardFooter>
          </>
        );
      default:
        return <div>You&apos;re in the wrong place</div>;
    }
  };
  if (sendStatus) {
    return <SuccessDisplay />;
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>{renderView()}</Card>
      </form>
    </Form>
  );
};

function SuccessDisplay() {
  const router = useRouter();
  const navigateToSend = () => {
    console.log("refresh...");
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
          This project details have been forwarded to the client for approval
        </CardContent>
        <CardFooter className="grid gap-3">
          <SingleContractSheet />

          <Button className="w-full" onClick={() => navigateToSend()}>
            Create New Contract
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

function MilestoneList({ milestones }: { milestones: any }) {
  return (
    <>
      {milestones.length < 1 ? (
        <>Add atleast one milestone</>
      ) : (
        <>
          {milestones.map((milestone: any, index: number) => (
            <div
              key={`ms-key-${index}`}
              className="flex justify-between items-center bg-muted rounded-md py-4 px-3"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full text-foreground bg-border uppercase text-[10px] flex items-center justify-center">
                  {String(milestone.milestoneCount)}%
                </div>
                <div className="grid gap-1">
                  <div className="text-sm">
                    {milestone.description.slice(0, 20)}...
                  </div>
                  <div className="text-xs">
                    Due{" "}
                    <span className="text-primary font-bold">
                      {milestone.dueDate.toDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <Button
                  onClick={() => console.log(milestone.id)}
                  variant="link"
                >
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
}
