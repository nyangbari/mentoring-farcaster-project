import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewRequest } from './review-request.entity';
import { ReviewRequestService } from './review-request.service';
import { ReviewRequestController } from './review-request.controller';
import { TokenService } from '../blockchain/token.service';  // 추가
import { VaultService } from '../vault/vault.service';  // 추가

@Module({
  imports: [TypeOrmModule.forFeature([ReviewRequest])],
  providers: [
    ReviewRequestService,
    TokenService,    // 추가
    VaultService
  ],
  controllers: [ReviewRequestController],
  exports: [ReviewRequestService],
})
export class ReviewRequestModule {}
