import { redis } from "@/server/config";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { v4 as uuidv4 } from "uuid";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NSTransfer } from "@/lib/types";

export async function POST(request: NextRequest) {
  // TODO
  // @ts-ignore
  // const session = await getServerSession(authOptions);

  // if (!session) {
  //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  // }

  const formData: NSTransfer = await request.json();

  const {
    sendersEmail,
    receiversEmail,
    files,
    id: sessionId,
    isPaid,
    paymentAmount,
    title,
    message,
    size,
    downloadCount,
    sentTimestamp,
    paymentStatus,
  } = formData;

  if (
    sendersEmail === "" ||
    receiversEmail === "" ||
    files === undefined ||
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
    receiversEmail,
    files,
    isPaid,
    paymentAmount: isPaid ? paymentAmount : 0,
    title,
    message: message ? message : "",
    size,
    downloadCount,
    sentTimestamp,
    paymentStatus,
  });

  return NextResponse.json(
    {
      message: "File uploaded successfully",
      sessionId,
    },
    { status: 200 }
  );
}
