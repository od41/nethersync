import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { useAccount, useSignMessage } from "wagmi";

import { LitNetwork } from "@lit-protocol/constants";
import { uint8arrayToString } from "@lit-protocol/uint8arrays";

import {
  AuthCallbackParams,
  EncryptToJsonPayload,
  DecryptFromJsonProps,
  EncryptToJsonDataType,
} from "@lit-protocol/types";

import {
  LitAbility,
  createSiweMessageWithRecaps,
  LitAccessControlConditionResource,
  generateAuthSig,
} from "@lit-protocol/auth-helpers";
import { Signer } from "ethers";
import { EncryptedFile } from "./types";

const litJsConfig = {
  litNetwork: LitNetwork.Cayenne,
};

export const litProtocolChain = "baseGoerli";

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
    const encryptedPayloadString = await LitJsSdk.encryptToJson({
      file,
      chain: litProtocolChain,
      accessControlConditions,
      // sessionSigs
      litNodeClient,
    });

    await litNodeClient.disconnect();
    return encryptedPayloadString;
  } catch (error) {
    await litNodeClient.disconnect();
    console.error("error encrypting", error);
  }
};

export const decryptFile = async (
  encryptedFile: EncryptedFile,
  litNodeClient: LitJsSdk.LitNodeClient,
  signer: Signer
) => {
  if (!encryptedFile || !litNodeClient) return;

  try {
    const sessionSigs = await getSessionSignatures(litNodeClient, signer);

    console.log("sessionsigs", sessionSigs);
    console.log("encyrptmeta", encryptedFile);

    const parsedJsonData = JSON.parse(encryptedFile.ciphertext);
    console.log("parsed", parsedJsonData);

    // const parsedJsonData = {
    //   dataType: "string" as EncryptToJsonDataType,
    //   accessControlConditions,
    //   chain: litProtocolChain,
    //   ciphertext: encryptedFile.ciphertext,
    //   dataToEncryptHash: encryptedFile.dataToEncryptHash,
    // };
    const decryptedFileResponse = await LitJsSdk.decryptFromJson({
      parsedJsonData: parsedJsonData!,
      sessionSigs: sessionSigs!,
      litNodeClient,
    });

    console.log("decrypted file response", decryptedFileResponse);

    const decryptedFile = new Blob([decryptedFileResponse]);
    console.log("decrypted file", decryptedFile);
    await litNodeClient.disconnect();

    return decryptedFile;
  } catch (error) {
    await litNodeClient.disconnect();
    console.error("error decrypting", error);
  }
};

export const disconnect = () => {
  LitJsSdk.disconnectWeb3();
};
