"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SingleTransferSheet } from "./single-transfer-sheet";
import { useContext, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FilesContext, type NSFile } from "@/context/transfers";

const successImage = require("@/assets/successful-send.png");

export function TransfersCard() {
  const { files } = useContext(FilesContext);

  function handleDownload() {
    console.log("submit form data: ");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfers</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div>
          <h4 className="text-lg">File title</h4>
          <p className="text-md text-muted-foreground">message from user</p>
        </div>

        <FileDisplayItem files={files!} />
      </CardContent>
      <CardFooter>
        {/* <Button type="submit" onClick={handleDownload} className="w-full">
          Download Files
        </Button> */}
      </CardFooter>
    </Card>
  );
}

function FileDisplayItem({ files }: { files: NSFile[] }) {
  const { file, setFile } = useContext(FilesContext);

  return (
    <ScrollArea className="h-72 w-full">
      {file ? (
        <div className="flex flex-col gap-2 pb-4 pt-0">
          {files.map((item) => (
            <SingleTransferSheet key={`file-${item.id}`} file={item} />
          ))}
        </div>
      ) : (
        <div>No files found</div>
      )}
    </ScrollArea>
  );
}
