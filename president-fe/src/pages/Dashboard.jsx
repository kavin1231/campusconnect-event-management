import { useEffect, useMemo, useRef, useState } from 'react'
import { Download } from 'lucide-react'
import EventOverview from '../components/dashboard/EventOverview'
import EventSidebar from '../components/dashboard/EventSidebar'
import Button from '../components/ui/Button'
import { exportDashboardPdf } from '../utils/dashboardPdf'
import { fetchDashboardEvents } from '../services/dashboardApi'

export default function Dashboard() {
  const [events, setEvents] = useState([])
  const [selectedEventName, setSelectedEventName] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const dashboardSectionRef = useRef(null)

  useEffect(() => {
    let active = true

    async function loadDashboardData() {
      try {
        setIsLoading(true)
        const rows = await fetchDashboardEvents()

        if (!active) {
          return
        }

        setEvents(rows)
        setSelectedEventName((current) => {
          if (current && rows.some((row) => row.event_name === current)) {
            return current
          }
          return rows[0]?.event_name ?? ''
        })
        setErrorMessage('')
      } catch (error) {
        if (active) {
          setErrorMessage(error.message || 'Failed to load dashboard data')
        }
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    loadDashboardData()

    return () => {
      active = false
    }
  }, [])

  const selectedEvent = useMemo(
    () => events.find((eventItem) => eventItem.event_name === selectedEventName) ?? null,
    [events, selectedEventName]
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
            events={events}
            selectedEventName={selectedEventName}
            onSelectEvent={setSelectedEventName}
          />
        </div>

        <div className="lg:col-span-9">
          {isLoading ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm dark:border-primary-700 dark:bg-primary-900/30 dark:text-gray-300">
              Loading dashboard data...
            </div>
          ) : errorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-200">
              {errorMessage}
            </div>
          ) : (
            <EventOverview eventData={selectedEvent} />
          )}
        </div>
      </section>
    </div>
  )
}
