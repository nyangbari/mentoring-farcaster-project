import { IsString, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DepositDto {
  @ApiProperty({ example: '0x6b4f81F0391A2c977d78A3156390DA001D3baBa7' })
  @IsString()
  requesterAddress: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsPositive()
  amount: number;
}