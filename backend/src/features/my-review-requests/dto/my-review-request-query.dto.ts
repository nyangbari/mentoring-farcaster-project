import { IsNotEmpty, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../shared/dto/pagination-query.dto';

export class MyReviewRequestQueryDto extends PaginationQueryDto {
  @IsString()
  @IsNotEmpty()
  f_id: string;
}
