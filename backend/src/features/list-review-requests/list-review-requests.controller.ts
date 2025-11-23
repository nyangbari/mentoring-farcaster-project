import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ReviewRequestService } from '../review-request/review-request.service';

@ApiTags('review-request')
@Controller('api')
export class ListReviewRequestsController {
  constructor(private readonly service: ReviewRequestService) {}

  @Get('review-request')
  @ApiOkResponse({ description: 'Paged list of review requests' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: '페이지 번호 (기본 1)' })
  async findAll(@Query('page') page?: string) {
    const result = await this.service.findPaged(Number(page ?? '1'), 10);

    return {
      items: result.items.map((it) => this.service.toResponseDto(it)),
      total_items: result.total,
    };
  }
}
