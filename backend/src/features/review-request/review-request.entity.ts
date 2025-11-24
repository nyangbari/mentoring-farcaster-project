  import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from 'typeorm';
  import { Review } from '../review/review.entity';

  @Entity()
  export class ReviewRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'f_id' })
    f_id: string;

    // 추가: 지갑 주소
    @Column({ type: 'varchar', length: 255, nullable: true })
    wallet_address: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    user_name: string | null;

    @Column({ type: 'varchar', length: 512, nullable: true })
    user_profile_url: string | null;

    @Column()
    title: string;

    @Column()
    category: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'double precision', nullable: true })
    reward: number | null;

    @Column({ type: 'timestamp without time zone', nullable: true })
    deadline: Date | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Review, (review) => review.review_request, { cascade: false })
    reviews: Review[];
  }
