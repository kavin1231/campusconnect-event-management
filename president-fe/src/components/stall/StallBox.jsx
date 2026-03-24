/**
 * A single stall square in the visual map.
 * Blue  = available
 * Red   = reserved
 */
export default function StallBox({ stallName, isAvailable }) {
  return (
    <div
      title={isAvailable ? `${stallName} — Available` : `${stallName} — Reserved`}
      className={`
        aspect-square flex items-center justify-center rounded-lg border-2
        text-sm font-semibold select-none cursor-pointer
        transition-all duration-150 hover:scale-105 hover:shadow-md
        ${
          isAvailable
            ? 'bg-primary-50 border-primary-300 text-primary-800 hover:bg-primary-100 dark:bg-primary-900/40 dark:border-primary-600 dark:text-primary-200 dark:hover:bg-primary-800/60'
            : 'bg-red-50 border-red-300 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-800/40'
        }
      `}
    >
      {stallName}
    </div>
  )
}
