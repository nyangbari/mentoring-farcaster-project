import { Controller, Get, Query } from '@nestjs/common';
import { TokenService } from './token.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Token')
@Controller('token')
export class TokenController {
  constructor(private readonly token: TokenService) {}

  @Get('test-send')
  @ApiOperation({ summary: '테스트 토큰 전송' })
  async testSend() {
    const addr = "0x405ff2f6d7b9bc2ad28eee8edaca6ab045c63825";
    const receipt = await this.token.sendTokens(addr, 1);
    return { txHash: receipt.transactionHash };
  }

  @Get('info')
  @ApiOperation({ summary: '토큰 정보 조회' })
  async getInfo() {
    return await this.token.getTokenInfo();
  }

  @Get('balance')
  @ApiOperation({ summary: '토큰 잔액 조회' })
  @ApiQuery({ name: 'address', required: true, description: '지갑 주소' })
  async getBalance(@Query('address') address: string) {
    const balance = await this.token.getTokenBalance(address);
    const hasBalance = await this.token.checkTokenBalance(address);
    return {
      address,
      balance,
      hasBalance
    };
  }
}