import { IsString, IsNotEmpty } from 'class-validator';

export class CastQueryDto {
  @IsString()
  @IsNotEmpty()
  fid: String;

  @IsString()
  @IsNotEmpty()
  hash: string;
}
