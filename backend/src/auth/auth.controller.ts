import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

class AuthDto {
  username: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: AuthDto) {
    const { username, password } = body;
    return this.authService.register(username, password);
  }

  @Post('login')
  login(@Body() body: AuthDto) {
    const { username, password } = body;
    return this.authService.login(username, password);
  }
}
