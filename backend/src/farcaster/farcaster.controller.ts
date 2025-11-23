import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FarcasterService } from './farcaster.service';
import { GetCastQueryDto } from './dto/get-cast-query.dto';

@ApiTags('farcaster')
@Controller('farcaster')
export class FarcasterController {
  constructor(private readonly farcaster: FarcasterService) {}

  @Get('cast')
  async getCast(@Query() query: GetCastQueryDto) {
    return this.farcaster.fetchCastContent(query.fid, query.hash);
  }
}
