"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useContext } from "react";
import { ContractsContext } from "@/context/contracts";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Dot } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const ContractsHistoryCard = () => {
  const { contracts } = useContext(ContractsContext);
  const router = useRouter();

  const handleNavigation = (contractId: string) => {
    router.push(`/contracts/${contractId}`);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contracts</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72 w-full">
          <div className="grid gap-3">
            {contracts?.map((contract, index) => {
              return (
                <button
                  key={contract.id}
                  className={cn(
                    "flex flex-col items-start w-full gap-2 rounded-lg bg-muted border p-3 text-left text-sm transition-all hover:bg-accent"
                  )}
                  onClick={() => handleNavigation(contract.id)}
                >
                  <div className="flex w-full flex-col gap-1">
                    <div className="flex items-center">
                      <div className="flex items-center gap-2">
                        <div className="font-display text-lg capitalize">
                          {contract.title}{" "}
                          {contract.approvalStatus ? (
                            <Badge
                              variant="secondary"
                              className="font-sans uppercase text-xs bg-secondary"
                            >
                              Approved
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="font-sans uppercase text-xs border"
                            >
                              Unapproved
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs font-medium">
                      {contract.description}
                    </div>
                  </div>

                  <div className="flex gap-0 lowercase text-xs items-center">
                    {contract?.clientEmail} <Dot />{" "}
                    <span className="">
                      {contract.dateCreated.toDateString()}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};
