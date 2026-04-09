export default function FacultyPersonCard({ person, roleLabel, ringClass }) {
  return (
    <article className={`rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-primary-800 dark:bg-primary-900 ${ringClass} ring-1`}>
      <div className="flex items-center gap-4">
        <img
          src={person.image}
          alt={`${person.name} profile`}
          className="h-16 w-16 rounded-full border-2 border-white object-cover shadow dark:border-primary-800"
        />
        <div>
          {roleLabel ? <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{roleLabel}</p> : null}
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{person.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{person.designation ?? person.profession}</p>
        </div>
      </div>
    </article>
  )
}
