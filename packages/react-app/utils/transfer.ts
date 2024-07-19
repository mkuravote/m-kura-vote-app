import {
  Address,
  createPublicClient,
  createWalletClient,
  custom,
  encodeFunctionData,
  formatEther,
  http,
  parseAbi,
  type SendTransactionParameters,
} from "viem";
import { celo } from "viem/chains";

export const CUSD_ADDRESS: Address =
  "0x765de816845861e75a25fca122bb6898b8b1282a";
//export const CKES_ADDRESS: Address = "0x456a3D042C0DbD3db53D5489e98dFb038553B0d0";
export const SECURA_ADDRESS: Address =
  (process.env.NEXT_PUBLIC_BUY_TOKENS_ADDRESS as Address) ||
  "0x42bBb6B7312f2b7789Ffb7c7eD2f403F233D071c";

// Celo mainnet client
const publicClient = createPublicClient({
  chain: celo,
  transport: http(),
});

// Transaction sender with fee currency support
const sendTransaction = async (
  tx: SendTransactionParameters<typeof celo>,
  walletClient: any,
) => {
  const gas = await publicClient.estimateGas(tx);
  return walletClient.sendTransaction({ ...tx, gas });
};

export const approveCUSD = async (userAddress: Address, amount: bigint) => {
  if (window?.ethereum) {
    const walletClient = createWalletClient({
      account: userAddress,
      chain: celo,
      transport: custom(window.ethereum!),
    });

    const cusdAbi = parseAbi([
      "function approve(address, uint256) returns (bool)",
    ] as const);

    const data = encodeFunctionData({
      abi: cusdAbi,
      functionName: "approve",
      args: [SECURA_ADDRESS, amount],
    });

    let hash = await sendTransaction(
      {
        feeCurrency: CUSD_ADDRESS,
        to: CUSD_ADDRESS,
        data,
        chain: celo,
        account: userAddress,
      },
      walletClient,
    );

    return await publicClient.waitForTransactionReceipt({
      hash,
    });
  }
};

export const transferCUSD = async (userAddress: Address, amount: bigint) => {
  console.log("transferCUSD - amount", amount);
  if (window?.ethereum) {
    const walletClient = createWalletClient({
      account: userAddress,
      chain: celo,
      transport: custom(window.ethereum),
    });

    const securaAbi = parseAbi([
      "function receiveCUSD(uint256) public",
    ] as const);

    const data = encodeFunctionData({
      abi: securaAbi,
      functionName: "receiveCUSD",
      args: [amount],
    });

    let hash = await sendTransaction(
      {
        to: SECURA_ADDRESS,
        data,
        feeCurrency: CUSD_ADDRESS,
        chain: celo,
        account: userAddress,
      },
      walletClient,
    );

    return await publicClient.waitForTransactionReceipt({
      hash,
    });
  }
};

export const checkCUSDBalance = async (userAddress: Address) => {
  const cusdAbi = parseAbi([
    "function balanceOf(address account) public view returns (uint256)",
  ] as const);

  const balanceInBigNumber = await publicClient.readContract({
    address: CUSD_ADDRESS,
    abi: cusdAbi,
    functionName: "balanceOf",
    args: [userAddress],
  });

  console.log("checkCUSDBalance - balance", balanceInBigNumber);
  return formatEther(balanceInBigNumber);
};

/*export const approveCKES = async (userAddress: string, amount: string) => {
  //@ts-ignore
  if (window?.ethereum) {
    //@ts-ignore
    const provider = new ethers.providers.Web3Provider(window?.ethereum);
    const signer = await provider.getSigner(userAddress);

    const ckesAbi = [
      "function approve(address spender, uint256 amount) public returns (bool)",
    ];

    const CKESContract = new ethers.Contract(CKES_ADDRESS, ckesAbi, signer);

    // Approve the Secura contract to spend CKES tokens
    const approval = await CKESContract.approve(
      SECURA_ADDRESS,
      ethers.utils.parseEther(amount),
    );
    await approval.wait();
  }
};

export const transferCKES = async (userAddress: string, amount: string) => {
  //@ts-ignore
  if (window?.ethereum) {
    //@ts-ignore
    const provider = new ethers.providers.Web3Provider(window?.ethereum);
    const signer = await provider.getSigner(userAddress);
    const securaAbi = ["function receiveCKES(uint256 amount) public"];
    const SecuraContract = new ethers.Contract(
      SECURA_ADDRESS,
      securaAbi,
      signer,
    );

    // Call receiveCKES on the Secura contract to handle the transfer and mint
    let txn = await SecuraContract.receiveCKES(ethers.utils.parseEther(amount));
    await txn.wait();
  }
};*/

export const checkSECURABalance = async (
  userAddress: Address,
): Promise<bigint> => {
  const securaAbi = parseAbi([
    "function balanceOf(address account) public view returns (uint256)",
  ] as const);

  return await publicClient.readContract({
    address: SECURA_ADDRESS,
    abi: securaAbi,
    functionName: "balanceOf",
    args: [userAddress],
  });
};

export const getERC20balance = async (
  contract: Address,
  account: Address,
): Promise<bigint> => {
  const abi = parseAbi([
    "function balanceOf(address account) public view returns (uint256)",
  ] as const);

  return await publicClient.readContract({
    address: contract,
    abi,
    functionName: "balanceOf",
    args: [account],
  });
};
