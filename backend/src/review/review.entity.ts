import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { ReviewRequest } from '../review-request/review-request.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  review_hash: string;

  @Column({ type: 'int' })
  reviewer_user_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reviewer_user_name: string | null;

  @Column({ type: 'varchar', length: 512, nullable: true })
  reviewer_user_profile_url: string | null;

  @Column({ type: 'varchar', length: 255 })
  reviewer_wallet_addr: string;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text' })
  summary: string;

  @Column()
  review_request_id: number;

  @ManyToOne(() => ReviewRequest, (request) => request.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'review_request_id' })
  review_request: ReviewRequest;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
