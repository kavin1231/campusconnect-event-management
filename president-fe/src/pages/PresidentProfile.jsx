import presidentProfile from '../../asset/json/presidentProfile.json'
import upcomingEvents from '../../asset/json/upcomingEvents.json'
import PresidentProfileCard from '../components/profile/PresidentProfileCard'
import UpcomingEventsSlider from '../components/profile/UpcomingEventsSlider'

import presidentAvatar from '../../asset/images/profile/president-avatar.svg'
import innovationSprint from '../../asset/images/events/innovation-sprint.svg'
import leadershipForum from '../../asset/images/events/leadership-forum.svg'
import techTalent from '../../asset/images/events/tech-talent.svg'
import volunteerDay from '../../asset/images/events/volunteer-day.svg'
import culturalNight from '../../asset/images/events/cultural-night.svg'

const profileImageMap = {
  'president-avatar': presidentAvatar,
}

const eventImageMap = {
  'innovation-sprint': innovationSprint,
  'leadership-forum': leadershipForum,
  'tech-talent': techTalent,
  'volunteer-day': volunteerDay,
  'cultural-night': culturalNight,
}

export default function PresidentProfile() {
  const profileImage = profileImageMap[presidentProfile.profileImageKey] ?? presidentAvatar
  const eventsWithImages = upcomingEvents.map((eventItem) => ({
    ...eventItem,
    image: eventImageMap[eventItem.imageKey] ?? innovationSprint,
  }))

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">President Account</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
          View and manage the president profile details and upcoming university event schedule.
        </p>
      </header>

      <PresidentProfileCard president={presidentProfile} imageSrc={profileImage} />

      <section className="space-y-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Upcoming Events</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
            Preview scheduled events and quickly scan event highlights.
          </p>
        </div>
        <UpcomingEventsSlider events={eventsWithImages} />
      </section>
    </div>
  )
}
