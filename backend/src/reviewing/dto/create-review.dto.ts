import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 1, description: 'Review id (client supplied, optional)' })
  @IsOptional()
  @IsNumber()
  review_id?: number;

  @ApiProperty({ example: 42, description: 'Target review request id' })
  @IsNumber()
  review_request_id: number;

  @ApiProperty({ example: 'QmHash...', description: 'Review hash provided by user' })
  @IsString()
  @IsNotEmpty()
  review_hash: string;

  @ApiProperty({ example: 'user_123', description: 'Reviewer user id' })
  @IsString()
  @IsNotEmpty()
  reviewer_user_id: string;

  @ApiProperty({ example: null, description: 'Reviewer wallet address (left null for now)' })
  @IsOptional()
  @IsString()
  reviewer_wallet_addr?: string | null;

  @ApiProperty({ example: 5, description: 'Rating given by reviewer' })
  @IsNumber()
  rating: number;

  @ApiProperty({ example: 'Looks good overall.', description: 'Short summary' })
  @IsString()
  @IsNotEmpty()
  summary: string;
}
