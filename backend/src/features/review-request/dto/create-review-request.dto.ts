import { IsString, IsOptional, IsNumber, IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewRequestDto {
  @ApiProperty({ example: '123', description: 'User id (string)' })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  // 추가: 지갑 주소
  @ApiProperty({ 
    example: '0x405ff2f6d7b9bc2ad28eee8edaca6ab045c63825', 
    description: 'Wallet address for token deposit',
    required: false,
  })
  @IsOptional()
  @IsString()
  wallet_address?: string;

  @ApiProperty({ example: 'Code Review for PR#42', description: 'Title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Jane Doe', description: 'User display name' })
  @IsString()
  @IsNotEmpty()
  user_name: string;

  @ApiProperty({ example: 'https://example.com/avatar.png', description: 'Profile image URL' })
  @IsString()
  @IsNotEmpty()
  user_profile_url: string;

  @ApiProperty({ example: 'backend', description: 'Category' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 'Please review performance and security.', description: 'Description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 10.5, description: 'Reward (float)' })
  @IsOptional()
  @IsNumber()
  reward?: number;

  @ApiProperty({ example: '2025-12-31', description: 'Deadline (ISO date string)' })
  @IsOptional()
  @IsDateString()
  deadline?: string;
}
