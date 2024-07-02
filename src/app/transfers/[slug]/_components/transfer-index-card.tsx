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
  Loader2,
  MessageCircle,
} from "lucide-react";
import { handlePayApi } from "@/api";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

const successImage = require("@/assets/successful-send.png");

export function TransferIndexCard({ slug }: { slug: string }) {
  const { getTransfer } = useContext(TransferContext);
  const { toast } = useToast();
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [pendingPayConfirmation, setPendingPayConfirmation] = useState(false);
  const [payDetails, setPayDetails] = useState<any>();

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
    if (!transfer?.id || transfer?.paymentStatus) return;
    toast({ title: "Initiating payment" });

    const amount = Number(transfer?.paymentAmount);
    const payId = transfer?.id;
    const res = await handlePayApi(payId, amount, transfer?.walletAddress!);
    if (res) {
      setPayDetails(res.data);
    }
  }

  async function handleIHavePaid() {
    setPendingPayConfirmation(true);
  }

  return (
    <>
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
                    <Dialog
                      open={payDialogOpen}
                      onOpenChange={setPayDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          type="submit"
                          // onClick={}
                          className="w-full"
                        >
                          Pay
                        </Button>
                      </DialogTrigger>

                      {pendingPayConfirmation ? (
                        <>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Awaiting confirmation</DialogTitle>
                              <DialogDescription>
                                Please wait while we verify the payment
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center space-x-2">
                              {payDetails && (
                                <>
                                  <div className="flex items-center gap-1">
                                    <span className="text-md text-muted-foreground uppercase">
                                      00:10
                                    </span>
                                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                  </div>
                                </>
                              )}
                            </div>
                            {/* <DialogFooter className="sm:justify-start">
                              <Button
                                type="button"
                                onClick={() => {}}
                                size="sm"
                                className="px-3"
                                disabled={pendingPayConfirmation}
                              >
                                Do something
                              </Button>
                            </DialogFooter> */}
                          </DialogContent>
                        </>
                      ) : (
                        <>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Initiate Payment</DialogTitle>
                              <DialogDescription>
                                To pay make sure you include gas fees and send
                                no less than the USDT {transfer!.paymentAmount}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center space-x-2">
                              {payDetails && (
                                <>
                                  <div className="grid gap-1">
                                    <span className="text-xs text-muted-foreground uppercase">
                                      QR code
                                    </span>
                                    <span className="text-sm text-foreground">
                                      <img
                                        src={`data:image/png;base64,${payDetails.qrCode.qr_code}`}
                                        alt="Payment QR Code"
                                      />
                                    </span>
                                  </div>
                                  <div className="grid gap-1">
                                    <span className="text-xs text-muted-foreground uppercase">
                                      Pay to
                                    </span>
                                    <span className="text-sm text-foreground">
                                      {payDetails.address}
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                            <DialogFooter className="sm:justify-start">
                              {payDetails ? (
                                <Button
                                  type="button"
                                  onClick={handleIHavePaid}
                                  size="sm"
                                  className="px-3"
                                >
                                  I have paid
                                </Button>
                              ) : (
                                <Button
                                  type="button"
                                  onClick={handlePay}
                                  size="sm"
                                  className="px-3"
                                >
                                  Pay now
                                </Button>
                              )}
                            </DialogFooter>
                          </DialogContent>
                        </>
                      )}
                    </Dialog>
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
    </>
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
