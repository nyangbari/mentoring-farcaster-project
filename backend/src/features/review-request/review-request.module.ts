import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewRequest } from './review-request.entity';
import { ReviewRequestService } from './review-request.service';
import { CreateReviewRequestController } from '../create-review-request/create-review-request.controller';
import { ListReviewRequestsController } from '../list-review-requests/list-review-requests.controller';
import { GetReviewRequestController } from '../get-review-request/get-review-request.controller';
import { SearchReviewRequestByCategoryController } from '../search-review-request-by-category/search-review-request-by-category.controller';
import { MyReviewRequestsController } from '../my-review-requests/my-review-requests.controller';
import { MostPopularReviewRequestController } from '../most-popular-review-request/most-popular-review-request.controller';
import { TokenService } from '../../blockchain/token.service';  // 추가
import { VaultService } from '../../vault/vault.service';  // 추가

@Module({
  imports: [TypeOrmModule.forFeature([ReviewRequest])],
  providers: [
    ReviewRequestService,
    TokenService,    // 추가
    VaultService
  ],
  controllers: [
    CreateReviewRequestController,
    ListReviewRequestsController,
    GetReviewRequestController,
    SearchReviewRequestByCategoryController,
    MyReviewRequestsController,
    MostPopularReviewRequestController,
  ],
  exports: [ReviewRequestService],
})
export class ReviewRequestModule {}
