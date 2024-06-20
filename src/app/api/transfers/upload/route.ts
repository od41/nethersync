import { redis } from "@/server/config";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { v4 as uuidv4 } from "uuid";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  // TODO
  // @ts-ignore
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.json();
  const {
    sendersEmail,
    recipientEmail,
    files,
    sessionId,
    isPaid,
    paymentAmount,
  } = formData;

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
    isPaid,
    paymentAmount: isPaid ? paymentAmount : 0,
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
