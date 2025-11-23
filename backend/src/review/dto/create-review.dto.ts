import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  review_id?: number;

  @IsInt()
  @Min(1)
  review_request_id: number;

  @IsString()
  @IsNotEmpty()
  review_hash: string;

  @IsString()
  @IsNotEmpty()
  reviewer_user_id: string;

  @IsString()
  @IsNotEmpty()
  reviewer_user_name: string;

  @IsString()
  @IsNotEmpty()
  reviewer_user_profile_url: string;

  @IsString()
  @IsNotEmpty()
  reviewer_wallet_addr: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  summary: string;
}
