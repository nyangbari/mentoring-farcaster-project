import { Injectable, BadRequestException } from '@nestjs/common'
import { TokenService } from '../blockchain/token.service'
import { VaultService } from '../vault/vault.service'

@Injectable()
export class ReviewService {
  constructor(
    private readonly token: TokenService,
    private readonly vault: VaultService
  ) {}

  /**
   * 리뷰 요청자가 토큰을 예치
   * 1. 온체인에서 실제 토큰 보유 확인
   * 2. 검증 성공 시 VaultService에 예치
   * 
   * @param requesterAddress - 리뷰 요청자의 지갑 주소
   * @param amount - 예치할 토큰 수량
   * @returns 업데이트된 Vault 정보
   */
  async depositTokens(requesterAddress: string, amount: number) {
    // Step 1: 온체인에서 실제 토큰 보유량 확인
    const balance = await this.token.getTokenBalance(requesterAddress)
    
    // Step 2: 예치하려는 금액이 보유량보다 많으면 에러
    if (balance < amount) {
      throw new BadRequestException(
        `잔액 부족: 보유 ${balance} 토큰, 요청 ${amount} 토큰`
      )
    }

    // Step 3: 최소 예치 금액 검증 (예: 최소 1토큰)
    if (amount < 1) {
      throw new BadRequestException('최소 1 토큰 이상 예치해야 합니다')
    }

    // Step 4: VaultService에 예치 정보 저장
    // 이 시점에서는 실제 토큰 전송은 하지 않고, 
    // "이 사용자가 이만큼 예치했다"는 기록만 남김
    const updated = await this.vault.deposit(requesterAddress, amount)

    return {
      requesterAddress,
      depositedAmount: amount,
      currentBalance: balance,
      vault: updated
    }
  }

  /**
   * 리뷰어에게 보상 지급
   * 1. Vault에서 예치금 확인 및 출금
   * 2. 온체인에서 실제 토큰 발행(mint)
   * 
   * @param requesterAddress - 리뷰 요청자 주소 (예치자)
   * @param reviewerAddress - 리뷰어 주소 (받는 사람)
   * @param amount - 지급할 토큰 수량
   * @returns 트랜잭션 영수증
   */
  async sendRewardToReviewer(
    requesterAddress: string,
    reviewerAddress: string,
    amount: number
  ) {
    // Step 1: Vault에서 예치금 확인
    const vaultBalance = await this.vault.getBalance(requesterAddress)
    
    if (vaultBalance < amount) {
      throw new BadRequestException(
        `예치금 부족: 예치된 ${vaultBalance} 토큰, 요청 ${amount} 토큰`
      )
    }

    // Step 2: Vault에서 예치금 차감
    await this.vault.withdraw(requesterAddress, amount)

    // Step 3: 온체인에서 리뷰어에게 토큰 발행
    const receipt = await this.token.sendTokens(reviewerAddress, amount)

    return {
      requesterAddress,
      reviewerAddress,
      rewardAmount: amount,
      remainingVault: vaultBalance - amount,
      txHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber
    }
  }

  /**
   * 여러 리뷰어에게 토큰 분배
   * 
   * @param requesterAddress - 리뷰 요청자 주소
   * @param distributions - 리뷰어별 지급 금액 배열
   * @returns 각 리뷰어에 대한 트랜잭션 결과
   */
  async distributeRewards(
    requesterAddress: string,
    distributions: Array<{ reviewerAddress: string; amount: number }>
  ) {
    // Step 1: 총 지급액 계산
    const totalAmount = distributions.reduce((sum, d) => sum + d.amount, 0)

    // Step 2: Vault 잔액 확인
    const vaultBalance = await this.vault.getBalance(requesterAddress)
    
    if (vaultBalance < totalAmount) {
      throw new BadRequestException(
        `예치금 부족: 예치된 ${vaultBalance} 토큰, 총 지급 요청 ${totalAmount} 토큰`
      )
    }

    // Step 3: 각 리뷰어에게 순차적으로 지급
    const results: any[] = []
    
    for (const dist of distributions) {
      try {
        const result = await this.sendRewardToReviewer(
          requesterAddress,
          dist.reviewerAddress,
          dist.amount
        )
        results.push({
          success: true,
          ...result
        })
      } catch (error: any) {
        results.push({
          success: false,
          reviewerAddress: dist.reviewerAddress,
          amount: dist.amount,
          error: error.message
        })
      }
    }

    return {
      totalDistributed: totalAmount,
      initialVault: vaultBalance,
      remainingVault: await this.vault.getBalance(requesterAddress),
      distributions: results
    }
  }

  /**
   * 예치 취소 (리뷰 요청 취소 시)
   * 
   * @param requesterAddress - 리뷰 요청자 주소
   * @param amount - 취소할 금액 (전액 취소 시 생략 가능)
   * @returns 업데이트된 Vault 정보
   */
  async cancelDeposit(requesterAddress: string, amount?: number) {
    const vaultBalance = await this.vault.getBalance(requesterAddress)
    
    const withdrawAmount = amount ?? vaultBalance
    
    if (withdrawAmount > vaultBalance) {
      throw new BadRequestException(
        `출금 불가: 예치된 ${vaultBalance} 토큰, 요청 ${withdrawAmount} 토큰`
      )
    }

    await this.vault.withdraw(requesterAddress, withdrawAmount)

    return {
      requesterAddress,
      canceledAmount: withdrawAmount,
      remainingVault: vaultBalance - withdrawAmount
    }
  }

  /**
   * 예치 잔액 조회
   */
  async getDepositBalance(requesterAddress: string) {
    const vaultBalance = await this.vault.getBalance(requesterAddress)
    const onchainBalance = await this.token.getTokenBalance(requesterAddress)

    return {
      requesterAddress,
      vaultBalance,      // 예치된 금액
      onchainBalance,    // 온체인 실제 잔액
    }
  }
}