import { useMemo, useState } from 'react'
import { ArrowUpDown, CalendarDays } from 'lucide-react'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import useSortedRecords from '../hooks/useSortedRecords'

const eventRows = [
  { id: 1, name: 'Innovation Expo', category: 'Exhibition', date: '2026-04-12', status: 'Planning' },
  { id: 2, name: 'Debate League Finals', category: 'Competition', date: '2026-04-08', status: 'Ready' },
  { id: 3, name: 'Health Awareness Drive', category: 'Community', date: '2026-04-15', status: 'Approval Pending' },
  { id: 4, name: 'Robotics Bootcamp', category: 'Workshop', date: '2026-03-30', status: 'Staffing Needed' },
]

export default function MyEvents() {
  const [search, setSearch] = useState('')
  const filteredRows = useMemo(() => {
    const normalized = search.trim().toLowerCase()
    if (!normalized) {
      return eventRows
    }

    return eventRows.filter((row) => {
      return row.name.toLowerCase().includes(normalized) || row.category.toLowerCase().includes(normalized)
    })
  }, [search])

  const {
    sortBy,
    sortDirection,
    setSortBy,
    toggleDirection,
    sortedRecords,
  } = useSortedRecords(filteredRows, 'date', 'desc')

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100 dark:bg-secondary-900/20">
            <CalendarDays size={22} className="text-secondary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">My Events</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Track your event pipeline and operational status.</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-primary-700 dark:bg-primary-900/30">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            id="my-events-search"
            label="Search"
            placeholder="Search by event name or category"
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
                <option value="date">Date</option>
                <option value="name">Name</option>
                <option value="status">Status</option>
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
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Event Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Category</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-primary-800">
            {sortedRecords.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/90 dark:hover:bg-primary-800/40">
                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{row.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{row.category}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{row.date}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
