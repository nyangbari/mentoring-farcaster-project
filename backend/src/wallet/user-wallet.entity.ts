import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('user_wallet')
export class UserWallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50 })
  fid: string;

  @Column({ type: 'varchar', length: 42 })
  wallet_address: string;

  @Column({ type: 'text' })
  encrypted_private_key: string;

  @Column({ type: 'decimal', precision: 36, scale: 18, default: 0 })
  balance: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}