// frontend/lib/wagmi.ts
import { createConfig, http } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [sepolia],
  connectors: [injected()], // MetaMask 등 브라우저 지갑
  transports: {
    [sepolia.id]: http(),   // 테스트 용도로 기본 RPC 사용
  },
})
