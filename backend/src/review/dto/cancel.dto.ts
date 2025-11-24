import { IsString, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CancelDto {
  @ApiProperty({ example: '1366990', description: 'Farcaster FID' })
  @IsString()
  requesterFid: string;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount?: number;
}