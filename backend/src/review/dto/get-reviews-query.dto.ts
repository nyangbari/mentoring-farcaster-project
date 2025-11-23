import { IsNotEmpty, IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetReviewsQueryDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;
}
