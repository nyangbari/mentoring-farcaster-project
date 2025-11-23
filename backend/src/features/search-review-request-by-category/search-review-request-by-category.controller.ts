import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { SearchReviewRequestQueryDto } from './dto/search-review-request-query.dto';
import { ReviewRequestService } from '../review-request/review-request.service';

@ApiTags('review-request')
@Controller('api')
export class SearchReviewRequestByCategoryController {
  constructor(private readonly service: ReviewRequestService) {}

  @Get('review-request-by-category')
  @ApiQuery({ name: 'category', required: true, type: String, description: '카테고리명' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: '페이지 번호 (기본 1)' })
  async search(@Query() query: SearchReviewRequestQueryDto) {
    const result = await this.service.searchByCategory(query.page, 10, query.category);
    return {
      items: result.items.map((it) => this.service.toResponseDto(it)),
      total_items: result.total,
    };
  }
}
