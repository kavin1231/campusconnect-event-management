function normalizeForCompare(value) {
  if (typeof value === 'number') {
    return value
  }

  if (value instanceof Date) {
    return value.getTime()
  }

  if (typeof value === 'string') {
    const asDate = Date.parse(value)
    if (!Number.isNaN(asDate) && /\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}|\d{1,2}\s+\w+\s+\d{4}/.test(value)) {
      return asDate
    }

    return value.toLowerCase()
  }

  if (typeof value === 'boolean') {
    return value ? 1 : 0
  }

  return String(value ?? '').toLowerCase()
}

export function sortRecords(records, sortBy, direction = 'asc') {
  const modifier = direction === 'desc' ? -1 : 1

  return [...records].sort((a, b) => {
    const left = normalizeForCompare(a?.[sortBy])
    const right = normalizeForCompare(b?.[sortBy])

    if (left < right) {
      return -1 * modifier
    }

    if (left > right) {
      return 1 * modifier
    }

    return 0
  })
}
