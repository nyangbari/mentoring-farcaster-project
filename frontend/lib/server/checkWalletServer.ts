// frontend/lib/server/checkWalletServer.ts
import { ethers } from "ethers";
import MyToken from "@/lib/abi/MyToken.json";

export async function checkWalletServer(walletAddr: string): Promise<number> {
  // 환경변수에서 RPC 읽기
  const rpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;
  const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;

  if (!rpcUrl) throw new Error("RPC URL missing (NEXT_PUBLIC_SEPOLIA_RPC_URL)");
  if (!tokenAddress) throw new Error("TOKEN ADDRESS missing (NEXT_PUBLIC_TOKEN_ADDRESS)");

  const provider = new ethers.JsonRpcProvider(rpcUrl);

  const contract = new ethers.Contract(
    tokenAddress,
    MyToken.abi,
    provider
  );

  const bal = await contract.balanceOf(walletAddr);
  const readable = Number(ethers.formatUnits(bal, 18));

  return readable; // float 반환
}
