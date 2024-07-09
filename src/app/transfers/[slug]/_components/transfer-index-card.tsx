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
import { handlePayApi, handleConfirmPaymentApi } from "@/api";
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

const notFound = require("@/assets/not-found.svg");

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
    console.log("addres", transfer?.walletAddress!);
    const res = await handlePayApi(payId, amount, transfer?.walletAddress!);
    if (res) {
      setPayDetails(res.data);
    }
  }

  async function handleIHavePaid() {
    if (!transfer?.id || transfer?.paymentStatus) return;
    setPendingPayConfirmation(true);

    const amount = Number(transfer?.paymentAmount);
    const payId = transfer?.id;
    const res: any = await handleConfirmPaymentApi(
      payId,
      amount,
      transfer?.walletAddress!
    );
    if (res.result === "done") {
      toast({
        title: "payment complete",
        description: `Payment verified on ${res.timeStamp}`,
      });
      setPendingPayConfirmation(false);
      console.log("payment confirmed", res);
    }
  }

  if (isLoading) {
    return (
      <Card className="h-[40vh]">
        <CardHeader className="flex items-center h-full justify-center gap-3">
          <Loader2 className="mr-2 h-8 w-8 text-primary animate-spin" />
          <CardTitle className="text-lg">Fetching transfer details</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card className="max-h-[84vh] min-h-[40vh] justify-center md:max-h-[70vh]">
        {transfer !== undefined ? (
          <>
            <CardHeader>
              <CardTitle className="text-lg">{transfer?.title}</CardTitle>
              <div>
                {transfer?.message && (
                  <p className="text-sm text-muted-foreground">
                    {transfer.message}
                  </p>
                )}
              </div>
            </CardHeader>
            <CardContent className="grid gap-3">
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
              <FileDisplayItem transfer={transfer!} />
            </CardContent>
            <CardFooter>
              {transfer!.isPaid && !transfer!.paymentStatus ? (
                <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
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
                          <DialogTitle>Awaiting confirmationnn</DialogTitle>
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
                              <Button // TODO remove this
                                type="button"
                                onClick={handleIHavePaid}
                                size="sm"
                                className="px-3"
                              >
                                I have paid
                              </Button>
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
                            Pay the TOTAL AMOUNT to the specified address then,
                            click &apos;I have paid&apos;
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 space-x-2">
                          {payDetails && (
                            <>
                              <div className="grid gap-1 w-1/2">
                                <span className="text-xs text-muted-foreground uppercase">
                                  QR code
                                </span>
                                <span className="text-sm text-foreground">
                                  <img
                                    src={`data:image/png;base64,${payDetails.payQrCode}`}
                                    alt="Payment QR Code"
                                  />
                                </span>
                              </div>
                              <div className="grid gap-1 w-full">
                                <div>
                                  <span className="text-xs text-muted-foreground uppercase">
                                    Pay to
                                  </span>
                                  <span className="text-sm text-foreground">
                                    {payDetails.payAddress}
                                  </span>
                                </div>

                                <div>
                                  <span className="text-xs text-muted-foreground uppercase">
                                    NetherSync Fees
                                  </span>
                                  <span className="text-sm text-foreground">
                                    USDT{" "}
                                    {(
                                      payDetails.totalAmount -
                                      transfer?.paymentAmount!
                                    ).toFixed(2)}
                                  </span>
                                </div>

                                <div>
                                  <span className="text-xs text-muted-foreground uppercase">
                                    Blockchain Fees
                                  </span>
                                  <span className="text-sm text-foreground">
                                    {payDetails.gasFees.amount} MATIC
                                    {/* // TODO remove hardcoded value  */}
                                  </span>
                                </div>

                                <div>
                                  <span className="text-xs text-muted-foreground uppercase">
                                    Total Amount
                                  </span>
                                  <span className="text-sm text-foreground">
                                    USDT {payDetails.totalAmount.toFixed(2)}
                                  </span>
                                </div>
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
            <CardHeader className="">
              <Image
                src={String(notFound.default.src)}
                width={200}
                height={200}
                className="mx-auto"
                alt="Files sent successfully"
              />
              <CardTitle className="text-center text-lg">
                Transfer not found
              </CardTitle>
              <CardContent className="text-center text-muted-foreground pb-0">
                Please recheck the link.
              </CardContent>
            </CardHeader>
          </>
        )}
      </Card>
    </>
  );
}

function FileDisplayItem({ transfer }: { transfer: NSTransfer }) {
  return (
    <ScrollArea className="min-h-fit h-[16rem] md:h-[11rem]">
      {transfer.files !== undefined ? (
        <div className="grid gap-2 pb-4 pt-0">
          {transfer.files.map((item) => (
            <TransferIndexPreviewSheet key={`file-${item.id}`} file={item} />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground font-display text-lg">
          No files found
        </div>
      )}
    </ScrollArea>
  );
}
