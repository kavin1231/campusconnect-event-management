import { useMemo } from 'react'
import { ArrowUpDown, Tent } from 'lucide-react'
import stallData from '../../asset/json/stall.json'
import vendorData from '../../asset/json/vendor.json'
import { normalizeStalls } from '../utils/stallAdapters'
import Button from '../components/ui/Button'
import StallMap from '../components/stall/StallMap'
import ReservedStallList from '../components/stall/ReservedStallList'
import useSortedRecords from '../hooks/useSortedRecords'

export default function Stall() {
  const stalls = useMemo(() => normalizeStalls(stallData, vendorData), [])

  const availableCount = stalls.filter((s) => s.isAvailable).length
  const reservedCount  = stalls.filter((s) => !s.isAvailable).length
  const reservedStalls = stalls.filter((s) => !s.isAvailable)

  const {
    sortBy,
    sortDirection,
    setSortBy,
    toggleDirection,
    sortedRecords: sortedReservedStalls,
  } = useSortedRecords(reservedStalls, 'stallName', 'asc')

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100 dark:bg-secondary-900/20">
            <Tent size={22} className="text-secondary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Stall Allocation
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Visual overview of all {stalls.length} stalls and their reservation status.
            </p>
          </div>
        </div>

        {/* Legend chips */}
        <div className="flex flex-wrap items-center gap-3 self-start">
          <div className="flex items-center gap-2 rounded-lg border border-primary-200 bg-primary-50 px-3 py-1.5 dark:border-primary-700 dark:bg-primary-900/40">
            <span className="h-3 w-3 rounded-sm bg-primary-400 dark:bg-primary-500" />
            <span className="text-xs font-medium text-primary-800 dark:text-primary-200">
              Available ({availableCount})
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 dark:border-red-800 dark:bg-red-900/30">
            <span className="h-3 w-3 rounded-sm bg-red-400 dark:bg-red-500" />
            <span className="text-xs font-medium text-red-800 dark:text-red-300">
              Reserved ({reservedCount})
            </span>
          </div>

          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
            <span className="sr-only">Sort reserved stalls</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs dark:border-primary-700 dark:bg-primary-900 dark:text-white"
            >
              <option value="stallName">Stall</option>
              <option value="vendorName">Vendor</option>
            </select>
          </label>

          <Button variant="secondary" className="gap-2 px-3 py-1.5 text-xs" onClick={toggleDirection}>
            <ArrowUpDown size={13} />
            {sortDirection === 'desc' ? 'Descending' : 'Ascending'}
          </Button>
        </div>
      </div>

      {/* Main content: map + reserved list */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Stall map — takes remaining space */}
        <div className="flex-1">
          <StallMap stalls={stalls} />
        </div>

        {/* Reserved stalls sidebar */}
        <div className="w-full lg:w-72 lg:flex-shrink-0">
          <ReservedStallList stalls={sortedReservedStalls} />
        </div>
      </div>
    </div>
  )
}
