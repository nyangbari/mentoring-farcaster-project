import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { MyReviewRequestQueryDto } from './dto/my-review-request-query.dto';
import { ReviewRequestService } from '../review-request/review-request.service';

@ApiTags('review-request')
@Controller('api')
export class MyReviewRequestsController {
  constructor(private readonly service: ReviewRequestService) {}

  @Get('my-review-request')
  @ApiQuery({ name: 'user_id', required: true, type: String, description: '작성자 ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: '페이지 번호 (기본 1)' })
  async findMine(@Query() query: MyReviewRequestQueryDto) {
    const result = await this.service.findByUser(query.user_id, query.page, 10);
    return {
      items: result.items.map((it) => this.service.toResponseDto(it)),
      total_items: result.total,
    };
  }
}
