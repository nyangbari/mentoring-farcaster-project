import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reviewing } from './reviewing.entity';
import { ReviewingService } from './reviewing.service';
import { ReviewingController } from './reviewing.controller';
import { ReviewRequestModule } from '../review-request/review-request.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reviewing]), ReviewRequestModule],
  providers: [ReviewingService],
  controllers: [ReviewingController],
  exports: [ReviewingService],
})
export class ReviewingModule {}
