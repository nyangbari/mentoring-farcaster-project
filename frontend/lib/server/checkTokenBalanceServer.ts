import { ethers } from 'ethers'
import MyToken from '@/lib/abi/MyToken.json'

export async function checkTokenBalanceServer(addr: string, threshold: number) {
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL)
  const contract = new ethers.Contract(process.env.NEXT_PUBLIC_TOKEN_ADDRESS!, MyToken.abi, provider)
  const bal = await contract.balanceOf(addr)
  return Number(bal) / 1e18 >= threshold
}
