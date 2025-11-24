import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransferDto {
  @ApiProperty({ example: '1366990', description: '송신자 FID' })
  @IsString()
  @IsNotEmpty()
  fromFid: string;

  @ApiProperty({ example: '1234567', description: '수신자 FID' })
  @IsString()
  @IsNotEmpty()
  toFid: string;

  @ApiProperty({ example: 10, description: '전송할 토큰 수량' })
  @IsNumber()
  @IsPositive()
  amount: number;
}