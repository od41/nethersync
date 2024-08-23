import { NextRequest, NextResponse } from "next/server";
import { cryptInstance } from "../_lib/crypt-instance";

export async function POST(req: NextRequest) {
  const { amount, payId, receiverWalletAddress } = await req.json();

  if (!payId || !amount) {
    return NextResponse.json(
      { message: "PayId and amount are required" },
      { status: 400 }
    );
  }

  try {
    // Create a new CryptAPI instance
    const params = { payId, amount, receiverWalletAddress };
    const { ca } = await cryptInstance(params);
    const logs = await ca.checkLogs();
    console.log("logs", logs);

    if (!logs.callbacks) {
      return NextResponse.json(
        { message: "Transaction pending" },
        { status: 202 }
      );
    }
    const result: string = logs.callbacks[0].result; // result of the latest callback
    const timeStamp = logs.callbacks[0].last_update;

    // TODO: update the transfer record on firebase, if the payment has been verified and the hasPaid is still false0
 0
    // Respond with details about that payment
    return NextResponse.json(
      { message: "success", result, timeStamp },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error verifiying payment: ${payId}`, error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
