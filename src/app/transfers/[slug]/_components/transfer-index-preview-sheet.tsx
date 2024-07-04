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
import { TransferContext } from "@/context/transfers";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type NSFile } from "@/lib/types";

const placeholderImage = require("@/assets/placeholder.jpg");

export const TransferIndexPreviewSheet = ({ file }: { file: NSFile }) => {
  const { file: selectedFile, setFile } = useContext(TransferContext);

  function handleCopy(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <button
            key={file.id}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent w-full",
              selectedFile && selectedFile!.id === file.id && "bg-muted"
            )}
            onClick={() => setFile(file)}
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{file.name}</div>
                </div>
                {/* <div
                  className={cn(
                    "ml-auto text-xs",
                    selectedFile && selectedFile!.id === file.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                ></div> */}
              </div>
              {/* <div className="text-xs font-medium">{file.name}</div> */}
            </div>

            <div className="flex gap-0 uppercase text-xs items-center">
              {file.size} <Dot /> {file.format}
            </div>
          </button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-[50%] p-12 pt-0">
          <ScrollArea className="h-full pr-4">
            <SheetHeader className="w-full">
              <div className="h-16 mb-12"></div>
              <SheetTitle className="text-3xl">{file.name}</SheetTitle>
              <SheetDescription>
                <div className="flex gap-0 uppercase text-xs items-center">
                  {formatDistanceToNow(new Date(file.uploadTimestamp), {
                    addSuffix: true,
                  })}{" "}
                  <Dot /> {file.size} <Dot /> {file.format}
                </div>
              </SheetDescription>
            </SheetHeader>

            <Separator className="my-6" />
            <div className="grid gap-4 pb-8">
              {file.src && (
                <Image
                  src={file.src}
                  width={500}
                  height={500}
                  alt={`${file.name}-photo preview`}
                />
              )}
            </div>
          </ScrollArea>
          <SheetFooter className="absolute bottom-0 right-0 py-6 px-12 bg-background w-full flex md:justify-start">
            {/* {<Button>Download &quot;{file!.name.slice(0, 10)}...&quot;</Button>} */}
            Pay Fee to download file
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};
