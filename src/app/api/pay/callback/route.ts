import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { status, ...data } = await req.json();

    // Handle the payment status
    // You can update your database or perform other actions based on the status
    console.log('Payment Callback:', status, data);

    return NextResponse.json(
        { status },
        { status: 200 }
      )
};
