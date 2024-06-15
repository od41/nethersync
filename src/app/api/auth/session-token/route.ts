import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

import { APILLION_API_KEY, APILLION_KEY_SECRET } from "@/server/config";

export async function GET(request: NextRequest) {
  try {
    const response = await axios.get(
      "https://api.apillon.io/auth/session-token",
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
