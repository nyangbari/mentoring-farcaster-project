import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { TokenService } from './token.service';
import { ApiTags, ApiOperation, ApiQuery, ApiBody } from '@nestjs/swagger';

@ApiTags('Token')
@Controller('token')
export class TokenController {
  constructor(private readonly token: TokenService) {}

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

  @Get('allowance')
  @ApiOperation({ summary: 'approve 상태 확인' })
  @ApiQuery({ name: 'address', required: true, description: '사용자 지갑 주소' })
  async getAllowance(@Query('address') address: string) {
    const allowance = await this.token.getAllowance(address);
    return {
      ownerAddress: address,
      allowance,
      approved: allowance > 0
    };
  }

  @Post('test-mint')
  @ApiOperation({ summary: '테스트용 토큰 발행 (관리자 전용)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        address: { type: 'string', example: '0x405ff2f6d7b9bc2ad28eee8edaca6ab045c63825' },
        amount: { type: 'number', example: 10 }
      }
    }
  })
  async testMint(@Body() body: { address: string; amount: number }) {
    const receipt = await this.token.sendTokens(body.address, body.amount);
    return { 
      txHash: receipt.transactionHash,
      to: body.address,
      amount: body.amount
    };
  }

  @Post('test-transfer')
  @ApiOperation({ summary: '테스트용 서버 토큰 전송' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        address: { type: 'string', example: '0x405ff2f6d7b9bc2ad28eee8edaca6ab045c63825' },
        amount: { type: 'number', example: 5 }
      }
    }
  })
  async testTransfer(@Body() body: { address: string; amount: number }) {
    const receipt = await this.token.transferFromServer(body.address, body.amount);
    return { 
      txHash: receipt.transactionHash,
      to: body.address,
      amount: body.amount
    };
  }
}