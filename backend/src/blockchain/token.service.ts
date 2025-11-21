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

  /**
   * 특정 주소에 토큰 발행 (mint)
   * 
   * @param address - 토큰을 받을 주소
   * @param num - 발행할 토큰 수량
   * @returns 트랜잭션 영수증
   */
  async sendTokens(address: string, num: number) {
    const amount = ethers.parseUnits(num.toString(), 18)
    const tx = await this.contract.mint(address, amount)
    return tx.wait()
  }

  /**
   * 특정 주소의 토큰 잔액 확인 (boolean 반환)
   * 
   * @param address - 확인할 주소
   * @returns 토큰 보유 여부 (0보다 큰지)
   */
  async checkTokenBalance(address: string): Promise<boolean> {
    const bal = await this.contract.balanceOf(address)
    return Number(ethers.formatUnits(bal, 18)) > 0
  }

  /**
   * 특정 주소의 정확한 토큰 잔액 조회 (숫자 반환)
   * 
   * @param address - 확인할 주소
   * @returns 토큰 잔액 (소수점 포함)
   */
  async getTokenBalance(address: string): Promise<number> {
    const bal = await this.contract.balanceOf(address)
    return Number(ethers.formatUnits(bal, 18))
  }

  /**
   * 토큰 컨트랙트 정보 조회
   * 
   * @returns 토큰 이름, 심볼, 총 공급량
   */
  async getTokenInfo() {
    const [name, symbol, totalSupply] = await Promise.all([
      this.contract.name(),
      this.contract.symbol(),
      this.contract.totalSupply()
    ])

    return {
      name,
      symbol,
      totalSupply: Number(ethers.formatUnits(totalSupply, 18)),
      contractAddress: await this.contract.getAddress()
    }
  }
}