import { useAccount } from "wagmi";
import { useCallback, useEffect, useState } from "react";
import { getERC20balance } from "@/utils/transfer";
import { Address } from "viem";

export function useERC20Balance(contract: Address) {
  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState(BigInt(0));
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (isConnected && address) {
      const balance = await getERC20balance(contract, address);
      setBalance(balance);
      setLoading(false);
      return balance;
    }
    return BigInt(0);
  }, [isConnected, address]);

  useEffect(() => {
    setLoading(true);
    refetch();
  }, [isConnected, address]);

  return {
    balance,
    loading,
    refetch,
  };
}
