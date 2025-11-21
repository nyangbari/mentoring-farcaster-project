import { Controller, Post, Body } from '@nestjs/common'
import { ReviewService } from './review.service'

@Controller('review')
export class ReviewController {
  constructor(private readonly review: ReviewService) {}

  @Post('deposit')
  async deposit(@Body() body: { amount: number }) {
    const updated = await this.review.depositTokens(body.amount)
    return { vault: updated }
  }

  @Post('reward')
  async reward(@Body() body: { reviewerAddress: string; amount: number }) {
    const receipt = await this.review.sendRewardToReviewer(
      body.reviewerAddress,
      body.amount
    )
    return { txHash: receipt.transactionHash }
  }
}
