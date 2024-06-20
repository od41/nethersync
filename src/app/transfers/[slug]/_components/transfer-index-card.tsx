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
import { NSTransfer, TransferContext, type NSFile } from "@/context/transfers";

const successImage = require("@/assets/successful-send.png");

export function TransferIndexCard({ slug }: { slug: string }) {
  const { files, transfer, getTransfer } = useContext(TransferContext);

  useEffect(() => {
    getTransfer(slug);
    console.log("slug", slug, transfer);
  }, [slug]);

  function handleDownload() {
    console.log("submit form data: ");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Download when you&apos;re ready</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div>
          <h4 className="text-lg">File title</h4>
          <p className="text-md text-muted-foreground">message from user</p>
        </div>

        {transfer && <FileDisplayItem transfer={transfer!} />}
      </CardContent>
      <CardFooter>
        <Button type="submit" onClick={handleDownload} className="w-full">
          Download Files
        </Button>
      </CardFooter>
    </Card>
  );
}

function FileDisplayItem({ transfer }: { transfer: NSTransfer }) {
  const { file, setFile } = useContext(TransferContext);
  const { files } = transfer;

  return (
    <ScrollArea className="h-72 w-full">
      {file ? (
        <div className="flex flex-col gap-2 pb-4 pt-0">
          {files &&
            files.map((item) => (
              <TransferIndexPreviewSheet key={`file-${item.id}`} file={item} />
            ))}
        </div>
      ) : (
        <div>No files found</div>
      )}
    </ScrollArea>
  );
}
