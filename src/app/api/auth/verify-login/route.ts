import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

import { APILLION_API_KEY, APILLION_KEY_SECRET } from "@/server/config";

export async function POST(request: NextRequest) {
  const { token } = await request.json();

  try {
    const response = await axios.post(
      "https://api.apillon.io/auth/verify-login",
      { token },
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(`${APILLION_API_KEY}:${APILLION_KEY_SECRET}`).toString(
              "base64"
            ),
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    // @ts-ignore
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
