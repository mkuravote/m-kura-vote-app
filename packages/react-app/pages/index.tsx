import Connect from "@/components/Connect";
import MintSecura from "@/components/MintSecura";
import Proposals from "@/components/Proposals";
import { useAccount } from "wagmi";
import { useERC20Balance } from "@/utils/useERC20Balance";
import { SECURA_ADDRESS } from "@/utils/transfer";
import { useEffect, useState } from "react";
import { parseEther } from "viem";

export default function Home() {
  const { isConnected } = useAccount();
  const { balance, loading, refetch } = useERC20Balance(SECURA_ADDRESS);

  // circumvent server-side rendering
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) return null;

  // Step 1: Check if the user has connected their wallet
  if (!isConnected) {
    return <Connect />;
  }

  if (loading) {
    return null;
  }

  // Step 2: Check if the user has sufficient balance
  if (isConnected && balance < parseEther("1")) {
    return <MintSecura targetBalance={1} onUpdate={refetch} />;
  }

  // Step 3: Show Snapshot Proposals
  if (isConnected) {
    return <Proposals/>;
  }
}
