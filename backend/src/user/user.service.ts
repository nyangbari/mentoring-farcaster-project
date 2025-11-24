import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { TokenService } from '../blockchain/token.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private tokenService: TokenService,
  ) {}

  /**
   * 지갑 주소로 사용자 찾기 또는 생성
   */
  async findOrCreateByWallet(wallet_address: string): Promise<User> {
    let user = await this.userRepository.findOne({ where: { wallet_address } });

    if (!user) {
      user = this.userRepository.create({ wallet_address });
      await this.userRepository.save(user);
      console.log(`✅ 신규 사용자 생성: ${wallet_address}`);
    }

    return user;
  }

  /**
   * 환영 보너스 지급 (1000 토큰)
   */
  async claimWelcomeBonus(wallet_address: string) {
    // Step 1: 사용자 찾기 또는 생성
    const user = await this.findOrCreateByWallet(wallet_address);

    // Step 2: 이미 받았는지 확인
    if (user.welcome_bonus_claimed) {
      throw new BadRequestException('이미 환영 보너스를 받으셨습니다.');
    }

    // Step 3: 1000 토큰 발행
    const WELCOME_BONUS = 1000;
    const receipt = await this.tokenService.sendTokens(wallet_address, WELCOME_BONUS);

    // Step 4: DB 업데이트
    user.welcome_bonus_claimed = true;
    await this.userRepository.save(user);

    console.log(`🎁 환영 보너스 지급: ${wallet_address} → ${WELCOME_BONUS} MTR`);

    return {
      wallet_address,
      bonus_amount: WELCOME_BONUS,
      txHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
      message: '환영합니다! 1000 MTR 토큰을 받으셨습니다.',
    };
  }

  /**
   * 환영 보너스 수령 가능 여부 확인
   */
  async checkWelcomeBonusEligibility(wallet_address: string) {
    const user = await this.userRepository.findOne({ where: { wallet_address } });

    if (!user) {
      return {
        wallet_address,
        eligible: true,
        is_new_user: true,
        bonus_amount: 1000,
      };
    }

    return {
      wallet_address,
      eligible: !user.welcome_bonus_claimed,
      is_new_user: false,
      already_claimed: user.welcome_bonus_claimed,
      bonus_amount: user.welcome_bonus_claimed ? 0 : 1000,
    };
  }

  /**
   * 사용자 정보 조회
   */
  async getUserInfo(wallet_address: string) {
    let user = await this.userRepository.findOne({ where: { wallet_address } });
    let createdGuest = false;

    if (!user) {
      const guestName = this.generateGuestUsername(wallet_address);
      user = this.userRepository.create({
        wallet_address,
        user_name: guestName,
        welcome_bonus_claimed: false,
        user_profile_url: null,
      });

      user = await this.userRepository.save(user);
      createdGuest = true;
    }

    const tokenBalance = await this.tokenService.getTokenBalance(wallet_address);

    return {
      exists: true,
      wallet_address: user.wallet_address,
      user_name: user.user_name,
      username: user.user_name,
      welcome_bonus_claimed: user.welcome_bonus_claimed,
      created_at: user.createdAt,
      token_balance: tokenBalance,
      is_guest: createdGuest,
    };
  }

  private generateGuestUsername(wallet_address: string) {
    const suffix = wallet_address?.slice(-6)?.toLowerCase() ?? 'guest';
    return `guest_${suffix}_${Date.now()}`;
  }
}