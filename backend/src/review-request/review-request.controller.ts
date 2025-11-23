import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  ParseIntPipe,
  Query,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody, ApiOkResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ReviewRequestService } from './review-request.service';
import { CreateReviewRequestDto } from './dto/create-review-request.dto';
import { TokenService } from '../blockchain/token.service';
import { VaultService } from '../vault/vault.service';
import { SearchReviewRequestQueryDto } from './dto/search-review-request-query.dto';
import { MyReviewRequestQueryDto } from './dto/my-review-request-query.dto';
import { ReviewRequest } from './review-request.entity';

@ApiTags('review-request')
@Controller('api')
export class ReviewRequestController {
  constructor(
    private readonly service: ReviewRequestService,
    private readonly tokenService: TokenService,
    private readonly vaultService: VaultService
  ) {}

  @Post('review-request')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateReviewRequestDto })
  @ApiResponse({ status: 201, description: 'Created' })
  async create(@Body() body: CreateReviewRequestDto) {
    // 추가: 토큰 예치 로직
    if (body.reward && body.reward > 0) {
      if (!body.wallet_address) {
        throw new BadRequestException('보상 지급을 위해 wallet_address가 필요합니다');
      }
      // Step 1: 온체인 토큰 잔액 확인
      const balance = await this.tokenService.getTokenBalance(body.wallet_address);
      
      // Step 2: 잔액 검증
      if (balance < body.reward) {
        throw new BadRequestException(
          `잔액 부족: 보유 ${balance} 토큰, 요청 ${body.reward} 토큰`
        );
      }

      // Step 3: 최소 금액 검증
      if (body.reward < 1) {
        throw new BadRequestException('최소 1 토큰 이상 예치해야 합니다');
      }

      // Step 4: Vault에 예치
      await this.vaultService.deposit(body.wallet_address, body.reward);
    }

    // 기존 로직: 리뷰 요청 생성
    const created = await this.service.create(body);
    return created;
  }

  @Get('review-request')
  @ApiOkResponse({ description: 'Paged list of review requests' })
  async findAll(@Query('page') page?: string) {
    const result = await this.service.findPaged(Number(page ?? '1'), 10);

    const mappedItems = result.items.map((it) => this.mapReviewRequest(it));

    return {
      items: mappedItems,
      total_items: result.total,
    };
  }

  @Get('review-request/:id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Single review request', type: CreateReviewRequestDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Get('review-request-by-category')
  async searchByCategory(@Query() query: SearchReviewRequestQueryDto) {
    const result = await this.service.searchByCategory(query.page, 10, query.category);
    return {
      items: result.items.map((it) => this.mapReviewRequest(it)),
      total_items: result.total,
    };
  }

  @Get('my-review-request')
  @ApiQuery({ name: 'user_id', required: true, type: String })
  async getMyReviewRequests(@Query() query: MyReviewRequestQueryDto) {
    const result = await this.service.findByUser(query.user_id, query.page, 10);
    return {
      items: result.items.map((it) => this.mapReviewRequest(it)),
      total_items: result.total,
    };
  }

  @Get('most-popular-review-request')
  async getMostPopular() {
    const popular = await this.service.findMostPopular();
    if (!popular) {
      throw new NotFoundException('등록된 리뷰 요청이 없습니다');
    }

    const mapped = this.mapReviewRequest(popular.entity);
    return {
      ...mapped,
      num_of_reviews: popular.numReviews,
    };
  }

  private mapReviewRequest(it: ReviewRequest) {
    return {
      id: it.id,
      user_id: it.user_id,
      user_name: it.user_name,
      user_profile_url: it.user_profile_url,
      title: it.title,
      category: it.category,
      description: it.description,
      reward: it.reward === null || it.reward === undefined ? null : Number(it.reward),
      deadline: it.deadline ? new Date(it.deadline).toISOString() : null,
    };
  }
}

//토근 예치하는 부분

