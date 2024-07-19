import snapshot from "@snapshot-labs/snapshot.js";
import { Web3Provider } from "@ethersproject/providers";
import { useAccount } from "wagmi";

const client = new snapshot.Client712(
  process.env.NEXT_PUBLIC_SNAPSHOT_API || "https://hub.snapshot.org/",
);

export function useSnapshotClient() {
  const { address } = useAccount();

  // @ts-ignore
  const web3 = new Web3Provider(window.ethereum);

  return {
    client,
    web3,
    address,
  };
}
