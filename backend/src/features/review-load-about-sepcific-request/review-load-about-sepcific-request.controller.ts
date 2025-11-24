import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ReviewService } from '../review/review.service';
import { ReviewByRequestQueryDto } from './dto/review-by-request-query.dto';

@ApiTags('review')
@Controller('api')
export class ReviewLoadAboutSepcificRequestController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('review_load_about_sepcific_request')
  @ApiQuery({ name: 'review_request_id', type: Number, required: true, description: '리뷰 요청 ID' })
  @ApiQuery({ name: 'page', type: Number, required: false, description: '조회 페이지 (조회 개수는 기본 10)' })
  @ApiOkResponse({ description: '5. 특정 리뷰 요청에 작성된 리뷰 목록' })
  async getReviews(@Query() query: ReviewByRequestQueryDto) {
    const result = await this.reviewService.getReviewsByRequestId(
      query.review_request_id,
      query.page,
    );

    return {
      items: result.items.map((item) => ({
        review_id: item.id,
        review_request_id: item.review_request_id,
        review_hash: item.review_hash,
        reviewer_f_id: item.reviewer_f_id,
        reviewer_user_name: item.reviewer_user_name,
        reviewer_user_profile_url: item.reviewer_user_profile_url,
        reviewer_wallet_addr: item.reviewer_wallet_addr,
        rating: item.rating,
        summary: item.summary,
      })),
      total_items: result.total,
    };
  }
}