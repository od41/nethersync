import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/server/config";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;

  if (!slug) {
    return NextResponse.json({ message: "Slug is required" }, { status: 400 });
  }

  const fileData = await redis.hgetall(slug);

  console.log("filddata", fileData);

  if (!fileData) {
    return NextResponse.json({ message: "File not found" }, { status: 404 });
  }

  return NextResponse.json(fileData, { status: 200 });
}
