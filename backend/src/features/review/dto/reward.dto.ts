import { IsString, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RewardDto {
  @ApiProperty({ example: '0x6b4f81F0391A2c977d78A3156390DA001D3baBa7' })
  @IsString()
  requesterAddress: string;

  @ApiProperty({ example: '0x405ff2f6d7b9bc2ad28eee8edaca6ab045c63825' })
  @IsString()
  reviewerAddress: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @IsPositive()
  amount: number;
}