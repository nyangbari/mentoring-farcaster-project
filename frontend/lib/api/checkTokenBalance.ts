import { readContract } from 'wagmi/actions'
import { config } from '@/lib/wagmi'
import MyToken from '@/lib/abi/MyToken.json'

export async function checkTokenBalance(addr: string): Promise<boolean> {
  const balance = await readContract(config, {
    address: process.env.NEXT_PUBLIC_TOKEN_ADDRESS as `0x${string}`,
    abi: MyToken.abi,
    functionName: 'balanceOf',
    args: [addr],
  })

  const readable = Number(balance) / 1e18
  return readable > 0
}
