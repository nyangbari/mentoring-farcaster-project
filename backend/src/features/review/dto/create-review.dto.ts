import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {

  @ApiProperty({ description: '리뷰 대상이 되는 리뷰 요청 ID', minimum: 1 })
  @IsInt()
  @Min(1)
  review_request_id: number;

  @ApiProperty({ description: '리뷰 내용을 식별할 해시 값' })
  @IsString()
  @IsNotEmpty()
  review_hash: string;

  @ApiProperty({ description: '리뷰어의 사용자 ID (user PK)', minimum: 1 })
  @IsInt()
  @Min(1)
  reviewer_user_id: number;

  @ApiProperty({ description: '리뷰어 이름', required: false })
  @IsOptional()
  @IsString()
  reviewer_user_name?: string;

  @ApiProperty({ description: '리뷰어 프로필 이미지 URL', required: false })
  @IsOptional()
  @IsString()
  reviewer_user_profile_url?: string;

  @ApiProperty({ description: '리뷰어 지갑 주소', required: false })
  @IsOptional()
  @IsString()
  reviewer_wallet_addr?: string;

  @ApiProperty({ description: '별점 (1~5)', minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: '리뷰 요약' })
  @IsString()
  @IsNotEmpty()
  summary: string;
}
