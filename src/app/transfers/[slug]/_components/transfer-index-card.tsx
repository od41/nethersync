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

  return (
    <Card>
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

                <Separator className="my-2" />

                <div className="grid gap-2 w-full">
                  <div>
                    <h4 className="text-lg lowercase">
                      {transfer?.receiversEmail}
                    </h4>
                    <p className="text-xs uppercase text-muted-foreground">
                      recipient mail
                    </p>
                  </div>

                  {transfer?.isPaid && (
                    <div>
                      <h4 className="text-lg">
                        {transfer?.paymentAmount} USDC
                      </h4>
                      <p className="text-xs uppercase text-muted-foreground">
                        payment amount
                      </p>
                    </div>
                  )}

                  <div>
                    <h4 className="text-lg uppercase">
                      {transfer?.downloadCount}
                    </h4>
                    <p className="text-xs uppercase text-muted-foreground">
                      download count
                    </p>
                  </div>
                </div>

                <FileDisplayItem transfer={transfer!} />
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  onClick={handleDownload}
                  className="w-full"
                >
                  Download Files
                </Button>
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
