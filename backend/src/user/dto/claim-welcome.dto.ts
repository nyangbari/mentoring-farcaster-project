import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ClaimWelcomeDto {
  @ApiProperty({ example: '0x6b4f81F0391A2c977d78A3156390DA001D3baBa7' })
  @IsString()
  wallet_address: string;
}