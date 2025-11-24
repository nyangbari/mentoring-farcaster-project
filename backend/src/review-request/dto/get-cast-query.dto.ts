import { IsString, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetCastQueryDto {
  @ApiProperty({ description: 'Farcaster FID', example: '1366990' })
  @IsNumberString()
  fid: string;

  @ApiProperty({ description: 'Cast hash', example: '0x5a78a2d8f380d59906e7564ca170091d0d' })
  @IsString()
  hash: string;
}