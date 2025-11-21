import { Controller, Get } from '@nestjs/common';
import { TokenService } from './token.service';

@Controller('token')
export class TokenController {
  constructor(private readonly token: TokenService) {}

  @Get('test-send')
  async testSend() {
    const addr = "0x405ff2f6d7b9bc2ad28eee8edaca6ab045c63825";
    const receipt = await this.token.sendTokens(addr, 1);
    return { txHash: receipt.transactionHash };
  }
}
