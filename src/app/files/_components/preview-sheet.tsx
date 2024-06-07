import React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Dot } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

export const PreviewSheet = () => {
  function handleCopy(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full">
            Preview
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-[50%] p-12 pt-0">
          <SheetHeader className="w-full">
            <div className="h-16 mb-12"></div>
            <SheetTitle className="text-3xl">File title</SheetTitle>
            <SheetDescription>
              <div className="flex gap-0 uppercase text-xs items-center">
                20M Ago <Dot /> 5MB <Dot /> JPEG
              </div>
            </SheetDescription>
          </SheetHeader>
          <Separator className="my-6" />
          <div className="flex space-x-2">
            <Input value="http://ns.xyz/link/to/document" readOnly />
            <Button
              variant="secondary"
              onClick={handleCopy}
              className="shrink-0"
            >
              Copy Link
            </Button>
          </div>
          <Separator className="my-6" />
          <div className="grid gap-4">
            <div>
              <h4 className="text-lg lowercase">mail@mail.com</h4>
              <p className="text-xs uppercase text-muted-foreground">
                recipient mail
              </p>
            </div>

            <div>
              <h4 className="text-lg lowercase">300 USDC</h4>
              <p className="text-xs uppercase text-muted-foreground">
                payment amount
              </p>
            </div>

            <div>
              <h4 className="text-lg uppercase">unpaid</h4>
              <p className="text-xs uppercase text-muted-foreground">
                payment status
              </p>
            </div>

            <div>
              <h4 className="text-lg uppercase">1</h4>
              <p className="text-xs uppercase text-muted-foreground">
                download count
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
