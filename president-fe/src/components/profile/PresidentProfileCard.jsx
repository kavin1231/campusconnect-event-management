import { Mail, Phone, GraduationCap, BadgeCheck } from 'lucide-react'
import Button from '../ui/Button'

export default function PresidentProfileCard({ president, imageSrc }) {
  const details = [
    { label: 'IT Number', value: president.itNumber },
    { label: 'Age', value: `${president.age}` },
    { label: 'Faculty', value: president.faculty },
    { label: 'Office Hours', value: president.officeHours },
    { label: 'Joined', value: president.joinedDate },
  ]

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-primary-800 dark:bg-primary-900">
      <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-start">
        <div className="flex flex-col items-center gap-3">
          <img
            src={imageSrc}
            alt={`${president.name} profile`}
            className="h-44 w-44 rounded-full border-4 border-secondary-500/40 object-cover"
          />
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary-100 px-3 py-1 text-xs font-medium text-secondary-700 dark:bg-secondary-600/20 dark:text-secondary-200">
            <BadgeCheck size={14} />
            Active President
          </span>
        </div>

        <div className="space-y-4">
          <header>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{president.name}</h2>
            <p className="mt-1 text-sm font-medium text-secondary-700 dark:text-secondary-300">{president.role}</p>
          </header>

          <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">{president.about}</p>

          <div className="grid gap-3 sm:grid-cols-2">
            {details.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-primary-700 dark:bg-primary-800/70"
              >
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{item.label}</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 dark:border-primary-700 dark:text-gray-200">
              <Mail size={16} className="text-secondary-600" />
              <span>{president.email}</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 dark:border-primary-700 dark:text-gray-200">
              <Phone size={16} className="text-secondary-600" />
              <span>{president.contact}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4 dark:border-primary-700">
            <div className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <GraduationCap size={16} className="text-secondary-600" />
              <span>President Office - Student Governance</span>
            </div>
            <Button type="button" className="min-w-28">Add Event</Button>
          </div>
        </div>
      </div>
    </article>
  )
}
