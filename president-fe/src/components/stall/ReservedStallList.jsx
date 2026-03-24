/**
 * Right-side panel listing all reserved stalls with their assigned vendor.
 */
export default function ReservedStallList({ stalls }) {
  const reserved = stalls.filter((s) => !s.isAvailable)

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-primary-700 dark:bg-primary-900/30 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-primary-800 px-5 py-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Reserved Stalls
        </h2>
        <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900/30 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:text-red-300">
          {reserved.length}
        </span>
      </div>

      {/* List */}
      <ul className="divide-y divide-gray-100 dark:divide-primary-800 overflow-y-auto">
        {reserved.length === 0 ? (
          <li className="px-5 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
            No reserved stalls
          </li>
        ) : (
          reserved.map((stall) => (
            <li key={stall.id} className="flex items-center gap-3 px-5 py-3">
              {/* Red dot */}
              <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-red-500" />
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {stall.stallName}
              </span>
              <span className="text-gray-400 dark:text-gray-500">–</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {stall.vendorName ?? 'Unassigned'}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
