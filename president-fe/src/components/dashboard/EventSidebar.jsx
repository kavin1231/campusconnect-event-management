import { CalendarDays } from 'lucide-react'

export default function EventSidebar({ events, selectedEventName, onSelectEvent }) {
  return (
    <aside className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-primary-700 dark:bg-primary-900/30 lg:h-full">
      <header className="mb-4 flex items-center gap-2 border-b border-gray-200 pb-3 dark:border-primary-700">
        <CalendarDays size={18} className="text-secondary-600" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Events</h2>
      </header>

      <nav className="space-y-2">
        {events.map((eventItem) => {
          const isActive = eventItem.event_name === selectedEventName

          return (
            <button
              key={eventItem.event_name}
              type="button"
              onClick={() => onSelectEvent(eventItem.event_name)}
              className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                isActive
                  ? 'border-secondary-600 bg-secondary-50 text-secondary-900 dark:bg-secondary-900/30 dark:text-secondary-100'
                  : 'border-gray-200 text-gray-700 hover:border-secondary-300 hover:bg-secondary-50/60 dark:border-primary-700 dark:text-gray-200 dark:hover:bg-primary-800/40'
              }`}
            >
              <p className="font-medium">{eventItem.event_name}</p>
              <p className="mt-1 text-xs opacity-70">{eventItem.date}</p>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
