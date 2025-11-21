import { Controller, Post, Get, Body, Query } from '@nestjs/common'
import { ReviewService } from './review.service'

@Controller('review')
export class ReviewController {
  constructor(private readonly review: ReviewService) {}

  /**
   * 리뷰 요청 시 토큰 예치
   * POST /review/deposit
   * Body: { requesterAddress: string, amount: number }
   */
  @Post('deposit')
  async deposit(
    @Body() body: { requesterAddress: string; amount: number }
  ) {
    const result = await this.review.depositTokens(
      body.requesterAddress,
      body.amount
    )
    return result
  }

  /**
   * 단일 리뷰어에게 보상 지급
   * POST /review/reward
   * Body: { requesterAddress: string, reviewerAddress: string, amount: number }
   */
  @Post('reward')
  async reward(
    @Body()
    body: {
      requesterAddress: string
      reviewerAddress: string
      amount: number
    }
  ) {
    const result = await this.review.sendRewardToReviewer(
      body.requesterAddress,
      body.reviewerAddress,
      body.amount
    )
    return result
  }

  /**
   * 여러 리뷰어에게 토큰 분배
   * POST /review/distribute
   * Body: { 
   *   requesterAddress: string, 
   *   distributions: [{ reviewerAddress: string, amount: number }]
   * }
   */
  @Post('distribute')
  async distribute(
    @Body()
    body: {
      requesterAddress: string
      distributions: Array<{ reviewerAddress: string; amount: number }>
    }
  ) {
    const result = await this.review.distributeRewards(
      body.requesterAddress,
      body.distributions
    )
    return result
  }

  /**
   * 예치 취소 (리뷰 요청 취소)
   * POST /review/cancel
   * Body: { requesterAddress: string, amount?: number }
   */
  @Post('cancel')
  async cancel(
    @Body() body: { requesterAddress: string; amount?: number }
  ) {
    const result = await this.review.cancelDeposit(
      body.requesterAddress,
      body.amount
    )
    return result
  }

  /**
   * 예치 잔액 조회
   * GET /review/balance?address=0x...
   */
  @Get('balance')
  async getBalance(@Query('address') address: string) {
    const result = await this.review.getDepositBalance(address)
    return result
  }
}