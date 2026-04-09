export default function FacultyTabs({ faculties, activeSlug, onSelect }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-primary-800 dark:bg-primary-900">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {faculties.map((faculty) => {
          const isActive = activeSlug === faculty.slug
          return (
            <button
              key={faculty.slug}
              type="button"
              onClick={() => onSelect(faculty.slug)}
              className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? faculty.theme.activeTab
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-primary-800 dark:text-gray-200 dark:hover:bg-primary-700'
              }`}
            >
              {faculty.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
