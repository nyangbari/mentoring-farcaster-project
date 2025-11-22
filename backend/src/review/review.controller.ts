import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { DepositDto } from './dto/deposit.dto';
import { RewardDto } from './dto/reward.dto';
import { DistributeDto } from './dto/distribute.dto';
import { CancelDto } from './dto/cancel.dto';

@ApiTags('Review')
@Controller('review')
export class ReviewController {
  constructor(private readonly review: ReviewService) {}

  @Post('deposit')
  @ApiOperation({ summary: '토큰 예치' })
  @ApiResponse({ status: 200, description: '예치 성공' })
  @ApiResponse({ status: 400, description: '잔액 부족' })
  async deposit(@Body() dto: DepositDto) {
    const result = await this.review.depositTokens(
      dto.requesterAddress,
      dto.amount
    );
    return result;
  }

  @Post('reward')
  @ApiOperation({ summary: '리뷰어에게 보상 지급' })
  @ApiResponse({ status: 200, description: '보상 지급 성공' })
  @ApiResponse({ status: 400, description: '예치금 부족' })
  async reward(@Body() dto: RewardDto) {
    const result = await this.review.sendRewardToReviewer(
      dto.requesterAddress,
      dto.reviewerAddress,
      dto.amount
    );
    return result;
  }

  @Post('distribute')
  @ApiOperation({ summary: '여러 리뷰어에게 일괄 분배' })
  async distribute(@Body() dto: DistributeDto) {
    const result = await this.review.distributeRewards(
      dto.requesterAddress,
      dto.distributions
    );
    return result;
  }

  @Post('cancel')
  @ApiOperation({ summary: '예치 취소' })
  async cancel(@Body() dto: CancelDto) {
    const result = await this.review.cancelDeposit(
      dto.requesterAddress,
      dto.amount
    );
    return result;
  }

  @Get('balance')
  @ApiOperation({ summary: '예치 잔액 조회' })
  @ApiQuery({ 
    name: 'address', 
    required: true, 
    example: '0x6b4f81F0391A2c977d78A3156390DA001D3baBa7',
    description: '지갑 주소'
  })
  @ApiResponse({ 
    status: 200, 
    description: '잔액 조회 성공',
    schema: {
      type: 'object',
      properties: {
        requesterAddress: { type: 'string' },
        vaultBalance: { type: 'number' },
        onchainBalance: { type: 'number' }
      }
    }
  })
  async getBalance(@Query('address') address: string) {
    const result = await this.review.getDepositBalance(address);
    return result;
  }
}