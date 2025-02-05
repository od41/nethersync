import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import firebaseAdmin from "@/lib/firebase-admin";
import { verify } from "./_lib/verify";

function convertToJSON(queryString: string): Record<string, any> {
  // Split the query string by '&' to get the individual key-value pairs
  const pairs = queryString.split("&");

  // Reduce the pairs into an object
  const result = pairs.reduce((acc, pair) => {
    const [key, value] = pair.split("=");
    acc[key] = value;
    return acc;
  }, {} as Record<string, any>);

  return result;
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const payId = searchParams.get("pay_id");

  // validate the callback data
  let sig_b64 = req.headers.get("x-ca-signature");

  if (!sig_b64) {
    return NextResponse.json(
      { message: "Unauthorized request. no signature" },
      { status: 401 }
    );
  }

  let signature = new Buffer(sig_b64!, "base64");

  // req.headers.set("content-type", "application/json"); // Ensure correct content type
  const rawBody = await req.text();

  const isSignatureValid = verify(rawBody, signature);

  if (!isSignatureValid) {
    //check request body
    return NextResponse.json(
      { message: "Unauthorized request" },
      { status: 401 }
    );
  }

  const processedData = convertToJSON(rawBody);
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
  } = processedData;

  try {
    const TX_COLLECTION = "transactions";
    const txDocRef = firebaseAdmin.collection(TX_COLLECTION).doc(payId!);
    const txDoc = await txDocRef.get();

    const TRANSFERS_COLLECTION = "transfers";
    const transferDocRef = firebaseAdmin
      .collection(TRANSFERS_COLLECTION)
      .doc(payId!);

    // check if exists
    if (txDoc.exists) {
      const txDocData = txDoc.data() as any; // TODO: Add correct types
      const isComplete = txDocData.isComplete;
      if (isComplete) {
        // if for some reason it's already recorded as complete but CryptAPI is still pinging the endpoint for that transaction
        return NextResponse.json("ok", { status: 200 });
      } else if (Number(pending) === 0) {
        // if isComplete is false, and status is true, then update
        // update transaction record
        await txDocRef.update({
          isComplete: true,
          timeStamp: Timestamp.now(),
        });

        // update transfer record
        await transferDocRef.update({
          paymentStatus: true,
          payTimeStamp: Timestamp.now(),
        });
        return NextResponse.json("ok", { status: 200 });
      }
    } else {
      await txDocRef.set({
        isComplete: true,
        pending: false,
        timeStamp: Timestamp.now(),
        hash: txid_in,
        amount: value_forwarded_coin,
        currency: coin,
        addressIn: address_in,
        receiver: address_out,
        txidOut: txid_out,
        confirmations,
        gasFees: fee_coin,
        NSFees: 0, // TODO: add actual fees amount
        price,
      });

      // update transfer record
      await transferDocRef.update({
        paymentStatus: true,
        payTimeStamp: Timestamp.now(),
      });
      return NextResponse.json("ok", { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 406 }
    );
  }
}
