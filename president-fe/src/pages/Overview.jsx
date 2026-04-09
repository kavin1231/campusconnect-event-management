import { CalendarCheck2, ClipboardList, AlertTriangle, Wallet } from 'lucide-react'

const overviewStats = [
  {
    title: 'Active Events',
    value: '08',
    note: '3 events begin this week',
    icon: CalendarCheck2,
    color: 'text-secondary-600',
  },
  {
    title: 'Pending Requests',
    value: '14',
    note: 'Awaiting committee review',
    icon: ClipboardList,
    color: 'text-amber-600',
  },
  {
    title: 'Conflict Alerts',
    value: '04',
    note: 'Venue/time overlaps detected',
    icon: AlertTriangle,
    color: 'text-red-600',
  },
  {
    title: 'Budget Available',
    value: 'LKR 420,000',
    note: 'Updated 10 minutes ago',
    icon: Wallet,
    color: 'text-emerald-600',
  },
]

const timelineItems = [
  { id: 1, title: 'Media Club Workshop', date: '2026-04-02', status: 'Ready' },
  { id: 2, title: 'Sports Council Orientation', date: '2026-04-05', status: 'Staffing Needed' },
  { id: 3, title: 'Innovation Expo', date: '2026-04-12', status: 'Pending Venue Approval' },
]

export default function Overview() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Overview</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
          High-level summary of operations, approvals, and upcoming execution priorities.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewStats.map((item) => {
          const Icon = item.icon

          return (
            <article
              key={item.title}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-primary-700 dark:bg-primary-900/30"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.title}</p>
                  <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{item.value}</p>
                </div>
                <Icon size={20} className={item.color} />
              </div>
              <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">{item.note}</p>
            </article>
          )
        })}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-primary-700 dark:bg-primary-900/30">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Milestones</h2>
        <ul className="mt-4 space-y-3">
          {timelineItems.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-2 rounded-lg border border-gray-100 px-4 py-3 dark:border-primary-800 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.date}</p>
              </div>
              <span className="inline-flex rounded-full bg-secondary-100 px-3 py-1 text-xs font-semibold text-secondary-700 dark:bg-secondary-900/20 dark:text-secondary-200">
                {item.status}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
