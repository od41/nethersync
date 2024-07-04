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
  console.log("sig_b64", sig_b64);
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

  console.log("PAY_ID", payId); //TODO

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
    const TX_COLLECTION = collection(firestore, "transactions");
    const txDocRef = doc(TX_COLLECTION, payId!);
    const txDoc = await getDoc(txDocRef);

    const TRANSFERS_COLLECTION = collection(firestore, "transfers");
    const transferDocRef = doc(TRANSFERS_COLLECTION, payId!);
    const transferDoc = await getDoc(transferDocRef);
    // check if exists
    if (txDoc.exists()) {
      const isComplete = txDoc.data().isComplete;
      if (isComplete) {
        // if for some reason it's already recorded as complete but CryptAPI is still pinging the endpoint for that transaction
        return NextResponse.json("ok", { status: 200 });
      } else if (Number(pending) === 0) {
        // if isComplete is false, and status is true, then update
        // update transaction record
        await updateDoc(txDocRef, {
          isComplete: true,
          timeStamp: Timestamp.now(),
        });

        // update transfer record
        await updateDoc(transferDocRef, {
          paymentStatus: true,
          payTimeStamp: Timestamp.now(),
        });
        return NextResponse.json("ok", { status: 200 });
      }
    } else {
      await setDoc(txDocRef, {
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
        NSFees: 0, // TODO
        price,
      });

      // update transfer record
      await updateDoc(transferDocRef, {
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
