import { useMemo, useState } from 'react'
import eventData from '../../asset/json/event.json'
import EventOverview from '../components/dashboard/EventOverview'
import EventSidebar from '../components/dashboard/EventSidebar'

export default function Dashboard() {
  const [selectedEventName, setSelectedEventName] = useState(eventData[0]?.event_name ?? '')

  const selectedEvent = useMemo(
    () => eventData.find((eventItem) => eventItem.event_name === selectedEventName) ?? null,
    [selectedEventName]
  )

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Event Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
          Select an event from the sidebar to review details and operational analysis.
        </p>
      </header>

      <section className="grid gap-5 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-3">
          <EventSidebar
            events={eventData}
            selectedEventName={selectedEventName}
            onSelectEvent={setSelectedEventName}
          />
        </div>

        <div className="lg:col-span-9">
          <EventOverview eventData={selectedEvent} />
        </div>
      </section>
    </div>
  )
}
