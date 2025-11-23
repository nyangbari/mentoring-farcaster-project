// frontend/lib/api/checkWallet.ts
import { readContract } from 'wagmi/actions'
import { config } from '@/lib/wagmi'
import MyToken from '@/lib/abi/MyToken.json'

/**
 * _checkWallet
 * 해당 지갑의 ERC-20 토큰 잔액을 float(Number)로 반환
 */
export async function _checkWallet(walletAddr: string): Promise<number> {
  const balance = await readContract(config, {
    address: process.env.NEXT_PUBLIC_TOKEN_ADDRESS as `0x${string}`,
    abi: MyToken.abi,
    functionName: 'balanceOf',
    args: [walletAddr],
  })

  // balance는 BigInt → 소수 18자리 기준으로 숫자로 변환
  const readable = Number(balance) / 1e18
  return readable // float 느낌으로 사용하면 됨
}
