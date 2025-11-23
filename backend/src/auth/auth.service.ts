import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(username: string, password: string) {
    // 1. username 중복 체크
    const existing = await this.usersRepo.findOne({ where: { username } });
    if (existing) {
      throw new UnauthorizedException('Username already exists.');
    }

    // 2. 비밀번호 해시
    const hashed = await bcrypt.hash(password, 10);
    
    // 3. 임시 wallet_address 생성
    const tempWallet = `temp_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    // 4. 사용자 생성
    const user = this.usersRepo.create({ 
      username, 
      password: hashed,
      wallet_address: tempWallet
    });
    
    return this.usersRepo.save(user);
  }

  async login(username: string, password: string) {
    // 1. 사용자 찾기
    const user = await this.usersRepo.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    // 2. Web3 전용 계정 체크
    if (!user.password) {
      throw new UnauthorizedException(
        'This account uses Web3 wallet login. Please connect your wallet.'
      );
    }

    // 3. 비밀번호 검증
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid password.');
    }

    // 4. JWT 토큰 생성
    const payload = { username: user.username, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
