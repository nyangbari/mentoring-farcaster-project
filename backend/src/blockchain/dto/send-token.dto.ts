import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEthereumAddress, IsNumber, Min } from 'class-validator';

export class SendTokenDto {
  @ApiProperty({ example: '0x405ff2f6d7b9bc2ad28eee8edaca6ab045c63825' })
  @IsEthereumAddress()
  address: string;

  @ApiProperty({ example: 1, minimum: 0.000000000000000001 })
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0.000000000000000001)
  amount: number;
}
