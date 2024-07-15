import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { LitNetwork } from "@lit-protocol/constants";

const litJsConfig = {
  litNetwork: LitNetwork.DatilDev,
};

export const litNodeClient = new LitJsSdk.LitNodeClient(litJsConfig);

export const litProtocolChain = "baseGoerli";

export const credentialNFTContract = ""