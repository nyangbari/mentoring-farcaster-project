import { Injectable } from '@nestjs/common'
import { TokenService } from '../blockchain/token.service'
import { VaultService } from '../vault/vault.service'

@Injectable()
export class ReviewService {
  constructor(
    private readonly token: TokenService,
    private readonly vault: VaultService
  ) {}

  // 예치
  async depositTokens(num: number) {
    return this.vault.deposit(num)
  }

  // 리뷰어에게 보상 지급
  async sendRewardToReviewer(reviewerAddr: string, amount: number) {
    // Vault에서 출금
    this.vault.withdraw(amount)

    // 온체인 토큰 발행
    return await this.token.sendTokens(reviewerAddr, amount)
  }
}
