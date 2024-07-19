import { useState } from "react";
import { useAccount } from "wagmi";
import Button from "@/components/Button";
import {
  approveCUSD,
  CUSD_ADDRESS,
  SECURA_ADDRESS,
  transferCUSD,
} from "@/utils/transfer";
import { toast } from "react-toastify";
import { useERC20Balance } from "@/utils/useERC20Balance";
import { formatEther, parseEther } from "viem";
import {BigNumber} from "ethers";

type MintSecuraProps = {
  targetBalance: number;
  onUpdate: () => void;
};

const ONEKESINUSD = 0.4

export default function MintSecura({
  targetBalance,
  onUpdate,
}: MintSecuraProps) {
  const [loading, setLoading] = useState(false);
  const { address, isConnected } = useAccount();
  const secura = useERC20Balance(SECURA_ADDRESS);
  const cusd = useERC20Balance(CUSD_ADDRESS);
  const [transactionStatus, setTransactionStatus] = useState("initial");

  const targetWei = parseEther(targetBalance.toString());
  const mintAmount =
    targetWei < secura.balance ? BigInt(0) : targetWei - secura.balance;

  const payAmount =  BigInt(mintAmount) * BigInt(ONEKESINUSD*10) / BigInt(10);
  console.log(
    `balances: ${formatEther(secura.balance)} SEC (loading: ${secura.loading}) ${formatEther(cusd.balance)} cUSD (loading: ${cusd.loading})`,
  );

  const handleBuy = async () => {
    if (!isConnected || !address || mintAmount <= BigInt(0)) return;
    if (!cusd.loading && cusd.balance < payAmount) {
      // If balance is zero, redirect to the add cash link
      window.location.href = "https://minipay.opera.com/add_cash";
      return;
    }
    setLoading(true);
    try {
      setTransactionStatus("approving to send cUSD");
      await approveCUSD(address, payAmount);
      setTransactionStatus("approved sending cUSD to SECURA. Sending cUSD...");
      await transferCUSD(address, payAmount);
      setTransactionStatus("complete sending cUSD to SECURA.");
      await cusd.refetch();
      const newSecuraBalance = await secura.refetch();
      toast.success(
        `Transaction successful! - New SECURA Balance is ${newSecuraBalance}`,
      );
      onUpdate();
    } catch (error) {
      toast.error("Transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 mb-8">
      <div className="p-4 bg-white rounded-2xl shadow-lg text-slate-700">
        <h2 className="mb-2 text-lg font-bold">
          Purchase SECURA for M-Kura Vote.
        </h2>
        <p className="mb-4">
          {ONEKESINUSD} cUSD to purchase 1 SECURA. <br /> 1 SECURA to vote on proposals and{" "}
          <br /> 50 SECURA to create a proposal.
        </p>
        {!secura.loading && (
          <p className="font-semibold">
            Your current SECURA balance is {formatEther(secura.balance)}
          </p>
        )}
        {!cusd.loading && (
          <p className="font-semibold">
            Your current cUSD balance is {formatEther(cusd.balance)}
          </p>
        )}
      </div>
      <div className="p-4 bg-white rounded-2xl shadow-lg grid grid-cols-1 gap-4 w-full">
        <label className="flex flex-col">
          Spend
          <input
            type="text"
            placeholder=""
            value={`${formatEther(payAmount)} cUSD`}
            disabled
            className="border rounded-lg h-10 text-center"
          />
        </label>
        <label className="flex flex-col">
          to purchase
          <input
            type="text"
            placeholder=""
            value={`${formatEther(mintAmount)} SECURA`}
            disabled
            className="border rounded-lg h-10 text-center"
          />
        </label>
        <Button
          loading={loading}
          text={transactionStatus === "complete" ? "Bought successful" : "Buy"}
          onClick={handleBuy}
        />
        {transactionStatus === "complete" && (
          <div className="mx-auto max-w-xl text-lg text-green-700 leading-8 font-semibold">
            Transaction complete! - SECURA Balance is {secura.balance}
          </div>
        )}
      </div>
    </div>
  );
}
