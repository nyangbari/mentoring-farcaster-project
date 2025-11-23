import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class GetCastQueryDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  fid: number;

  @ApiProperty({ example: '0x1234abcd', description: 'Farcaster cast hash' })
  @IsString()
  @IsNotEmpty()
  hash: string;
}
