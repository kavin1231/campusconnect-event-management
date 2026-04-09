export default function FacultyOverviewCard({ faculty }) {
  return (
    <article className={`overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-primary-800 dark:bg-primary-900 ${faculty.theme.ring} ring-1`}>
      <div className="relative h-56 w-full sm:h-64">
        <img src={faculty.bannerImage} alt={`${faculty.name} banner`} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-primary-900/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${faculty.theme.badge}`}>
            {faculty.name}
          </span>
          <p className="mt-2 text-lg font-semibold text-white sm:text-2xl">Faculty Overview</p>
        </div>
      </div>

      <div className={`space-y-4 p-4 sm:p-5 ${faculty.theme.panel}`}>
        <p className="text-sm leading-6 text-gray-700 dark:text-gray-200">{faculty.shortDescription}</p>
        <ul className="grid gap-2 text-sm text-gray-700 dark:text-gray-200 sm:grid-cols-2">
          {faculty.details.map((item) => (
            <li key={item} className="rounded-md border border-gray-200 bg-white px-3 py-2 dark:border-primary-700 dark:bg-primary-900">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
