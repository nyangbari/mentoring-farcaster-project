import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { DepositDto } from './dto/deposit.dto';
import { RewardDto } from './dto/reward.dto';
import { DistributeDto } from './dto/distribute.dto';
import { CancelDto } from './dto/cancel.dto';
import { GetReviewsQueryDto } from './dto/get-reviews-query.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './review.entity';

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

@ApiTags('Review')
@Controller('api/review')
export class ReviewQueryController {
  constructor(private readonly review: ReviewService) {}

  @Get()
  @ApiOkResponse({ description: 'Reviews written for a user\'s review requests' })
  @ApiQuery({ name: 'review_hash', required: true, type: String, description: '해쉬값 주면됨' })
  async getReviews(@Query() query: GetReviewsQueryDto) {
    const result = await this.review.getReviewsByHash(query.review_hash);

    return {
      items: result.items.map((item) => this.mapReviewResponse(item)),
      total_items: result.total,
    };
  }

  @Post('create-review')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateReviewDto })
  @ApiCreatedResponse({ description: 'Review successfully created' })
  async createReview(@Body() dto: CreateReviewDto) {
    const created = await this.review.createReview(dto);
    return this.mapReviewResponse(created);
  }

  private mapReviewResponse(item: Review) {
    return {
      review_id: item.id,
      review_request_id: item.review_request_id,
      review_hash: item.review_hash,
      reviewer_f_id: item.reviewer_f_id,
      reviewer_user_name: item.reviewer_user_name,
      reviewer_user_profile_url: item.reviewer_user_profile_url,
      reviewer_wallet_addr: item.reviewer_wallet_addr,
      rating: item.rating,
      summary: item.summary,
    };
  }
}