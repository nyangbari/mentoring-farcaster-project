import { IsString, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RewardDto {
  @ApiProperty({ example: '1366990', description: '요청자 FID' })
  @IsString()
  requesterFid: string;

  @ApiProperty({ example: '9999999', description: '리뷰어 FID' })
  @IsString()
  reviewerFid: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @IsPositive()
  amount: number;
}