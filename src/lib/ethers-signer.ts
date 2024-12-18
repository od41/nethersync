import { providers } from "ethers";
import { useMemo } from "react";
import type { Account, Chain, Client, Transport } from "viem";
import { usePublicClient } from "@particle-network/connectkit";

export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  return provider;
  const signer = provider.getSigner(account.address);
  return signer;
}

/** Hook to convert a Particle Connect Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const walletClient = usePublicClient(); // TODO: fix this type
  return useMemo(
    () => (walletClient ? clientToSigner(walletClient as any) : undefined),
    [walletClient]
  );
}
