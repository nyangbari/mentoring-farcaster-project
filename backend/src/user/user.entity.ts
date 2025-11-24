import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  f_id: string | null;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  wallet_address: string | null;

  //추가
  @Column({ type: 'text', nullable: true })
  encrypted_private_key: string | null;

  //추가
  @Column({ type: 'decimal', precision: 36, scale: 18, default: 0 })
  balance: number;

  @Column({ default: false })
  welcome_bonus_claimed: boolean;

  // type 변경
  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  user_name: string | null;

  @Column({ type: 'varchar', length: 512, nullable: true })
  user_profile_url: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}