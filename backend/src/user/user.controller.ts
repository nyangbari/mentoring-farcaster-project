import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { ClaimWelcomeDto } from './dto/claim-welcome.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('claim-welcome')
  @ApiOperation({ summary: '환영 보너스 받기 (신규 사용자 1000 토큰)' })
  @ApiResponse({ status: 200, description: '보너스 지급 성공' })
  @ApiResponse({ status: 400, description: '이미 받음' })
  async claimWelcome(@Body() dto: ClaimWelcomeDto) {
    return await this.userService.claimWelcomeBonus(dto.wallet_address);
  }

  @Get('check-welcome')
  @ApiOperation({ summary: '환영 보너스 수령 가능 여부 확인' })
  @ApiQuery({ 
    name: 'wallet_address', 
    required: true, 
    example: '0x6b4f81F0391A2c977d78A3156390DA001D3baBa7' 
  })
  async checkWelcome(@Query('wallet_address') wallet_address: string) {
    return await this.userService.checkWelcomeBonusEligibility(wallet_address);
  }

  @Get('info')
  @ApiOperation({ summary: '사용자 정보 조회' })
  @ApiQuery({ 
    name: 'wallet_address', 
    required: true, 
    example: '0x6b4f81F0391A2c977d78A3156390DA001D3baBa7' 
  })
  async getUserInfo(@Query('wallet_address') wallet_address: string) {
    return await this.userService.getUserInfo(wallet_address);
  }
}