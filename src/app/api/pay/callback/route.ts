import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { verify } from "./_lib/verify";

export async function POST(req: NextRequest) {
  const {
    uuid,
    address_in,
    address_out,
    txid_in,
    txid_out,
    confirmations,
    value_forwarded_coin,
    fee_coin,
    coin,
    pending,
    price,
  } = await req.json();
  const { searchParams } = new URL(req.url);
  const payId = searchParams.get("pay_id");

  // validate the callback data
  let sig_b64 = req.headers.get("x-ca-signature");
  if (!sig_b64) {
    return NextResponse.json(
      { message: "Unauthorized request" },
      { status: 401 }
    );
  }

  let signature = new Buffer(sig_b64, "base64");

  req.headers.set("content-type", "application/json"); // Ensure correct content type
  const rawBody = await req.text();

  const isSignatureValid = verify(rawBody, signature);

  if (!isSignatureValid) {
    //check request body
    return NextResponse.json(
      { message: "Unauthorized request" },
      { status: 401 }
    );
  }

  console.log("PAY_ID", payId); //TODO

  try {
    const TX_COLLECTION = collection(firestore, "transactions");
    const docRef = doc(TX_COLLECTION, uuid);
    const txDoc = await getDoc(docRef);
    // check if exists
    if (txDoc.exists()) {
      const isComplete = txDoc.data().isComplete;
      if (isComplete) {
        return NextResponse.json(
          { message: "Duplicate transaction found" },
          { status: 400 }
        );
      } else if (pending === 0) {
        // if isComplete is false, and status is true, then update
        await updateDoc(docRef, {
          isComplete: true,
          timeStamp: Timestamp.now(),
        });
        return NextResponse.json(
          { message: "Transaction successful" },
          { status: 200 }
        );
      }
    } else {
      await setDoc(docRef, {
        isComplete: pending === 0,
        pending: pending === 1,
        timeStamp: Timestamp.now(),
        hash: txid_in,
        amount: value_forwarded_coin,
        currency: coin,
        addressIn: address_in,
        receiver: address_out,
        txidOut: txid_out,
        confirmations,
        gasFees: fee_coin,
        NSFees: 0, // TODO
        price,
      });
      return NextResponse.json({ message: "ok" }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Duplicate transaction found" },
      { status: 400 }
    );
  }
}
