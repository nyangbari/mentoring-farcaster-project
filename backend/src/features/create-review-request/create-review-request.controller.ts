import { Controller, Post, Body, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateReviewRequestDto } from './dto/create-review-request.dto';
import { ReviewRequestService } from '../review-request/review-request.service';
import { TokenService } from '../../blockchain/token.service';
import { VaultService } from '../../vault/vault.service';

@ApiTags('review-request')
@Controller('api')
export class CreateReviewRequestController {
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
    if (body.reward && body.reward > 0) {
      if (!body.wallet_address) {
        throw new BadRequestException('보상 지급을 위해 wallet_address가 필요합니다');
      }

      const balance = await this.tokenService.getTokenBalance(body.wallet_address);

      if (balance < body.reward) {
        throw new BadRequestException(`잔액 부족: 보유 ${balance} 토큰, 요청 ${body.reward} 토큰`);
      }

      if (body.reward < 1) {
        throw new BadRequestException('최소 1 토큰 이상 예치해야 합니다');
      }

      await this.vaultService.deposit(body.wallet_address, body.reward);
    }

    return this.service.create(body);
  }
}
