import { Controller, Post, Body, HttpCode, HttpStatus, Get, Param, ParseIntPipe, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody, ApiOkResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ReviewRequestService } from './review-request.service';
import { CreateReviewRequestDto } from './dto/create-review-request.dto';
import { TokenService } from '../blockchain/token.service'
import { VaultService } from '../vault/vault.service'

@ApiTags('review-request')
@Controller('api/review-request')
export class ReviewRequestController {
  constructor(
    private readonly service: ReviewRequestService,
    private readonly tokenService: TokenService,
    private readonly vaultService: VaultService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateReviewRequestDto })
  @ApiResponse({ status: 201, description: 'Created' })
  async create(@Body() body: CreateReviewRequestDto) {
    // 추가: 토큰 예치 로직
    if (body.reward && body.reward > 0) {
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

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiOkResponse({ description: 'Paged list of review requests' })
  async findAll(@Query('page') page?: string) {
    const result = await this.service.findPaged(Number(page ?? '1'), Number('10'));

    const mappedItems = result.items.map((it) => ({
      id: it.id,
      user_id: it.user_id,
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

//토근 예치하는 부분

