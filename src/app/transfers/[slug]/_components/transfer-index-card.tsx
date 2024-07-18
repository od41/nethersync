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
  AlertCircle,
  CopyIcon,
  CopyCheck,
  CheckCheckIcon,
} from "lucide-react";
import { handlePayApi, handleConfirmPaymentApi } from "@/api";
import { useToast } from "@/components/ui/use-toast";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { handleCopy } from "@/lib/utils";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const notFound = require("@/assets/not-found.svg");

export function TransferIndexCard({ slug }: { slug: string }) {
  const { getTransfer } = useContext(TransferContext);
  const { toast } = useToast();
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [pendingPayConfirmation, setPendingPayConfirmation] = useState(false);
  const [payDetails, setPayDetails] = useState<any>();
  const [isCopied, setIsCopied] = useState(false);
  const { isConnected } = useAccount();

  const {
    data: transfer,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["transfer", slug],
    queryFn: () => getTransfer(slug),
  });

  async function handleDownload() {
    if (!transfer!.files || !isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect a wallet and try again",
      });
      return;
    }
    //download cipher
    const encryptedFiles = transfer!.files;
    // Fetch the blob data
    encryptedFiles.forEach((encFile) => {});
    // const response =encryptedFiles.map( await fetch(matchingBinaryItem.link);)
    // const blobData = await response.blob();

    // console.log("utimestamp", matchingBinaryItem.createTime, metadataItem.size);
    //decrypt
    // download to hdd
    console.log("submit form data: ");
  }

  async function handlePay(isDialogOpen: boolean) {
    if (!transfer?.id || transfer?.paymentStatus) return;

    setPayDialogOpen(isDialogOpen);

    const amount = Number(transfer?.paymentAmount);
    const payId = transfer?.id;
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
                <Dialog open={payDialogOpen} onOpenChange={handlePay}>
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
                          <DialogTitle>Verifying Payment</DialogTitle>
                          <DialogDescription>
                            This will take a few moments
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex items-center space-x-2">
                          {payDetails && (
                            <>
                              <div className="flex items-center justify-center w-full py-3 gap-1">
                                <Loader2 className="ml-2 h-8 w-8 text-primary animate-spin" />
                              </div>
                              {/* <Button // TODO remove this...using for debug
                                type="button"
                                onClick={handleIHavePaid}
                                size="sm"
                                className="px-3"
                              >
                                I have paid
                              </Button> */}
                            </>
                          )}
                        </div>
                      </DialogContent>
                    </>
                  ) : (
                    <>
                      <DialogContent className="sm:max-w-md">
                        {payDetails ? (
                          <div className="flex items-center space-x-2">
                            <>
                              <div className="flex items-center justify-center w-full py-3 gap-1">
                                <Loader2 className="ml-2 h-8 w-8 text-primary animate-spin" />
                              </div>
                            </>
                          </div>
                        ) : (
                          <>
                            <DialogHeader>
                              <DialogTitle>Payment Details</DialogTitle>
                              <DialogDescription>
                                To finalize your download, kindly complete the
                                payment by sending the amount to the provided
                                address.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-3 space-x-2">
                              {payDetails && (
                                <>
                                  <div className="flex flex-col md:flex-row rounded-md w-full justify-center items-center gap-2">
                                    {/* <span className="text-xs text-muted-foreground uppercase">
                                  QR code
                                </span> */}
                                    <div className=" w-3/5">
                                      <img
                                        src={`data:image/png;base64,${payDetails.payQrCode}`}
                                        alt="Payment QR Code"
                                      />
                                    </div>

                                    <Alert variant="default">
                                      <AlertCircle className="h-4 w-4" />
                                      <AlertTitle className="text-sm">
                                        Polygon (or MATIC) Network{" "}
                                      </AlertTitle>
                                      <AlertDescription className="text-xs">
                                        Only send USDT on the Polygon (or MATIC)
                                        network. If sent to another network, we
                                        won&apos;t be able to recover the funds
                                      </AlertDescription>
                                    </Alert>
                                  </div>

                                  <div className="grid gap-1 w-full">
                                    <span className="text-xs text-muted-foreground uppercase">
                                      Pay to
                                    </span>
                                    <div className="text-sm text-foreground flex flex-col gap-2 md:gap-0 md:flex-row md:items-center justify-between w-full">
                                      <span className="w-[280px] text-clip overflow-x-scroll">
                                        {payDetails.payAddress}{" "}
                                      </span>

                                      <span>
                                        <Button
                                          variant="outline"
                                          size="icon"
                                          onClick={() => {
                                            handleCopy(payDetails.payAddress);
                                            setIsCopied(true);
                                          }}
                                        >
                                          {isCopied ? (
                                            <CheckCheckIcon className="h-3 w-3" />
                                          ) : (
                                            <CopyIcon className="h-3 w-3" />
                                          )}
                                        </Button>
                                      </span>
                                    </div>
                                  </div>
                                  <Separator className="my-1" />

                                  <div className="grid gap-1 w-full">
                                    <div className="w-full flex items-center justify-between">
                                      <span className="text-xs text-muted-foreground uppercase">
                                        NetherSync Fees
                                      </span>
                                      <span className="text-sm text-foreground">
                                        <span className="text-xs">$</span>{" "}
                                        {(
                                          payDetails.totalAmount -
                                          transfer?.paymentAmount!
                                        ).toFixed(2)}
                                      </span>
                                    </div>

                                    <div className="w-full flex items-center justify-between">
                                      <span className="text-xs text-muted-foreground uppercase">
                                        Network Fees
                                      </span>
                                      <span className="text-sm text-foreground">
                                        {payDetails.gasFees.amount}{" "}
                                        <span className="text-xs">MATIC</span>
                                        {/* // TODO remove hardcoded value  */}
                                      </span>
                                    </div>

                                    <Separator className="my-2" />

                                    <div className="w-full flex items-center justify-between">
                                      <span className="text-xs text-muted-foreground uppercase">
                                        Total Amount
                                      </span>
                                      <span className="text-sm text-foreground">
                                        <span className="text-xs">$</span>{" "}
                                        {payDetails.totalAmount.toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                            <DialogFooter className="sm:justify-start">
                              <Button
                                type="button"
                                onClick={handleIHavePaid}
                                variant="outline"
                                className="w-full"
                              >
                                I have paid
                              </Button>
                            </DialogFooter>
                          </>
                        )}
                      </DialogContent>
                    </>
                  )}
                </Dialog>
              ) : (
                <>
                  {isConnected ? (
                    <Button
                      type="submit"
                      onClick={handleDownload}
                      className="w-full"
                    >
                      Download Files
                    </Button>
                  ) : (
                    <ConnectButton />
                  )}
                </>
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
