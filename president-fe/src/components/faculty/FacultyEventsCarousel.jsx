import { useEffect, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, MapPin } from 'lucide-react'

export default function FacultyEventsCarousel({ events, accentClass }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!events.length) return undefined
    const timer = setInterval(() => {
      setCurrentIndex((index) => (index + 1) % events.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [events])

  if (!events.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500 dark:border-primary-700 dark:bg-primary-900 dark:text-gray-300">
        No faculty events available.
      </div>
    )
  }

  function prev() {
    setCurrentIndex((index) => (index - 1 + events.length) % events.length)
  }

  function next() {
    setCurrentIndex((index) => (index + 1) % events.length)
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-primary-800 dark:bg-primary-900 md:p-5">
      <div className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-primary-700">
        <div className="relative aspect-[16/9]">
          {events.map((eventItem, index) => {
            const isActive = index === currentIndex
            return (
              <div
                key={eventItem.id}
                className={`absolute inset-0 transition-all duration-700 ease-out ${
                  isActive ? 'opacity-100 scale-100' : 'pointer-events-none opacity-0 scale-[1.02]'
                }`}
              >
                <img src={eventItem.image} alt={`${eventItem.title} banner`} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/85 via-primary-900/20 to-transparent" />

                <div className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-500 md:p-5 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}>
                  <h3 className="text-lg font-semibold text-white md:text-2xl">{eventItem.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-100 md:text-sm">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/25 px-2.5 py-1 backdrop-blur-sm">
                      <CalendarDays size={14} />
                      {eventItem.date}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/25 px-2.5 py-1 backdrop-blur-sm">
                      <MapPin size={14} />
                      {eventItem.venue}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}

          <button
            type="button"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition-all hover:scale-105 hover:bg-black/60"
            aria-label="Previous faculty event"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition-all hover:scale-105 hover:bg-black/60"
            aria-label="Next faculty event"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        {events.map((eventItem, index) => (
          <button
            key={eventItem.id}
            type="button"
            onClick={() => setCurrentIndex(index)}
            className={`h-2.5 rounded-full transition-all duration-500 ${index === currentIndex ? `w-7 ${accentClass}` : 'w-2.5 bg-gray-300 hover:bg-gray-400 dark:bg-primary-700 dark:hover:bg-primary-600'}`}
            aria-label={`View ${eventItem.title}`}
          />
        ))}
      </div>
    </section>
  )
}
