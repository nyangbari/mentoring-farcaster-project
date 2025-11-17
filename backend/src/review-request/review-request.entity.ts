import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class ReviewRequest {
  @PrimaryGeneratedColumn()
  id: number;

  // keep as string to accept various client id formats
  @Column()
  user_id: string;

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
}
