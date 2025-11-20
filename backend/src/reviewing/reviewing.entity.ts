import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Reviewing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  review_request_id: number;

  @Column()
  review_hash: string;

  @Column()
  reviewer_user_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reviewer_wallet_addr: string | null;

  @Column()
  rating: number;

  @Column({ type: 'text' })
  summary: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
