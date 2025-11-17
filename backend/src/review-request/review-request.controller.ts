import { Controller, Post, Body, HttpCode, HttpStatus, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody, ApiOkResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ReviewRequestService } from './review-request.service';
import { CreateReviewRequestDto } from './dto/create-review-request.dto';

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

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiOkResponse({ description: 'Paged list of review requests' })
  async findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    const result = await this.service.findPaged(Number(page ?? '1'), Number(limit ?? '10'));

    const mappedItems = result.items.map((it) => ({
      id: it.id,
      title: it.title,
      category: it.category,
      description: it.description,
      reward: it.reward === null || it.reward === undefined ? null : Number(it.reward),
      deadline: it.deadline ? new Date(it.deadline).toISOString() : null,
    }));

    return {
      items: mappedItems,
      total_items: result.total,
    };
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Single review request', type: CreateReviewRequestDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
}
