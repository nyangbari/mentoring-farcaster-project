import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ReviewingService } from './reviewing.service';
import { CreateReviewDto } from './dto/create-review.dto';

@ApiTags('review')
@Controller('api/review')
export class ReviewingController {
  constructor(private readonly service: ReviewingService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateReviewDto })
  @ApiResponse({ status: 201, description: 'Created' })
  async create(@Body() body: CreateReviewDto) {
    const created = await this.service.create(body);
    return created;
  }
}
