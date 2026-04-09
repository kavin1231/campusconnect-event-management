import { useMemo, useState } from 'react'
import FacultyTabs from '../components/faculty/FacultyTabs'
import FacultyOverviewCard from '../components/faculty/FacultyOverviewCard'
import FacultyPersonCard from '../components/faculty/FacultyPersonCard'
import FacultyStaffGrid from '../components/faculty/FacultyStaffGrid'
import FacultyEventsCarousel from '../components/faculty/FacultyEventsCarousel'
import { facultyList } from '../constants/facultyData'

export default function Faculty() {
  const [activeFacultySlug, setActiveFacultySlug] = useState(facultyList[0]?.slug ?? '')

  const activeFaculty = useMemo(
    () => facultyList.find((faculty) => faculty.slug === activeFacultySlug) ?? facultyList[0],
    [activeFacultySlug]
  )

  if (!activeFaculty) {
    return null
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Faculty Module</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
          Browse faculty profiles, leadership, academic staff, and faculty-organized events.
        </p>
      </header>

      <FacultyTabs faculties={facultyList} activeSlug={activeFaculty.slug} onSelect={setActiveFacultySlug} />

      <FacultyOverviewCard faculty={activeFaculty} />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Head of Faculty</h2>
        <FacultyPersonCard person={activeFaculty.head} roleLabel="Faculty Leadership" ringClass={activeFaculty.theme.ring} />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Staff Members</h2>
        <FacultyStaffGrid staff={activeFaculty.staff} ringClass={activeFaculty.theme.ring} />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Faculty Events</h2>
        <FacultyEventsCarousel events={activeFaculty.events} accentClass={activeFaculty.theme.activeTab.split(' ')[0]} />
      </section>
    </div>
  )
}
