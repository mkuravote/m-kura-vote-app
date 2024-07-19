import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Connect() {
  return (
    <div className="p-4 bg-white rounded-2xl shadow-lg flex flex-col items-center">
      <h3 className="my-4 font-bold">Please connect your wallet.</h3>
      <div className="my-4 text-lg">
        <ConnectButton
          showBalance={{ smallScreen: true, largeScreen: false }}
        />
      </div>
    </div>
  );
}
