export default function StatCard({ label, value, tone = 'neutral' }) {
  const toneClasses = {
    neutral: 'bg-gray-50 text-gray-900 dark:bg-primary-900/50 dark:text-gray-100',
    primary: 'bg-primary-50 text-primary-900 dark:bg-primary-900/70 dark:text-primary-100',
    secondary: 'bg-secondary-50 text-secondary-900 dark:bg-secondary-900/25 dark:text-secondary-100',
    success: 'bg-emerald-50 text-emerald-900 dark:bg-emerald-900/25 dark:text-emerald-100',
  }

  const classes = toneClasses[tone] ?? toneClasses.neutral

  return (
    <article className={`rounded-xl border border-gray-200 p-4 shadow-sm dark:border-primary-700 ${classes}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-80">{label}</p>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </article>
  )
}
