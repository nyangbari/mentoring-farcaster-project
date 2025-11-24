import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FarcasterLoginDto {
  @ApiProperty({ example: '1366990', description: 'Farcaster FID' })
  @IsString()
  @IsNotEmpty()
  fid: string;

  @ApiPropertyOptional({ example: 'cvlab' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ example: 'CVLab' })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional({ example: 'https://example.com/pfp.jpg' })
  @IsOptional()
  @IsString()
  pfpUrl?: string;
}