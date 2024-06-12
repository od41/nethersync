import { redis } from "@/server/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.json();
  const data = formData;

  return NextResponse.json(
    {
      message: "Success",
    },
    { status: 200 }
  );
}
