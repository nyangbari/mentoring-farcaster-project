// frontend/lib/server/sendTokensServer.ts
import { ethers } from "ethers";
import MyToken from "@/lib/abi/MyToken.json";

export async function sendTokensServer(walletAddr: string, amount: number) {
  const rpc = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;
  const privateKey = process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY; // owner pk 넣기
  const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;

  if (!rpc) throw new Error("RPC URL missing");
  if (!privateKey) throw new Error("Admin PRIVATE_KEY missing");
  if (!tokenAddress) throw new Error("TOKEN ADDRESS missing");

  const provider = new ethers.JsonRpcProvider(rpc);
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(tokenAddress, MyToken.abi, wallet);

  const value = ethers.parseUnits(amount.toString(), 18);

  const tx = await contract.mint(walletAddr, value);
  const receipt = await tx.wait();

  return receipt;
}
