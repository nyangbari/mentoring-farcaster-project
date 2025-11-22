import { IsString, IsArray, ValidateNested, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class Distribution {
  @ApiProperty({ 
    example: '0x405ff2f6d7b9bc2ad28eee8edaca6ab045c63825',
    description: '리뷰어 지갑 주소'
  })
  @IsString()
  reviewerAddress: string;

  @ApiProperty({ 
    example: 5,
    description: '지급할 토큰 수량'
  })
  @IsNumber()
  @IsPositive()
  amount: number;
}

export class DistributeDto {
  @ApiProperty({ 
    example: '0x6b4f81F0391A2c977d78A3156390DA001D3baBa7',
    description: '요청자(예치자) 지갑 주소'
  })
  @IsString()
  requesterAddress: string;

  @ApiProperty({
    type: [Distribution],
    description: '리뷰어별 토큰 분배 정보',
    example: [
      { 
        reviewerAddress: '0x405ff2f6d7b9bc2ad28eee8edaca6ab045c63825', 
        amount: 3 
      },
      { 
        reviewerAddress: '0x1234567890123456789012345678901234567890', 
        amount: 2 
      }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Distribution)
  distributions: Distribution[];
}