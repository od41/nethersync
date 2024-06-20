import { NextRequest, NextResponse } from 'next/server';
import { redis } from "@/server/config";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const uuid = searchParams.get('uuid');

  if (!uuid) {
    return NextResponse.json({ message: 'UUID is required' }, { status: 400 });
  }

  const fileData = await redis.hgetall(uuid);

  if (!fileData) {
    return NextResponse.json({ message: 'File not found' }, { status: 404 });
  }

  return NextResponse.json(fileData, { status: 200 });
}
