import { Controller, Post, Get, Body, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBody } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { VerifyFidDto } from './dto/verify-fid.dto';
import { TransferDto } from './dto/transfer.dto';

@ApiTags('Wallet')
@Controller('api/wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('verify')
  @ApiOperation({ summary: 'FID 검증 및 지갑 생성 (신규 시 1000 MTR 지급)' })
  @ApiBody({ type: VerifyFidDto })
  async verifyFid(@Body() dto: VerifyFidDto) {
    return this.walletService.verifyOrCreateWallet(dto.fid);
  }

  @Get('balance')
  @ApiOperation({ summary: 'FID로 잔액 조회' })
  @ApiQuery({ name: 'fid', required: true, type: String })
  async getBalance(@Query('fid') fid: string) {
    if (!fid) {
      throw new BadRequestException('fid is required');
    }
    const balance = await this.walletService.getBalance(fid);
    return { fid, balance };
  }

  @Post('transfer')
  @ApiOperation({ summary: 'FID 간 토큰 전송 (approve 불필요)' })
  @ApiBody({ type: TransferDto })
  async transfer(@Body() dto: TransferDto) {
    return this.walletService.transfer(dto.fromFid, dto.toFid, dto.amount);
  }

  @Get('info')
  @ApiOperation({ summary: 'FID로 지갑 정보 조회' })
  @ApiQuery({ name: 'fid', required: true, type: String })
  async getWalletInfo(@Query('fid') fid: string) {
    if (!fid) {
      throw new BadRequestException('fid is required');
    }
    const wallet = await this.walletService.findByFid(fid);
    if (!wallet) {
      return { exists: false, fid };
    }
    return {
      exists: true,
      fid: wallet.f_id,
      walletAddress: wallet.wallet_address,
      balance: Number(wallet.balance),
      createdAt: wallet.createdAt,
    };
  }
}