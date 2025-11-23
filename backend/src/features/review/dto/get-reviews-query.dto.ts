import { IsNotEmpty, IsString } from 'class-validator';

export class GetReviewsQueryDto {
  @IsString()
  @IsNotEmpty()
  review_hash: string;
}
