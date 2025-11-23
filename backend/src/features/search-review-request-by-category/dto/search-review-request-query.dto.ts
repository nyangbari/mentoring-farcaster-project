import { IsNotEmpty, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../shared/dto/pagination-query.dto';

export class SearchReviewRequestQueryDto extends PaginationQueryDto {
  @IsString()
  @IsNotEmpty()
  category: string;
}
