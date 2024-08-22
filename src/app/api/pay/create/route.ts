import { NextRequest, NextResponse } from "next/server";
import { MINIMUM_AMOUNT_USD } from "@/server/config";
import { cryptInstance } from "../_lib/crypt-instance";

export async function POST(req: NextRequest) {
  const { amount, payId, receiverWalletAddress } = await req.json();

  // TODO: include access control conditions for security

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
    const params = { payId, amount, receiverWalletAddress };
    const { totalAmount, NSFees, fees, qrCode, address } = await cryptInstance(
      params
    );
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
