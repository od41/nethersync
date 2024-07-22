import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { useAccount, useSignMessage } from "wagmi";

import { LitNetwork } from "@lit-protocol/constants";
import { uint8arrayToString } from "@lit-protocol/uint8arrays";

import { AuthCallbackParams } from "@lit-protocol/types";

import {
  LitAbility,
  createSiweMessageWithRecaps,
  LitAccessControlConditionResource,
  generateAuthSig,
} from "@lit-protocol/auth-helpers";
import { Signer } from "ethers";
import { SIGNING_URL_ROOT } from "@/client/config";

const litJsConfig = {
  litNetwork: LitNetwork.Cayenne,
};

export const litProtocolChain = "baseSepolia";

export const credentialNFTContract = "";

export const initLitClient = async () => {
  try {
    const client = new LitJsSdk.LitNodeClient(litJsConfig);
    await client.connect();
    return client;
  } catch (error) {
    console.error("error connecting client", error);
  }
};

export const getSessionSignatures = async (
  litNodeClient: LitJsSdk.LitNodeClient,
  signer: Signer
) => {
  if (!litNodeClient) return;
  // Get the latest blockhash
  const latestBlockhash = await litNodeClient.getLatestBlockhash();
  const address = await signer.getAddress();

  // Define the authNeededCallback function
  const authNeededCallback = async ({
    uri,
    expiration,
    resourceAbilityRequests,
  }: AuthCallbackParams) => {
    // Prepare the SIWE message for signing
    const toSign = await createSiweMessageWithRecaps({
      uri: uri!,
      expiration: expiration!,
      resources: resourceAbilityRequests!,
      walletAddress: address,
      nonce: latestBlockhash,
      litNodeClient: litNodeClient,
      statement:
        "Sign this message that will be used to encrypt or decrypt your messages on NetherSync.xyz",
      domain: SIGNING_URL_ROOT,
    });

    // Generate the authSig
    const authSig = await generateAuthSig({
      signer,
      toSign,
    });

    return authSig;
  };

  // Define the Lit resource
  const litResource = new LitAccessControlConditionResource("*");

  // Get the session signatures
  const sessionSigs = await litNodeClient.getSessionSigs({
    chain: litProtocolChain,
    resourceAbilityRequests: [
      {
        resource: litResource,
        ability: LitAbility.AccessControlConditionDecryption,
      },
    ],
    authNeededCallback,
    // capacityDelegationAuthSig, //TODO
  });
  return sessionSigs;
};

const accessControlConditions = [
  // TODO
  {
    contractAddress: "",
    standardContractType: "",
    chain: litProtocolChain,
    method: "eth_getBalance",
    parameters: [":userAddress", "latest"],
    returnValueTest: {
      comparator: ">=",
      value: "0",
    },
  },
];

export const encryptFile = async (
  file: File,
  litNodeClient: LitJsSdk.LitNodeClient,
  signer: Signer
) => {
  if (!file || !litNodeClient) return;

  try {
    const sessionSigs = await getSessionSignatures(litNodeClient, signer);
    const fileResZip = await LitJsSdk.encryptFileAndZipWithMetadata({
      file,
      chain: litProtocolChain,
      accessControlConditions,
      sessionSigs: sessionSigs!,
      litNodeClient,
      readme: "Encrypted on NetherSync.xyz. Decrypt by recipient",
    });

    const encryptedBlob = new Blob([fileResZip], { type: "text/plain" });
    const encryptedFile = new File([encryptedBlob], file.name);

    await litNodeClient.disconnect();
    return encryptedFile;
  } catch (error) {
    await litNodeClient.disconnect();
    console.error("error encrypting", error);
  }
};

export const decryptFile = async (
  encryptedFile: File | Blob,
  litNodeClient: LitJsSdk.LitNodeClient,
  signer: Signer
) => {
  if (!encryptedFile || !litNodeClient) return;

  try {
    const sessionSigs = await getSessionSignatures(litNodeClient, signer);

    const decryptedFileResponse = await LitJsSdk.decryptZipFileWithMetadata({
      file: encryptedFile,
      sessionSigs,
      litNodeClient,
    });

    const { decryptedFile, metadata } = decryptedFileResponse!;

    const decryptedBlob = new Blob([decryptedFile], {
      type: "application/octet-stream",
    });

    await litNodeClient.disconnect();

    return decryptedBlob;
  } catch (error) {
    await litNodeClient.disconnect();
    console.error("error decrypting", error);
  }
};

export const disconnect = () => {
  LitJsSdk.disconnectWeb3();
};
