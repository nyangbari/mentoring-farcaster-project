import { IsNotEmpty, IsString } from 'class-validator';
import { PaginationQueryDto } from './pagination-query.dto';

export class SearchReviewRequestQueryDto extends PaginationQueryDto {
  @IsString()
  @IsNotEmpty()
  category: string;
}
