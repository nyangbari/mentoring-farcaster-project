import { IsString, IsArray, ValidateNested, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class Distribution {
  @ApiProperty({ example: '9999999', description: '리뷰어 FID' })
  @IsString()
  reviewerFid: string;

  @ApiProperty({ example: 5, description: '지급할 토큰 수량' })
  @IsNumber()
  @IsPositive()
  amount: number;
}

export class DistributeDto {
  @ApiProperty({ example: '1366990', description: '요청자 FID' })
  @IsString()
  requesterFid: string;

  @ApiProperty({
    type: [Distribution],
    description: '리뷰어별 토큰 분배 정보',
    example: [
      { reviewerFid: '9999999', amount: 3 },
      { reviewerFid: '8888888', amount: 2 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Distribution)
  distributions: Distribution[];
}