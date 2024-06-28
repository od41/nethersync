"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TransferIndexPreviewSheet } from "./transfer-index-preview-sheet";
import { useContext, useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TransferContext } from "@/context/transfers";
import { type NSTransfer, type NSFile } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import {
  AtSign,
  DollarSignIcon,
  DownloadIcon,
  MessageCircle,
} from "lucide-react";
import { handlePayApi } from "@/api";

const successImage = require("@/assets/successful-send.png");

export function TransferIndexCard({ slug }: { slug: string }) {
  const { getTransfer } = useContext(TransferContext);

  const {
    data: transfer,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["transfer", slug],
    queryFn: () => getTransfer(slug),
  });

  function handleDownload() {
    console.log("submit form data: ");
  }

  async function handlePay() {
    if(!transfer?.id || !transfer?.paymentStatus) return;
    const amount = Number(transfer?.paymentAmount);
    const payId = transfer?.id
    const res = await handlePayApi(payId, amount);
    if(res) {
      // toast({message: "Payment successfully"})
    }
  }

  return (
    <Card className="">
      {isLoading ? (
        <>
          <CardHeader>
            <CardTitle>We&apos;re searching for your transfer</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <h4 className="text-lg">Loading...</h4>
          </CardContent>
        </>
      ) : (
        <>
          {transfer !== undefined ? (
            <>
              <CardHeader>
                <CardTitle>Download when you&apos;re ready</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div>
                  <h4 className="text-lg truncate">{transfer?.title}</h4>
                  {transfer?.message && (
                    <p className="text-md text-muted-foreground">
                      {transfer.message}
                    </p>
                  )}
                </div>

                <Separator className="my-1" />

                <div className="flex justify-between items-center gap-2 w-full">
                  <div className="text-sm lowercase flex items-center gap-1 text-muted-foreground">
                    <AtSign className="h-4 w-4 uppercase text-primary" />
                    {transfer?.receiversEmail}
                  </div>

                  {transfer?.isPaid && (
                    <div className="text-sm lowercase flex items-center gap-1 text-muted-foreground">
                      <DollarSignIcon className="h-4 w-4 uppercase text-primary" />
                      {transfer?.paymentAmount}
                    </div>
                  )}

                  <div className="text-sm lowercase flex items-center gap-1 text-muted-foreground">
                    <DownloadIcon className="h-4 w-4 uppercase text-primary" />
                    {transfer?.downloadCount}
                  </div>
                </div>
                <Separator className="my-1" />

                <ScrollArea className="h-75 h-60">
                  <FileDisplayItem transfer={transfer!} />
                </ScrollArea>
              </CardContent>
              <CardFooter>
                {transfer!.isPaid ? (
                  <Button type="submit" onClick={handlePay} className="w-full">
                    Pay
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    onClick={handleDownload}
                    className="w-full"
                  >
                    Download Files
                  </Button>
                )}
              </CardFooter>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle>We couldn&apos;t find your transfer</CardTitle>
              </CardHeader>
              <CardContent>Not found</CardContent>
            </>
          )}
        </>
      )}
    </Card>
  );
}

function FileDisplayItem({ transfer }: { transfer: NSTransfer }) {
  return (
    <ScrollArea className="h-72 w-full">
      {transfer.files !== undefined ? (
        <div className="flex flex-col gap-2 pb-4 pt-0">
          {transfer.files.map((item) => (
            <TransferIndexPreviewSheet key={`file-${item.id}`} file={item} />
          ))}
        </div>
      ) : (
        <div>No files found</div>
      )}
    </ScrollArea>
  );
}
