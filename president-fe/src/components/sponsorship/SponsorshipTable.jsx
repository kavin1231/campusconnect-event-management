import { Pencil, Trash2 } from 'lucide-react'
import { lkrAmountFormatter } from '../../utils/sponsorshipAdapters'

export default function SponsorshipTable({ rows, onEdit, onDelete }) {
  if (!rows.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center dark:border-primary-700 dark:bg-primary-900/30">
        <p className="text-sm text-gray-500 dark:text-gray-400">No sponsorship records found for the current filter.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:border-primary-700 dark:bg-primary-900/30">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-primary-700">
        <thead className="bg-gray-50 dark:bg-primary-800/60">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Sponsor Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Amount</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Event Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Contact</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Date</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Remark</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 dark:divide-primary-800">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50/90 dark:hover:bg-primary-800/40">
              <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{row.name}</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{lkrAmountFormatter.format(row.amount)}</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{row.eventName}</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{row.contact}</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{row.date}</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{row.remark || '-'}</td>
              <td className="px-4 py-3 text-right">
                <div className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(row)}
                    className="rounded-md border border-gray-200 p-2 text-gray-500 transition-colors hover:bg-secondary-50 hover:text-secondary-700 dark:border-primary-700 dark:text-gray-300 dark:hover:bg-primary-800"
                    aria-label={`Edit ${row.name}`}
                    title="Edit"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(row)}
                    className="rounded-md border border-gray-200 p-2 text-red-600 transition-colors hover:bg-red-50 dark:border-primary-700 dark:text-red-400 dark:hover:bg-red-900/20"
                    aria-label={`Delete ${row.name}`}
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
