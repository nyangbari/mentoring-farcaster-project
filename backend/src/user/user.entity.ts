import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  f_id: string | null;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  wallet_address: string | null;  // 지갑 주소 (고유값)

  @Column({ default: false })
  welcome_bonus_claimed: boolean;

  @Column({ nullable: true, unique: true })
  user_name: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  user_profile_url: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
