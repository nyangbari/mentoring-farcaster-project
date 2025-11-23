import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { VaultModule } from '../vault/vault.module';
import { Review } from './review.entity';
import { ReviewRequest } from '../review-request/review-request.entity';
import { ReviewQueryController } from './review.query.controller';

@Module({
  imports: [BlockchainModule, VaultModule, TypeOrmModule.forFeature([Review, ReviewRequest])],
  controllers: [ReviewController, ReviewQueryController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}