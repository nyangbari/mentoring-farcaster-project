import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwtService: JwtService,
    private walletService: WalletService,
  ) {}

  async loginWithFarcaster(
    fid: string,
    profile?: { username?: string; displayName?: string; pfpUrl?: string },
  ) {
    // 1. 지갑 생성/조회 (신규 시 1000 MTR 지급)
    const walletResult = await this.walletService.verifyOrCreateWallet(fid, {
      username: profile?.username,
      profileUrl: profile?.pfpUrl,
    });

    // 2. User 조회
    const user = await this.usersRepo.findOne({ where: { f_id: fid } });

    // 3. JWT 생성
    const payload = {
      sub: user!.id,
      fid: user!.f_id,
      username: user!.user_name,
      walletAddress: walletResult.walletAddress,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user!.id,
        fid: user!.f_id,
        username: user!.user_name,
        profileUrl: user!.user_profile_url,
        walletAddress: walletResult.walletAddress,
        balance: walletResult.balance,
        isNew: walletResult.isNew,
      },
    };
  }
}