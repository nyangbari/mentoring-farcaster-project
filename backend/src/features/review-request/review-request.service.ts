import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewRequest } from './review-request.entity';
import { CreateReviewRequestDto } from '../create-review-request/dto/create-review-request.dto';

export interface ReviewRequestResponseDto {
  id: number;
  user_id: string;
  user_name: string | null;
  user_profile_url: string | null;
  title: string;
  category: string;
  description: string;
  reward: number | null;
  deadline: string | null;
}

@Injectable()
export class ReviewRequestService {
  constructor(
    @InjectRepository(ReviewRequest)
    private repo: Repository<ReviewRequest>,
  ) {}

  private normalizePagination(page?: number, take = 10) {
    const p = Math.max(1, Number(page) || 1);
    const t = Math.max(1, Number(take) || 10);
    const skip = (p - 1) * t;

    return { page: p, take: t, skip };
  }

  async create(dto: CreateReviewRequestDto) {
    const ent = new ReviewRequest();
    ent.user_id = dto.user_id;
    ent.wallet_address = dto.wallet_address ?? null;  // 추가
    ent.user_name = dto.user_name ?? null;
    ent.user_profile_url = dto.user_profile_url ?? null;
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
    const { page: p, take: t, skip } = this.normalizePagination(page, take);

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

  async searchByCategory(page = 1, take = 10, category: string) {
    const { page: p, take: t, skip } = this.normalizePagination(page, take);
    const qb = this.repo
      .createQueryBuilder('request')
      .orderBy('request.createdAt', 'DESC');

    const normalizedCategory = category.trim().toLowerCase();
    qb.where('LOWER(request.category) = :category', { category: normalizedCategory });

    qb.skip(skip).take(t);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page: p,
      take: t,
      totalPages: Math.ceil(total / t) || 0,
    };
  }

  async findByUser(userId: string, page = 1, take = 10) {
    const { page: p, take: t, skip } = this.normalizePagination(page, take);

    const [items, total] = await this.repo.findAndCount({
      where: { user_id: userId },
      order: { createdAt: 'DESC' },
      skip,
      take: t,
    });

    return {
      items,
      total,
      page: p,
      take: t,
      totalPages: Math.ceil(total / t) || 0,
    };
  }

  async findMostPopular() {
    const qb = this.repo
      .createQueryBuilder('request')
      .leftJoin('request.reviews', 'review')
      .addSelect('COUNT(review.id)', 'numReviews')
      .groupBy('request.id')
      .orderBy('numReviews', 'DESC')
      .addOrderBy('request.createdAt', 'DESC')
      .limit(1);

    const { entities, raw } = await qb.getRawAndEntities();
    const entity = entities[0];
    const numReviewsRaw = raw?.[0]?.numReviews;

    if (!entity) {
      return null;
    }

    return {
      entity,
      numReviews: Number(numReviewsRaw ?? 0),
    };
  }

  toResponseDto(it: ReviewRequest): ReviewRequestResponseDto {
    return {
      id: it.id,
      user_id: it.user_id,
      user_name: it.user_name,
      user_profile_url: it.user_profile_url,
      title: it.title,
      category: it.category,
      description: it.description,
      reward: it.reward === null || it.reward === undefined ? null : Number(it.reward),
      deadline: it.deadline ? new Date(it.deadline).toISOString() : null,
    };
  }
}
