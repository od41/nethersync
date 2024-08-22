import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase/firestore";
import firebaseAdmin from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const payId = searchParams.get("pay_id");

  try {
    const TX_COLLECTION = "transactions";
    const txDocRef = firebaseAdmin.collection(TX_COLLECTION).doc(payId!);
    const txDoc = await txDocRef.get();

    await txDocRef.set({
      isComplete: true,
      pending: false,
      timeStamp: Timestamp.now(),
    });
    return NextResponse.json("ok", { status: 200 });
  } catch (error) {
    console.log("callback error>>", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 406 }
    );
  }
}
