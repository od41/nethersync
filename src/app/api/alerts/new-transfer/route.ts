import { NextRequest, NextResponse } from "next/server";
import { sendTransferAlertToRecipient, sendTransferAlertToSender } from "@/lib/emails";
import { TransferAlertProps } from "@/lib/types";

export async function POST(req: NextRequest) {
  const {
    receiversEmail,
    sendersEmail,
    title,
    message,
    downloadLink,
    paymentWalletAddress,
    paymentAmount,
  } = await req.json();

  if (!receiversEmail || !sendersEmail || !downloadLink) {
    return NextResponse.json(
      { message: "Invalid email request" },
      { status: 400 }
    );
  }

  try {
    const senderOptions: TransferAlertProps = {
      title,
      sendersEmail:"info@nethersync.xyz",
      receiversEmail: sendersEmail,
      downloadLink,
      message,
      paymentWalletAddress,
      paymentAmount,
    };
    const receiverOptions: TransferAlertProps = {
      title,
      receiversEmail,
      downloadLink,
      message,
      sendersEmail,
      paymentWalletAddress,
      paymentAmount,
    };
    await sendTransferAlertToSender(senderOptions); // send email alert to sender
    await sendTransferAlertToRecipient(receiverOptions); // send email alert to recipient
    return NextResponse.json(
      {
        message: "success",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to send alert" },
      { status: 500 }
    );
  }
}
