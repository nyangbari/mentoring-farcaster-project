import { Injectable } from '@nestjs/common'
import { ethers } from 'ethers'
import * as MyToken from '../blockchain/MyToken.json'

@Injectable()
export class TokenService {
  private provider: ethers.JsonRpcProvider
  private wallet: ethers.Wallet
  private contract: ethers.Contract

  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL)
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, this.provider)

    this.contract = new ethers.Contract(
      process.env.TOKEN_ADDRESS!,
      MyToken.abi,
      this.wallet
    )
  }

  async sendTokens(address: string, num: number) {
    const amount = ethers.parseUnits(num.toString(), 18)
    const tx = await this.contract.mint(address, amount)
    return tx.wait()
  }

  async checkTokenBalance(address: string): Promise<boolean> {
    const bal = await this.contract.balanceOf(address)
    return Number(ethers.formatUnits(bal, 18)) > 0
  }
}
