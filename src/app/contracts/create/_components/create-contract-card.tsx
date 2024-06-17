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
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ContractPreviewSheet } from "./contract-preview-sheet";
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
import { Checkpoints } from "@/context/contracts";

const successImage = require("@/assets/successful-send.png");

const msValues = [
  { id: "start", name: "Start", value: Checkpoints.Start },
  { id: "quarter", name: "Quarter", value: Checkpoints.Quarter },
  { id: "halfway", name: "Halfway", value: Checkpoints.Halfway },
  {
    id: "three-quarters",
    name: "ThreeQuarters",
    value: Checkpoints.ThreeQuarters,
  },
  { id: "end", name: "End", value: Checkpoints.End },
];

// Define Zod schema for client information
const clientInfoSchema = z.object({
  clientEmail: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
});

const TODAY = new Date();

// Define Zod schema for milestone
const _ms = z.object({
  description: z.string().min(1, { message: "Description is required" }),
  dueDate: z.date().min(TODAY, { message: "Due date is required" }),
  checkpoint: z.enum([
    Checkpoints.Start,
    Checkpoints.Quarter,
    Checkpoints.Halfway,
    Checkpoints.ThreeQuarters,
    Checkpoints.End,
  ]),
  paymentDue: z.boolean().optional(),
});

// Define Zod schema for entire form data
const milestoneSchema = z.object({
  milestones: z
    .array(_ms)
    .min(1, "At least one milestone is required")
    .max(5, "Maximum 5 milestones allowed"),
});

// Define Zod schema for entire form data
const FormSchema = z.object({
  clientInfo: clientInfoSchema,
  milestones: z
    .array(milestoneSchema)
    .min(1, "At least one milestone is required")
    .max(5, "Maximum 5 milestones allowed"),
});

export const CreateContractCard = () => {
  const [sendStatus, setSendStatus] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
  });
  const { formState, watch } = form;
  const { isValid, isDirty, isSubmitting, errors: formErrors } = formState;
  const [formStep, setFormStep] = useState(0);
  const [page, setPage] = useState(1);
  const [page1Data, setPage1Data] = useState<ClientInfoFormData | null>(null);
  const TOTAL_FORM_STEPS = 2;

  const clientInfo = watch("clientInfo");
  const milestones = watch("milestones");

  const { toast } = useToast();

  const dummyMilestones = [
    {
      id: "dafjahd898",
      description: "Early concepts and moodboard",
      milestoneCount: Checkpoints.Quarter,
      dueDate: new Date(2024, 6, 20),
    },
    {
      id: "32dafad",
      description: "Final deliverables",
      milestoneCount: Checkpoints.End,
      dueDate: new Date(2024, 7, 25),
    },
  ];

  const handlePage1Next = (data: ClientInfoFormData) => {
    setPage1Data(data);
    setPage(2);
  };

  const handlePage2Back = () => {
    setPage(1);
  };

  const handlePage2Submit = (data: MilestoneFormData) => {
    const formData = {
      ...page1Data,
      ...data,
    };
    console.log('Form Submitted:', formData);
    // You can now send the formData to your backend or perform other actions
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log(data);
    toast({
      description: "New contract created and sent to your client.",
    });
  };

  const renderView = () => {
    switch (formStep) {
      case 0:
        // return <ClientInfoForm />;
      case 1:
        // <MilestoneForm />;
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
    <div>
      {page === 1 && <ClientInfoForm onNext={handlePage1Next} />}
      {page === 2 && <MilestoneForm onBack={handlePage2Back} onSubmit={handlePage2Submit} />}
    </div>
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
          <ContractPreviewSheet />

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

/* 
  THE CLIENT FORM
*/

type ClientInfoFormData = z.infer<typeof clientInfoSchema>;

interface ClientInfoFormProps {
  onNext: (data: ClientInfoFormData) => void;
}

const ClientInfoForm = ({ onNext }: ClientInfoFormProps) => {
  const form = useForm<ClientInfoFormData>({
    resolver: zodResolver(clientInfoSchema),
    mode: "onChange",
  });
  const { formState, watch } = form;
  const { isValid, isDirty, isSubmitting, errors: formErrors } = formState;

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onNext)}>
          <Card>
            <CardHeader>
              <CardTitle>New Project</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <FormField
                control={form.control}
                name="clientEmail"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs">
                      Client&apos;s Email
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="client-email@mail.com" {...field} />
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
              <Button type="submit" className="w-full">
                Continue
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  );
};

/* 
  THE MILESTONES FORM
*/

type MilestoneFormData = z.infer<typeof milestoneSchema>;

interface MilestoneFormProps {
  onBack: () => void;
  onSubmit: (data: MilestoneFormData) => void;
}

const MilestoneForm = ({ onBack, onSubmit }: MilestoneFormProps) => {
  const form = useForm<MilestoneFormData>({
    resolver: zodResolver(milestoneSchema),
    mode: "onChange",
  });
  const { formState, watch } = form;
  const { isValid, isDirty, isSubmitting, errors: formErrors } = formState;

  const addedMilestones = watch("milestones");

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "milestones",
  });

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 space-y-0">
              <Button
                size="icon"
                variant="ghost"
                onClick={onBack}
                aria-label="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="mt-0">Add Milestones</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <MilestoneList milestones={addedMilestones} />
              <Separator />
              {fields.map((field, index) => (
                <div key={field.id}>
                  <FormField
                    control={form.control}
                    name={`milestones.${index}.description` as const}
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
                      name={`milestones.${index}.dueDate` as const}
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs">Due date</FormLabel>
                          <FormControl>
                            {/* @ts-ignore */}
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
                      <FormLabel htmlFor="checkpoint" className="text-xs">
                        Checkpoint
                      </FormLabel>
                      <Select
                        {...form.register(
                          `milestones.${index}.checkpoint` as const
                        )}
                      >
                        <SelectTrigger id="checkpoint" aria-label="Checkpoint">
                          <SelectValue placeholder="Checkpoint" />
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
                      onClick={() =>
                        append({
                          description: "",
                          dueDate: TODAY,
                          checkpoint: Checkpoints.Start,
                          paymentDue: false,
                        })
                      }
                      variant="secondary"
                      className="w-full"
                      disabled={fields.length >= 5}
                    >
                      Save Milestone
                    </Button>
                  </div>
                </div>
              ))}
              <Separator />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Continue to Review
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  );
};
