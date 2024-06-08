import { redis } from "@/server/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.json();
  const {
    sendersEmail,
    recipientEmail,
    files,
    sessionId,
    isPaid,
    paymentAmount,
  } = formData;
  console.log(
    "DEBUG>>>",
    files,
    sessionId,
    sendersEmail,
    recipientEmail,
    isPaid,
    paymentAmount
  );
  if (
    sendersEmail === "" ||
    recipientEmail === "" ||
    files.length < 1 ||
    sessionId === ""
  ) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }
  // @ts-ignore
  await redis.hset(sessionId, {
    sendersEmail,
    recipientEmail,
    files,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json(
    {
      message: "File uploaded successfully",
      sessionId,
    },
    { status: 200 }
  );
}
