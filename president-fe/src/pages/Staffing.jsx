import { useMemo, useState } from 'react'
import { ArrowUpDown, Users } from 'lucide-react'
import Button from '../components/ui/Button'
import useSortedRecords from '../hooks/useSortedRecords'

const staffingRows = [
  { id: 1, name: 'Logistics Team', assignedCount: 9, event: 'Innovation Expo', shiftDate: '2026-04-11', status: 'Confirmed' },
  { id: 2, name: 'Media Crew', assignedCount: 5, event: 'Debate League Finals', shiftDate: '2026-04-07', status: 'Short Staff' },
  { id: 3, name: 'Registration Desk', assignedCount: 6, event: 'Health Awareness Drive', shiftDate: '2026-04-14', status: 'Confirmed' },
]

export default function Staffing() {
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredRows = useMemo(() => {
    if (statusFilter === 'all') {
      return staffingRows
    }

    return staffingRows.filter((row) => row.status === statusFilter)
  }, [statusFilter])

  const {
    sortBy,
    sortDirection,
    setSortBy,
    toggleDirection,
    sortedRecords,
  } = useSortedRecords(filteredRows, 'shiftDate', 'desc')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100 dark:bg-secondary-900/20">
          <Users size={22} className="text-secondary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Staffing</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage committee assignments and shift readiness.</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-primary-700 dark:bg-primary-900/30">
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter Status
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-primary-700 dark:bg-primary-900 dark:text-white"
            >
              <option value="all">All</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Short Staff">Short Staff</option>
            </select>
          </label>

          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Sort By
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-primary-700 dark:bg-primary-900 dark:text-white"
            >
              <option value="shiftDate">Shift Date</option>
              <option value="name">Team</option>
              <option value="assignedCount">Assigned Count</option>
            </select>
          </label>

          <div className="self-end">
            <Button variant="secondary" className="w-full gap-2" onClick={toggleDirection}>
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
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Team</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Assigned</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Event</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Shift Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-primary-800">
            {sortedRecords.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/90 dark:hover:bg-primary-800/40">
                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{row.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{row.assignedCount}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{row.event}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{row.shiftDate}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
