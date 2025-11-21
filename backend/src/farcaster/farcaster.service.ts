import { Injectable } from '@nestjs/common'
import axios from 'axios'

@Injectable()
export class FarcasterService {
  async fetchCastContent(fid: number, hash: string) {
    const res = await axios.get(
      `https://hub-api.farcaster.xyz/v1/cast?fid=${fid}&hash=${hash}`
    )

    const cast = res.data.cast

    return {
      author: cast.author,
      text: cast.text,
      embeds: cast.embeds || [],
      timestamp: cast.timestamp,
    }
  }
}
