import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { ReviewRequestService } from '../review-request/review-request.service';

@ApiTags('review-request')
@Controller('api')
export class GetReviewRequestController {
  constructor(private readonly service: ReviewRequestService) {}

  @Get('review-request/:id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Single review request' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
}
