import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { FarcasterLoginDto } from './dto/farcaster-login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('farcaster')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Farcaster 로그인 (신규 시 1000 MTR 지급)' })
  @ApiBody({ type: FarcasterLoginDto })
  loginWithFarcaster(@Body() dto: FarcasterLoginDto) {
    return this.authService.loginWithFarcaster(dto.fid, {
      username: dto.username,
      displayName: dto.displayName,
      pfpUrl: dto.pfpUrl,
    });
  }
}