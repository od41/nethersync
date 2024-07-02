import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/server/config";

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
    price
  } = await req.json();
  try {
    // validate the callback data
    //check request body
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid request" },
      { status: 400 }
    );
  }

  try {
    // check if exists
    const txData = await redis.hgetall(uuid);
    if(!txData) {
      await redis.hset(uuid, {
        
      });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Duplicate transaction found" },
      { status: 400 }
    );
  }
  try {
    
    // store tx in transactions table
    // if it doesn't exist create new one
    // if it exists, check status and update status
    // if exists and status already confirmed, mark as duplicate and throw exception

    return NextResponse.json({ status }, { status: 200 });
  } catch (error) {
    console.error("Error confirming payment:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
