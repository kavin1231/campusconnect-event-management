import StallBox from './StallBox'

/**
 * Visual grid of all stalls (5 columns × 4 rows = 20 stalls).
 */
export default function StallMap({ stalls }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-primary-700 dark:bg-primary-900/30">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        Stall Map
      </h2>
      <div className="grid grid-cols-5 gap-3">
        {stalls.map((stall) => (
          <StallBox
            key={stall.id}
            stallName={stall.stallName}
            isAvailable={stall.isAvailable}
          />
        ))}
      </div>
    </div>
  )
}
