import { NextRequest, NextResponse } from "next/server";
import { sendTransferAlert } from "@/lib/emails";
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
    const options: TransferAlertProps = {
      title,
      receiversEmail,
      downloadLink,
      message,
      sendersEmail,
      paymentWalletAddress,
      paymentAmount,
    };
    await sendTransferAlert(options);
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
