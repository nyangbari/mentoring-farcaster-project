import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  wallet_address: string;  // 지갑 주소 (고유값)

  @Column({ default: false })
  welcome_bonus_claimed: boolean;

  @Column({ nullable: true, unique: true })
  username: string;

  @Column({ nullable: true })  // nullable: true 추가
  password?: string;  // ? 추가

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
