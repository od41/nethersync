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
import { ArrowLeft, CalendarIcon, Loader2, Upload, X } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

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
import { Checkpoints } from "@/lib/types";
import { cn } from "@/lib/utils";

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

type MilestoneProps = z.infer<typeof _ms>;

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
  const [page, setPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page1Data, setPage1Data] = useState<ClientInfoFormData | null>(null);
  const [page2Data, setPage2Data] = useState<MilestoneFormData | null>(null);

  const { toast } = useToast();

  const handlePage1Next = (data: ClientInfoFormData) => {
    setPage1Data(data);
    setPage(2);
  };

  const handlePage2Back = () => {
    setPage(1);
  };

  const handlePage2Next = (data: MilestoneFormData) => {
    setPage2Data(data);
    setPage(3);
  };

  const handleSubmit = () => {
    const formData = {
      ...page1Data,
      ...page2Data,
    };
    console.log("Form Submitted:", formData);
    toast({
      title: "Success!",
      description: "New contract created and sent to your client.",
    });

    setSendStatus(true);
  };

  if (sendStatus) {
    return <SuccessDisplay />;
  }
  return (
    <div>
      {page === 1 && <ClientInfoForm onNext={handlePage1Next} />}
      {page === 2 && (
        <MilestoneForm onBack={handlePage2Back} onSubmit={handlePage2Next} />
      )}
      {page === 3 && (
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            <Button
              size="icon"
              variant="ghost"
              onClick={handlePage2Back}
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="mt-0">Review Contract</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {page1Data && (
              <div className="grid gap-2">
                <div>
                  <div className="text-xs">Client&apos;s email</div>
                  <div>{page1Data.clientEmail}</div>
                </div>

                <div>
                  <div className="text-xs">Title</div>
                  <div>{page1Data.title}</div>
                </div>

                {page1Data.description && (
                  <div>
                    <div className="text-xs">Description</div>
                    <div>{page1Data.description}</div>
                  </div>
                )}
              </div>
            )}
            {page2Data?.milestones && (
              <MilestoneList milestones={page2Data?.milestones} />
            )}
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? <>Loading...</> : <>Send to Client</>}
            </Button>
          </CardFooter>
        </Card>
      )}
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

function MilestoneList({
  milestones,
  handleEdit,
}: {
  milestones: MilestoneProps[];
  handleEdit?: (index: number) => void;
}) {
  return (
    <>
      {!milestones ? (
        <>No milestones added</>
      ) : (
        <>
          {milestones.map((milestone: MilestoneProps, index: number) => (
            <div
              key={`ms-key-${index}`}
              className="flex justify-between items-center bg-muted rounded-md py-4 px-3"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full text-foreground bg-border uppercase text-[10px] flex items-center justify-center">
                  {String(milestone.checkpoint)}%
                </div>
                <div className="grid gap-1">
                  <div className="text-sm">
                    {milestone.description.slice(0, 20)}...
                  </div>
                  <div className="text-xs">
                    Due{" "}
                    <span className="text-primary font-bold">
                      {milestone.dueDate.toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>
              </div>
              {handleEdit && (
                <div>
                  <Button onClick={() => handleEdit(index)} variant="link">
                    Edit
                  </Button>
                </div>
              )}
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
    defaultValues: {
      clientEmail: "",
      title: "",
      description: "",
    },
    mode: "onChange",
  });
  const { formState } = form;
  const { isValid } = formState;

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
              <Button type="submit" disabled={!isValid} className="w-full">
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
    defaultValues: {
      milestones: [],
    },
    mode: "onSubmit",
  });
  const { formState } = form;
  const { isValid, isSubmitting } = formState;

  const [activeField, setActiveField] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const { toast } = useToast();

  const { fields, update, remove } = useFieldArray({
    control: form.control,
    name: "milestones",
  });

  const handleMilestoneAppend = () => {
    if (activeField === null) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "No milestone data found",
      });
      return;
    }
    const newMilestone = form.getValues(`milestones.${activeField}`);
    update(activeField, newMilestone);
    setActiveField(null); // Reset active field after adding
  };

  function handleEdit(index: number) {
    setActiveField(index);
  }

  const handleNextPage = () => {
    setPage(2);
  };

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
              <MilestoneList milestones={fields} handleEdit={handleEdit} />
              <Separator />
              {activeField !== null && (
                <div className="grid gap-3" key={fields[activeField]?.id}>
                  <FormField
                    control={form.control}
                    name={`milestones.${activeField}.description` as const}
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

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name={`milestones.${activeField}.dueDate` as const}
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs">Due date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={
                                  (date) => date < TODAY // Can only select dates after "today"
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-1">
                      <FormField
                        control={form.control}
                        name={`milestones.${activeField}.checkpoint` as const}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">
                              Checkpoint
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={Checkpoints.End}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Checkpoint" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {msValues.map((val) => (
                                  <SelectItem
                                    key={`key-${val.id}`}
                                    value={val.value}
                                  >
                                    {val.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* <Button onClick={() => null} variant="ghost">
                      Clear
                    </Button> */}
                    <Button
                      type="button"
                      onClick={handleMilestoneAppend}
                      variant="secondary"
                      className="w-full"
                      disabled={fields.length >= 5}
                    >
                      Save Milestone
                    </Button>
                  </div>
                </div>
              )}
              {activeField === null && (
                <Button
                  type="button"
                  onClick={() => setActiveField(fields.length)}
                  variant="secondary"
                  className="w-full"
                  disabled={fields.length >= 5}
                >
                  Add Milestone
                </Button>
              )}
              <Separator />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={!isValid} className="w-full">
                Continue to Review
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  );
};
