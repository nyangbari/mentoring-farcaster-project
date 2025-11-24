import { IsString, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DepositDto {
  @ApiProperty({ example: '1366990', description: 'Farcaster FID' })
  @IsString()
  requesterFid: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsPositive()
  amount: number;
}