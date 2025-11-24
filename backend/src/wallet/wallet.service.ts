import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ethers } from 'ethers';
import * as crypto from 'crypto';
import { User } from '../user/user.entity';

@Injectable()
export class WalletService {
  private readonly encryptionKey: Buffer;
  private readonly INITIAL_AIRDROP = 1000;

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {
    const keyHex = process.env.WALLET_ENCRYPTION_KEY;
    if (!keyHex || keyHex.length !== 64) {
      console.warn('⚠️ WALLET_ENCRYPTION_KEY not set, using default (개발용만!)');
      this.encryptionKey = Buffer.from('0'.repeat(64), 'hex');
    } else {
      this.encryptionKey = Buffer.from(keyHex, 'hex');
    }
  }

  async findByFid(fid: string): Promise<User | null> {
    return this.userRepo.findOneBy({ f_id: fid });
  }

  async verifyOrCreateWallet(
    fid: string,
    profile?: { username?: string; profileUrl?: string },
  ): Promise<{
    isNew: boolean;
    fid: string;
    walletAddress: string;
    balance: number;
  }> {
    let user = await this.findByFid(fid);

    if (user) {
      return {
        isNew: false,
        fid: user.f_id!,
        walletAddress: user.wallet_address!,
        balance: Number(user.balance),
      };
    }

    const wallet = ethers.Wallet.createRandom();
    const encryptedPrivateKey = this.encrypt(wallet.privateKey);

    user = new User();
    user.f_id = fid;
    user.wallet_address = wallet.address;
    user.encrypted_private_key = encryptedPrivateKey;
    user.balance = this.INITIAL_AIRDROP;
    user.welcome_bonus_claimed = true;
    user.user_name = profile?.username ?? null;
    user.user_profile_url = profile?.profileUrl ?? null;

    await this.userRepo.save(user);

    return {
      isNew: true,
      fid,
      walletAddress: wallet.address,
      balance: this.INITIAL_AIRDROP,
    };
  }

  async getBalance(fid: string): Promise<number> {
    const user = await this.findByFid(fid);
    if (!user) {
      throw new NotFoundException(`FID ${fid}에 해당하는 사용자가 없습니다`);
    }
    return Number(user.balance);
  }

  async transfer(fromFid: string, toFid: string, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException('전송 금액은 0보다 커야 합니다');
    }

    const fromUser = await this.findByFid(fromFid);
    if (!fromUser) {
      throw new NotFoundException(`송신자 FID ${fromFid}를 찾을 수 없습니다`);
    }

    if (Number(fromUser.balance) < amount) {
      throw new BadRequestException(
        `잔액 부족: 보유 ${fromUser.balance} MTR, 요청 ${amount} MTR`,
      );
    }

    const toUser = await this.findByFid(toFid);
    if (!toUser) {
      throw new NotFoundException(`수신자 FID ${toFid}를 찾을 수 없습니다`);
    }

    await this.userRepo.manager.transaction(async (manager) => {
      await manager.decrement(User, { f_id: fromFid }, 'balance', amount);
      await manager.increment(User, { f_id: toFid }, 'balance', amount);
    });

    const updatedFrom = await this.findByFid(fromFid);
    const updatedTo = await this.findByFid(toFid);

    return {
      fromFid,
      toFid,
      amount,
      fromBalance: Number(updatedFrom!.balance),
      toBalance: Number(updatedTo!.balance),
    };
  }

  async depositToVault(fid: string, amount: number): Promise<number> {
    const user = await this.findByFid(fid);
    if (!user) {
      throw new NotFoundException(`FID ${fid}를 찾을 수 없습니다`);
    }

    if (Number(user.balance) < amount) {
      throw new BadRequestException(
        `잔액 부족: 보유 ${user.balance} MTR, 요청 ${amount} MTR`,
      );
    }

    await this.userRepo.decrement({ f_id: fid }, 'balance', amount);
    const updated = await this.findByFid(fid);
    return Number(updated!.balance);
  }

  async receiveFromVault(fid: string, amount: number): Promise<number> {
    const user = await this.findByFid(fid);
    if (!user) {
      throw new NotFoundException(`FID ${fid}를 찾을 수 없습니다`);
    }

    await this.userRepo.increment({ f_id: fid }, 'balance', amount);
    const updated = await this.findByFid(fid);
    return Number(updated!.balance);
  }

  private encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.encryptionKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  private decrypt(encryptedData: string): string {
    const [ivHex, authTagHex, encrypted] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', this.encryptionKey, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}