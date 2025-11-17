import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll(): Promise<ReviewRequest[]> {
    return this.repo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findPaged(page = 1, take = 10) {
    const p = Math.max(1, Number(page) || 1);
    const t = Math.max(1, Number(take) || 10);
    const skip = (p - 1) * t;

    const [items, total] = await this.repo.findAndCount({
      skip,
      take: t,
      order: { createdAt: 'DESC' },
    });

    return {
      items,
      total,
      page: p,
      take: t,
      totalPages: Math.ceil(total / t) || 0,
    };
  }

  async findOne(id: number): Promise<ReviewRequest> {
    const item = await this.repo.findOneBy({ id });
    if (!item) throw new NotFoundException(`ReviewRequest with id ${id} not found`);
    return item;
  }
}
