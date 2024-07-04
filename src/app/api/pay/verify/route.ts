import { NextRequest, NextResponse } from "next/server";
// @ts-ignore
const CryptAPI = require("@cryptapi/api");
import { BASE_URL, NETHERSYNC_FEES_WALLET_ADDRESS } from "@/server/config";
import { AllowedCurrency } from "@/lib/types";

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
    const callbackUrl = `${BASE_URL}/api/pay/callback`;
    const NSParams = {
      pay_id: payId,
    };
    const cryptapiParams = { post: 1 };

    const ca = new CryptAPI(
      AllowedCurrency.POLYGON_USDT,
      receiverWalletAddress,
      callbackUrl,
      NSParams,
      cryptapiParams
    );
    const logs = await ca.checkLogs();
    if (!logs.callbacks) {
      return NextResponse.json(
        { message: "Transaction pending" },
        { status: 202 }
      );
    }
    const result: string = logs.callbacks[0].result; // result of the latest callback
    const timeStamp = logs.callbacks[0].last_update;

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
