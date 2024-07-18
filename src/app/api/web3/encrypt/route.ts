import { NextRequest, NextResponse } from "next/server";
// import {  } from "@lit-protocol/lit-node-client";

export async function POST(req: NextRequest) {
  // Create the session capability object
  // const sessionCapabilityObject = new newSessionCapabilityObject();

  // // Create the Lit Resource keyed by `someResource`
  // const litResource = new LitAccessControlConditionResource('*');

  // // Add the capability to decrypt from the access control condition referred to by the
  // // lit resource.
  // sessionCapabilityObject.addCapabilityForResource(
  //     litResource,
  //     LitAbility.AccessControlConditionDecryption
  // );
  return NextResponse.json("ok", { status: 200 });
}
