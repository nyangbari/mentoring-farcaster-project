export async function depositTokens(amount: number) {
  const res = await fetch('/api/review/deposit', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  })
  return res.json()
}
