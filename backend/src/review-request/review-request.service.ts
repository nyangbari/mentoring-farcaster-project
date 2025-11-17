import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewRequest } from './review-request.entity';
import { CreateReviewRequestDto } from './dto/create-review-request.dto';

@Injectable()
export class ReviewRequestService {
  constructor(
    @InjectRepository(ReviewRequest)
    private repo: Repository<ReviewRequest>,
  ) {}

  async create(dto: CreateReviewRequestDto) {
    const ent = new ReviewRequest();
    ent.user_id = dto.user_id;
    ent.title = dto.title;
    ent.category = dto.category;
    ent.description = dto.description;
    ent.reward = dto.reward ?? null;
    ent.deadline = dto.deadline ? new Date(dto.deadline) : null;

    return this.repo.save(ent);
  }
}
