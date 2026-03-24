export function normalizeSponsorshipSeed(seedRows) {
  return seedRows.map((row, index) => ({
    id: index + 1,
    name: String(row.name ?? '').trim(),
    amount: Number(row.amount) || 0,
    eventName: String(row.event_name ?? '').trim(),
    contact: String(row.contact ?? '').trim(),
    date: String(row.date ?? '').trim(),
    remark: String(row.remark ?? '').trim(),
  }))
}

export const lkrAmountFormatter = new Intl.NumberFormat('en-LK', {
  style: 'currency',
  currency: 'LKR',
  maximumFractionDigits: 0,
})
