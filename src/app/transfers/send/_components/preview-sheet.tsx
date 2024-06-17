import React, { useContext } from "react";
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
import { FilesContext } from "@/context/transfers";
import { formatDistanceToNow } from "date-fns";
import { URL_ROOT } from "@/client/config";

export const PreviewSheet = () => {
  const { transfer: completedTransfer } = useContext(FilesContext);
  function handleCopy(): void {
    throw new Error("Function not implemented.");
  }

  if (!completedTransfer) {
    return;
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
            <SheetTitle className="text-3xl">
              {completedTransfer?.title}
            </SheetTitle>
            <SheetDescription>
              <div className="flex gap-0 uppercase text-xs items-center">
                {formatDistanceToNow(
                  new Date(completedTransfer!.sentTimestamp),
                  { addSuffix: true }
                )}{" "}
                <Dot /> {completedTransfer!.size}
                <Dot />{" "}
                {completedTransfer!.files
                  ? completedTransfer!.files.length
                  : 0}{" "}
                File(s)
              </div>
            </SheetDescription>
          </SheetHeader>
          <Separator className="my-6" />
          <div className="flex space-x-2">
            <Input
              value={`${URL_ROOT}/transfers/${completedTransfer!.id}`}
              readOnly
            />
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
              <h4 className="text-lg lowercase">
                {completedTransfer!.receiver}
              </h4>
              <p className="text-xs uppercase text-muted-foreground">
                receiver
              </p>
            </div>

            {completedTransfer!.message && (
              <div>
                <h4 className="text-lg lowercase">
                  {completedTransfer!.message}
                </h4>
                <p className="text-xs uppercase text-muted-foreground">
                  message
                </p>
              </div>
            )}

            {completedTransfer!.isPaid && (
              <div>
                <h4 className="text-lg uppercase">
                  {completedTransfer!.paymentAmount} USDC
                </h4>
                <p className="text-xs uppercase text-muted-foreground">
                  payment amount
                </p>
              </div>
            )}

            {completedTransfer!.isPaid && (
              <div>
                <h4 className="text-lg uppercase">
                  {completedTransfer!.paymentStatus ? "paid" : "unpaid"}
                </h4>
                <p className="text-xs uppercase text-muted-foreground">
                  payment status
                </p>
              </div>
            )}

            <div>
              <h4 className="text-lg uppercase">
                {completedTransfer!.downloadCount}
              </h4>
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