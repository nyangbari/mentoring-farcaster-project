export async function fetchCastContent(fid: number, hash: string) {
  const res = await fetch(
    `https://hub-api.farcaster.xyz/v1/cast?fid=${fid}&hash=${hash}`
  )
  const json = await res.json()

  return {
    text: json.cast.text,
    embeds: json.cast.embeds,
    author: json.cast.author,
  }
}
