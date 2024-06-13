"use client";
import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Dot } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { FilesContext, type NSFile } from "@/context/files";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContractsContext, NSContract, NSMilestone } from "@/context/contracts";
import { Badge } from "@/components/ui/badge";

const placeholderImage = require("@/assets/placeholder.jpg");

export const SingleMilestoneSheet = ({
  milestone,
}: {
  milestone: NSMilestone;
}) => {
  const { selectedMilestone, setSelectedMilestone } =
    useContext(ContractsContext);

  const { toast } = useToast();

  function handleCopy(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <button
            key={milestone.id}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              selectedMilestone!.id === milestone.id && "bg-muted"
            )}
            onClick={() => setSelectedMilestone(milestone)}
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold capitalize">
                    {milestone.description}
                  </div>
                </div>
                <div
                  className={cn(
                    "ml-auto text-xs",
                    selectedMilestone!.id === milestone.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                ></div>
              </div>
              <div className="text-xs font-medium">
                {milestone.milestoneCount}% Milestone
              </div>
            </div>

            <div className="flex gap-0 uppercase text-xs items-center">
              {milestone?.approvalStatus ? (
                <Badge>Approved</Badge>
              ) : (
                <Badge variant="secondary">Unapproved</Badge>
              )}{" "}
              <Dot /> {milestone.dueDate.toDateString()}
            </div>
          </button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-[50%] p-12 pt-0">
          <ScrollArea className="h-full pr-4">
            <SheetHeader className="w-full">
              <div className="h-16 mb-12"></div>
              <SheetTitle className="text-2xl capitalize">
                {selectedMilestone!.description}
              </SheetTitle>
              <SheetDescription>
                <div className="flex gap-0 uppercase text-xs items-center">
                  {formatDistanceToNow(selectedMilestone!.dueDate, {
                    addSuffix: true,
                  })}{" "}
                  <Dot />{" "}
                  {selectedMilestone?.approvalStatus ? (
                    <Badge>Approved</Badge>
                  ) : (
                    <Badge variant="secondary">Unapproved</Badge>
                  )}{" "}
                  <Dot /> {selectedMilestone!.milestoneCount}%
                </div>
              </SheetDescription>
            </SheetHeader>
            <Separator className="my-6" />
            <div className="flex space-x-2 w-full justify-between">
              {/* <div>
                <h4 className="text-lg lowercase">
                  {selectedMilestone!.receiver}
                </h4>
                <p className="text-xs uppercase text-muted-foreground">
                  recipient mail
                </p>
              </div> */}

              <div>
                <h4 className="text-lg lowercase">
                  {selectedMilestone!.payoutAmount} USDC
                </h4>
                <p className="text-xs uppercase text-muted-foreground">
                  payment amount
                </p>
              </div>

              {/* <div>
                <h4 className="text-lg uppercase">0</h4>
                <p className="text-xs uppercase text-muted-foreground">
                  download count
                </p>
              </div> */}
            </div>
            <Separator className="my-6" />
          </ScrollArea>
          <SheetFooter className="absolute bottom-0 right-0 py-6 px-12 bg-background w-full flex md:justify-start">
            <Button
              onClick={() => toast({ description: "Milestone approved!" })}
            >
              Approve
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};
