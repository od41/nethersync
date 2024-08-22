import { NextRequest, NextResponse } from "next/server";
// @ts-ignore
const CryptAPI = require("@cryptapi/api");
import {
  BASE_URL,
  NETHERSYNC_FEES_WALLET_ADDRESS,
  NS_FEES_PERCENTAGE,
  MINIMUM_AMOUNT_USD,
} from "@/server/config";
import { AllowedCurrency } from "@/lib/types";

export async function POST(req: NextRequest) {
  const { amount, payId, receiverWalletAddress } = await req.json();

  if (!payId || !amount) {
    return NextResponse.json(
      { message: "PayId and amount are required" },
      { status: 400 }
    );
  }

  if (amount < MINIMUM_AMOUNT_USD) {
    return NextResponse.json(
      { message: `Amount is too small, send $${MINIMUM_AMOUNT_USD} or more` },
      { status: 400 }
    );
  }

  try {
    // Create a new CryptAPI instance
    const callbackUrl = `${BASE_URL}/api/pay/callback`;
    const nsParams = {
      pay_id: payId,
    };
    const NSFees = Number(NS_FEES_PERCENTAGE) * amount;
    const receiversPercentage = 1.0 - Number(NS_FEES_PERCENTAGE); // 90 percent
    const totalAmount = amount + NSFees;
    const cryptapiParams = { post: 1 };
    const recipientAddresses = `${NS_FEES_PERCENTAGE}@${NETHERSYNC_FEES_WALLET_ADDRESS}|${receiversPercentage}@${receiverWalletAddress}`;
    // const ca = new CryptAPI(coin, myAddress, callbackUrl, params, cryptapiParams)
    const ca = new CryptAPI(
      AllowedCurrency.POLYGON_USDT,
      recipientAddresses,
      callbackUrl,
      nsParams,
      cryptapiParams
    );
    const address = await ca.getAddress();
    const qrCode = await ca.getQrcode(totalAmount);
    const fees = await CryptAPI.getEstimate(AllowedCurrency.POLYGON_USDT);
    // Respond with the payment details
    return NextResponse.json(
      {
        message: "success",
        totalAmount,
        NSFees,
        gasFees: {
          amount: fees.estimated_cost,
          amountInFiat: fees.estimated_cost_currency,
        },
        payQrCode: qrCode.qr_code,
        payAddress: address,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
