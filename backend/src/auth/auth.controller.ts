import { Controller, Post, Body } from '@nestjs/common';
import { IsString, MinLength } from 'class-validator';
import { AuthService } from './auth.service';
import { ApiProperty, ApiBody } from '@nestjs/swagger';

class AuthDto {
  @ApiProperty({ example: 'test1', description: 'username' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'password123', description: 'password (minimum 12 characters)', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: AuthDto })
  register(@Body() body: AuthDto) {
    const { username, password } = body;
    return this.authService.register(username, password);
  }

  @Post('login')
  @ApiBody({ type: AuthDto })
  login(@Body() body: AuthDto) {
    const { username, password } = body;
    return this.authService.login(username, password);
  }
}
