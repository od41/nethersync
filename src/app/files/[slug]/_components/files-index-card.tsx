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
import { useRouter } from "next/navigation";
import { FileIndexPreviewSheet } from "./file-index-preview-sheet";
import { useContext, useState } from "react";
import { Dot } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ApplicationContext, type NSFile } from "@/context/files";

const successImage = require("@/assets/successful-send.png");

export function FilesIndexCard() {
  const [sendStatus, setSendStatus] = useState(false);

  const { files } = useContext(ApplicationContext);

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

        <FileDisplayItem files={files!} />
      </CardContent>
      <CardFooter>
        <Button type="submit" onClick={handleDownload} className="w-full">
          Download Files
        </Button>
      </CardFooter>
    </Card>
  );
}

function FileDisplayItem({ files }: { files: NSFile[] }) {
  const { file, setFile } = useContext(ApplicationContext);

  return (
    <ScrollArea className="h-72 w-full">
      {file ? (
        <div className="flex flex-col gap-2 pb-4 pt-0">
          {files.map((item) => (
            <FileIndexPreviewSheet key={`file-${item.id}`} file={item} />
          ))}
        </div>
      ) : (
        <div>No files found</div>
      )}
    </ScrollArea>
  );
}
