import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { GetReviewsQueryDto } from './dto/get-reviews-query.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './review.entity';

@ApiTags('Review')
@Controller('api/review')
export class ReviewQueryController {
  constructor(private readonly review: ReviewService) {}

  @Get()
  @ApiOkResponse({ description: 'Reviews written for a user\'s review requests' })
  async getReviews(@Query() query: GetReviewsQueryDto) {
    const result = await this.review.getReviewsForRequester(query.user_id, query.page, 10);

    return {
      items: result.items.map((item) => this.mapReviewResponse(item)),
      total_items: result.total,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Review successfully created' })
  async createReview(@Body() dto: CreateReviewDto) {
    const created = await this.review.createReview(dto);
    return this.mapReviewResponse(created);
  }

  private mapReviewResponse(item: Review) {
    return {
      review_id: item.id,
      review_hash: item.review_hash,
      reviewer_user_id: item.reviewer_user_id,
      reviewer_user_name: item.reviewer_user_name,
      reviewer_user_profile_url: item.reviewer_user_profile_url,
      reviewer_wallet_addr: item.reviewer_wallet_addr,
      rating: item.rating,
      summary: item.summary,
    };
  }
}
