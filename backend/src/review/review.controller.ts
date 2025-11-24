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
  @ApiOperation({ summary: '토큰 예치 (FID 기반, approve 불필요)' })
  @ApiResponse({ status: 200, description: '예치 성공' })
  @ApiResponse({ status: 400, description: '잔액 부족' })
  async deposit(@Body() dto: DepositDto) {
    return this.review.depositTokens(dto.requesterFid, dto.amount);
  }

  @Post('reward')
  @ApiOperation({ summary: '리뷰어에게 보상 지급 (FID 기반)' })
  @ApiResponse({ status: 200, description: '보상 지급 성공' })
  @ApiResponse({ status: 400, description: '예치금 부족' })
  async reward(@Body() dto: RewardDto) {
    return this.review.sendRewardToReviewer(
      dto.requesterFid,
      dto.reviewerFid,
      dto.amount,
    );
  }

  @Post('distribute')
  @ApiOperation({ summary: '여러 리뷰어에게 일괄 분배 (FID 기반)' })
  async distribute(@Body() dto: DistributeDto) {
    return this.review.distributeRewards(
      dto.requesterFid,
      dto.distributions,
    );
  }

  @Post('cancel')
  @ApiOperation({ summary: '예치 취소 (FID 기반)' })
  async cancel(@Body() dto: CancelDto) {
    return this.review.cancelDeposit(dto.requesterFid, dto.amount);
  }

  @Get('balance')
  @ApiOperation({ summary: '예치 잔액 조회 (FID 기반)' })
  @ApiQuery({
    name: 'fid',
    required: true,
    example: '1366990',
    description: 'Farcaster FID',
  })
  @ApiResponse({
    status: 200,
    description: '잔액 조회 성공',
    schema: {
      type: 'object',
      properties: {
        fid: { type: 'string' },
        vaultBalance: { type: 'number' },
        walletBalance: { type: 'number' },
      },
    },
  })
  async getBalance(@Query('fid') fid: string) {
    return this.review.getDepositBalance(fid);
  }
}