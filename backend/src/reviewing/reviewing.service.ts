import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reviewing } from './reviewing.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewRequestService } from '../review-request/review-request.service';

@Injectable()
export class ReviewingService {
  constructor(
    @InjectRepository(Reviewing)
    private repo: Repository<Reviewing>,
    private readonly reviewRequestService: ReviewRequestService,
  ) {}

  async create(dto: CreateReviewDto) {
    await this.reviewRequestService.findOne(Number(dto.review_request_id));
    const ent = new Reviewing();
    // id (`review_id`) is client-supplied in the spec but we use auto-generated PK.
    ent.review_request_id = Number(dto.review_request_id);
    ent.review_hash = dto.review_hash;
    ent.reviewer_user_id = dto.reviewer_user_id;
    // keep wallet addr null for now as requested
    ent.reviewer_wallet_addr = dto.reviewer_wallet_addr ?? null;
    ent.rating = Number(dto.rating);
    ent.summary = dto.summary;

    return this.repo.save(ent);
  }
}
