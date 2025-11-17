import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewRequest } from './review-request.entity';
import { ReviewRequestService } from './review-request.service';
import { ReviewRequestController } from './review-request.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewRequest])],
  providers: [ReviewRequestService],
  controllers: [ReviewRequestController],
  exports: [ReviewRequestService],
})
export class ReviewRequestModule {}
