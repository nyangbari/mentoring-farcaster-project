import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { VaultModule } from '../vault/vault.module';
import { WalletModule } from '../wallet/wallet.module';
import { Review } from './review.entity';
import { ReviewRequest } from '../review-request/review-request.entity';
import { ReviewQueryController } from './review.query.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, ReviewRequest]),
    VaultModule,
    WalletModule,  // ← 이거 추가!
  ],
  controllers: [ReviewController, ReviewQueryController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}