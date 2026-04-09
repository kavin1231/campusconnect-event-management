import { useMemo, useRef, useState } from 'react'
import { Download } from 'lucide-react'
import eventData from '../../asset/json/event.json'
import EventOverview from '../components/dashboard/EventOverview'
import EventSidebar from '../components/dashboard/EventSidebar'
import Button from '../components/ui/Button'
import { exportDashboardPdf } from '../utils/dashboardPdf'

export default function Dashboard() {
  const [selectedEventName, setSelectedEventName] = useState(eventData[0]?.event_name ?? '')
  const [isExporting, setIsExporting] = useState(false)
  const dashboardSectionRef = useRef(null)

  const selectedEvent = useMemo(
    () => eventData.find((eventItem) => eventItem.event_name === selectedEventName) ?? null,
    [selectedEventName]
  )

  async function handleDownloadPdf() {
    if (!selectedEvent) {
      return
    }

    try {
      setIsExporting(true)
      await exportDashboardPdf({
        targetElement: dashboardSectionRef.current,
        eventData: selectedEvent,
      })
    } catch (error) {
      console.error('Failed to export dashboard PDF:', error)
      window.alert('Could not generate PDF right now. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Event Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
            Select an event from the sidebar to review details and operational analysis.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleDownloadPdf}
          loading={isExporting}
          disabled={!selectedEvent}
          className="gap-2 self-start"
        >
          <Download size={16} />
          {isExporting ? 'Exporting PDF...' : 'Download PDF'}
        </Button>
      </header>

      <section ref={dashboardSectionRef} className="grid gap-5 lg:grid-cols-12 lg:items-start">
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
