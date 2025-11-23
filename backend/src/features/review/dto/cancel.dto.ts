import { IsString, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CancelDto {
  @ApiProperty({ example: '0x6b4f81F0391A2c977d78A3156390DA001D3baBa7' })
  @IsString()
  requesterAddress: string;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount?: number;
}