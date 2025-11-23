import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { VaultModule } from '../vault/vault.module';

@Module({
  imports: [BlockchainModule, VaultModule],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}