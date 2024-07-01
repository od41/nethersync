import { NextRequest, NextResponse } from "next/server";
// @ts-ignore
const CryptAPI = require("@cryptapi/api");
import { BASE_URL } from "@/server/config";

export async function POST(req: NextRequest) {
  const { amount, payId } = await req.json();

  if (!payId || !amount) {
    return NextResponse.json(
      { message: "PayId and amount are required" },
      { status: 400 }
    );
  }

  try {
    // Create a new CryptAPI instance
    const coin = "polygon/usdt";
    const myAddress = "0x260EC69F4622B7a2a9e53DA78F19E6ff8AC8649E";
    const callbackUrl = `${BASE_URL}/api/pay/callback`;
    // const ca = new CryptAPI(coin, myAddress, callbackUrl, params, cryptapiParams)
    const ca = new CryptAPI(coin, myAddress, callbackUrl, { payId });
    const address = await ca.getAddress();
    const qrCode = await ca.getQrcode(amount);
    const fees = await CryptAPI.getEstimate(coin);
    console.log(">>>cryptapi", ca);
    console.log(">>>address", address);
    console.log(">>>qrcode", qrCode);
    console.log(">>>fees", fees);

    // Respond with the payment details
    return NextResponse.json({ message: "success", fees, qrCode, address  }, { status: 200 });
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
