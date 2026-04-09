import { useMemo, useState } from 'react'
import { AlertTriangle, ArrowUpDown } from 'lucide-react'
import Button from '../components/ui/Button'
import useSortedRecords from '../hooks/useSortedRecords'

const conflictRows = [
  {
    id: 1,
    title: 'Main Hall overlap',
    event: 'Innovation Expo',
    date: '2026-04-12',
    severity: 'High',
    status: 'Open',
  },
  {
    id: 2,
    title: 'Audio team double booking',
    event: 'Debate League Finals',
    date: '2026-04-08',
    severity: 'Medium',
    status: 'In Progress',
  },
  {
    id: 3,
    title: 'Transport delay risk',
    event: 'Health Awareness Drive',
    date: '2026-04-15',
    severity: 'Low',
    status: 'Open',
  },
]

export default function ConflictCalendar() {
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredRows = useMemo(() => {
    if (statusFilter === 'all') {
      return conflictRows
    }

    return conflictRows.filter((row) => row.status === statusFilter)
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
      <header>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Conflict Calendar</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
          Review schedule and resource conflicts before they escalate into execution blockers.
        </p>
      </header>

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-primary-700 dark:bg-primary-900/30">
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter Status
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-primary-700 dark:bg-primary-900 dark:text-white"
            >
              <option value="all">All</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
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
              <option value="severity">Severity</option>
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
      </section>

      <section className="space-y-3">
        {sortedRecords.map((row) => (
          <article
            key={row.id}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-primary-700 dark:bg-primary-900/30"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-500" />
                <h2 className="font-semibold text-gray-900 dark:text-white">{row.title}</h2>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">{row.date}</span>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{row.event}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700 dark:bg-red-900/20 dark:text-red-300">{row.severity}</span>
              <span className="rounded-full bg-secondary-100 px-2.5 py-1 text-xs font-medium text-secondary-700 dark:bg-secondary-900/20 dark:text-secondary-300">{row.status}</span>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
