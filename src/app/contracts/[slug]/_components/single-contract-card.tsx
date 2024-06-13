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
import { SingleMilestoneSheet } from "./single-milestone-sheet";
import { useContext, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FilesContext, type NSFile } from "@/context/files";
import { ContractsContext, NSMilestone } from "@/context/contracts";
import { Separator } from "@/components/ui/separator";

const successImage = require("@/assets/successful-send.png");

export function SingleContractCard() {
  const { selectedContract } = useContext(ContractsContext);

  function handleDownload() {
    console.log("submit form data: ");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{selectedContract?.title}</CardTitle>
        {selectedContract?.description && (
          <CardDescription>{selectedContract?.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="grid gap-3">
        <div>
          <h4 className="text-lg">
            Milestones - {selectedContract?.milestones?.length}
          </h4>
        </div>

        <Separator />

        {selectedContract?.milestones && (
          <FileDisplayItem milestones={selectedContract?.milestones} />
        )}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

function FileDisplayItem({ milestones }: { milestones: NSMilestone[] }) {
  // const { file, setFile } = useContext(ContractsContext);

  return (
    <ScrollArea className="h-72 w-full">
      {
        // @ts-ignore
        milestones || milestones.length ? (
          <div className="flex flex-col gap-2 pb-4 pt-0">
            {milestones.map((item) => (
              <SingleMilestoneSheet
                key={`milestone-${item.id}`}
                milestone={item}
              />
            ))}
          </div>
        ) : (
          <div>No milestones found</div>
        )
      }
    </ScrollArea>
  );
}
