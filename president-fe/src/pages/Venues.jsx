import { useMemo, useState } from 'react'
import { ArrowUpDown, Building2 } from 'lucide-react'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import useSortedRecords from '../hooks/useSortedRecords'

const venueRows = [
  { id: 1, name: 'Main Auditorium', capacity: 600, availability: 'Booked', nextDate: '2026-04-12' },
  { id: 2, name: 'Innovation Lab', capacity: 120, availability: 'Available', nextDate: '2026-03-29' },
  { id: 3, name: 'Outdoor Arena', capacity: 900, availability: 'Maintenance', nextDate: '2026-04-18' },
  { id: 4, name: 'Seminar Hall A', capacity: 200, availability: 'Booked', nextDate: '2026-04-07' },
]

export default function Venues() {
  const [search, setSearch] = useState('')

  const filteredRows = useMemo(() => {
    const normalized = search.trim().toLowerCase()
    if (!normalized) {
      return venueRows
    }

    return venueRows.filter((row) => row.name.toLowerCase().includes(normalized))
  }, [search])

  const {
    sortBy,
    sortDirection,
    setSortBy,
    toggleDirection,
    sortedRecords,
  } = useSortedRecords(filteredRows, 'nextDate', 'desc')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100 dark:bg-secondary-900/20">
          <Building2 size={22} className="text-secondary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Venues</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Monitor venue utilization and availability windows.</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-primary-700 dark:bg-primary-900/30">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            id="venue-search"
            label="Search Venues"
            placeholder="Search by venue name"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <div className="grid gap-2 sm:grid-cols-2 sm:items-end">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Sort By
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-primary-700 dark:bg-primary-900 dark:text-white"
              >
                <option value="nextDate">Next Date</option>
                <option value="name">Name</option>
                <option value="capacity">Capacity</option>
              </select>
            </label>
            <Button variant="secondary" className="gap-2" onClick={toggleDirection}>
              <ArrowUpDown size={15} />
              {sortDirection === 'desc' ? 'Descending' : 'Ascending'}
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:border-primary-700 dark:bg-primary-900/30">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-primary-700">
          <thead className="bg-gray-50 dark:bg-primary-800/60">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Venue</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Capacity</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Availability</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Next Slot</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-primary-800">
            {sortedRecords.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/90 dark:hover:bg-primary-800/40">
                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{row.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{row.capacity}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{row.availability}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{row.nextDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
