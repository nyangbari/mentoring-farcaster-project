export async function sendRewardToReviewer(addr: string, amount: number) {
  const res = await fetch('/api/review/reward', {
    method: 'POST',
    body: JSON.stringify({ reviewerAddress: addr, amount }),
  })
  return res.json()
}
