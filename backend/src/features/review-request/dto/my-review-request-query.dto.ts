import { IsNotEmpty, IsString } from 'class-validator';
import { PaginationQueryDto } from './pagination-query.dto';

export class MyReviewRequestQueryDto extends PaginationQueryDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;
}
