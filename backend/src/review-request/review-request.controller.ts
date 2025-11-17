import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ReviewRequestService } from './review-request.service';
import { CreateReviewRequestDto } from './dto/create-review-request.dto';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('review-request')
@Controller('api/review-request')
export class ReviewRequestController {
  constructor(private readonly service: ReviewRequestService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateReviewRequestDto })
  @ApiResponse({ status: 201, description: 'Created' })
  async create(@Body() body: CreateReviewRequestDto) {
    const created = await this.service.create(body);
    return created;
  }
}
