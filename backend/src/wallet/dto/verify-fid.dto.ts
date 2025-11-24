import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyFidDto {
  @ApiProperty({ example: '1366990', description: 'Farcaster FID' })
  @IsString()
  @IsNotEmpty()
  fid: string;
}