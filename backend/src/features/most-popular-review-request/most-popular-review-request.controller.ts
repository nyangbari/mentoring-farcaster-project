import { Controller, Get, NotFoundException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReviewRequestService } from '../review-request/review-request.service';

@ApiTags('review-request')
@Controller('api')
export class MostPopularReviewRequestController {
  constructor(private readonly service: ReviewRequestService) {}

  @Get('most-popular-review-request')
  async getMostPopular() {
    const popular = await this.service.findMostPopular();
    if (!popular) {
      throw new NotFoundException('등록된 리뷰 요청이 없습니다');
    }

    return {
      ...this.service.toResponseDto(popular.entity),
      num_of_reviews: popular.numReviews,
    };
  }
}
