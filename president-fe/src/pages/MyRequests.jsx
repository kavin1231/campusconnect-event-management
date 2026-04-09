import { useMemo, useState } from 'react'
import { ArrowUpDown, ClipboardList } from 'lucide-react'
import Button from '../components/ui/Button'
import useSortedRecords from '../hooks/useSortedRecords'

const requestRows = [
  { id: 1, request: 'Additional speaker system', requester: 'Media Club', date: '2026-04-03', status: 'Pending' },
  { id: 2, request: 'Transport bus allocation', requester: 'Sports Council', date: '2026-04-02', status: 'Approved' },
  { id: 3, request: 'Medical support desk', requester: 'Health Society', date: '2026-04-05', status: 'Pending' },
  { id: 4, request: 'Guest pass extension', requester: 'Innovation Team', date: '2026-03-31', status: 'Rejected' },
]

export default function MyRequests() {
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredRows = useMemo(() => {
    if (statusFilter === 'all') {
      return requestRows
    }

    return requestRows.filter((row) => row.status === statusFilter)
  }, [statusFilter])

  const {
    sortBy,
    sortDirection,
    setSortBy,
    toggleDirection,
    sortedRecords,
  } = useSortedRecords(filteredRows, 'date', 'desc')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100 dark:bg-secondary-900/20">
          <ClipboardList size={22} className="text-secondary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">My Requests</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Review operational and resource requests submitted to your office.</p>
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
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </label>

          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Sort By
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-primary-700 dark:bg-primary-900 dark:text-white"
            >
              <option value="date">Date</option>
              <option value="request">Request</option>
              <option value="status">Status</option>
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
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Request</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Requester</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-primary-800">
            {sortedRecords.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/90 dark:hover:bg-primary-800/40">
                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{row.request}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{row.requester}</td>
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
