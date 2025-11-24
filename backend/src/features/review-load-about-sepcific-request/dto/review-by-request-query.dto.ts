import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class ReviewByRequestQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  review_request_id: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit = 10;
}