import { useMemo, useState } from 'react'
import { sortRecords } from '../utils/sorting'

export default function useSortedRecords(records, initialSortBy, initialDirection = 'desc') {
  const [sortBy, setSortBy] = useState(initialSortBy)
  const [sortDirection, setSortDirection] = useState(initialDirection)

  const sortedRecords = useMemo(
    () => sortRecords(records, sortBy, sortDirection),
    [records, sortBy, sortDirection]
  )

  function toggleDirection() {
    setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
  }

  return {
    sortBy,
    sortDirection,
    setSortBy,
    setSortDirection,
    toggleDirection,
    sortedRecords,
  }
}
