import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ethers } from 'ethers'
import * as MyToken from '../blockchain/MyToken.json'

@Injectable()
export class TokenService {
  private provider: ethers.JsonRpcProvider
  private wallet: ethers.Wallet
  private contract: ethers.Contract

  constructor(private configService: ConfigService) {
    const rpcUrl = this.configService.get<string>('SEPOLIA_RPC_URL')
    const privateKey = this.configService.get<string>('PRIVATE_KEY')
    const tokenAddress = this.configService.get<string>('TOKEN_ADDRESS')

    console.log('🔍 환경변수 확인:')
    console.log('SEPOLIA_RPC_URL:', rpcUrl ? '✅' : '❌')
    console.log('PRIVATE_KEY length:', privateKey?.length || 0)
    console.log('TOKEN_ADDRESS:', tokenAddress ? '✅' : '❌')

    if (!rpcUrl || !privateKey || !tokenAddress) {
      throw new Error('필수 환경변수가 설정되지 않았습니다!')
    }

    const cleanPrivateKey = privateKey.trim().replace(/^0x/, '')
    
    if (cleanPrivateKey.length !== 64) {
      throw new Error(`Invalid private key length: ${cleanPrivateKey.length}`)
    }

    this.provider = new ethers.JsonRpcProvider(rpcUrl)
    this.wallet = new ethers.Wallet(cleanPrivateKey, this.provider)
    this.contract = new ethers.Contract(tokenAddress, MyToken.abi, this.wallet)

    console.log('✅ TokenService 초기화 완료')
    console.log('🔑 서버 지갑 주소:', this.wallet.address)
  }

  /**
   * 사용자가 서버에 토큰 전송 (Escrow)
   * 사용자는 먼저 approve()를 호출해야 함
   */
  async transferToServer(userAddress: string, amount: number) {
    const amountWei = ethers.parseUnits(amount.toString(), 18)
    
    // 서버 지갑으로 토큰 가져오기
    const tx = await this.contract.transferFrom(
      userAddress,
      this.wallet.address,
      amountWei
    )
    return tx.wait()
  }

  /**
   * 서버가 보유한 토큰을 다른 주소로 전송
   */
  async transferFromServer(toAddress: string, amount: number) {
    const amountWei = ethers.parseUnits(amount.toString(), 18)
    const tx = await this.contract.transfer(toAddress, amountWei)
    return tx.wait()
  }

  /**
   * 토큰 발행 (mint) - 관리자 전용
   */
  async sendTokens(address: string, amount: number) {
    const amountWei = ethers.parseUnits(amount.toString(), 18)
    const tx = await this.contract.mint(address, amountWei)
    return tx.wait()
  }

  /**
   * 사용자의 approve 상태 확인
   */
  async getAllowance(ownerAddress: string): Promise<number> {
    const allowance = await this.contract.allowance(
      ownerAddress,
      this.wallet.address
    )
    return Number(ethers.formatUnits(allowance, 18))
  }

  async checkTokenBalance(address: string): Promise<boolean> {
    const bal = await this.contract.balanceOf(address)
    return Number(ethers.formatUnits(bal, 18)) > 0
  }

  async getTokenBalance(address: string): Promise<number> {
    const bal = await this.contract.balanceOf(address)
    return Number(ethers.formatUnits(bal, 18))
  }

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
      contractAddress: await this.contract.getAddress(),
      serverWallet: this.wallet.address
    }
  }
}