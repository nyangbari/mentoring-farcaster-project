import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewService } from './review.service';
import { ReviewController, ReviewQueryController } from './review.controller';
import { ReviewLoadAboutSepcificRequestController } from '../review-load-about-sepcific-request/review-load-about-sepcific-request.controller';
import { BlockchainModule } from '../../blockchain/blockchain.module';
import { VaultModule } from '../../vault/vault.module';
import { Review } from './review.entity';
import { ReviewRequest } from '../review-request/review-request.entity';
import { User } from '../../user/user.entity';

@Module({
  imports: [BlockchainModule, VaultModule, TypeOrmModule.forFeature([Review, ReviewRequest, User])],
  controllers: [ReviewController, ReviewQueryController, ReviewLoadAboutSepcificRequestController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}