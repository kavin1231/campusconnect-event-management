import { Pencil, Trash2 } from 'lucide-react'
import { getStallLabel } from '../../utils/vendorAdapters'

const lkrFormatter = new Intl.NumberFormat('en-LK', {
  style: 'currency',
  currency: 'LKR',
  maximumFractionDigits: 0,
})

export default function VendorTable({ vendors, stalls, onEdit, onDelete }) {
  if (!vendors.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center dark:border-primary-700 dark:bg-primary-900/30">
        <p className="text-sm text-gray-500 dark:text-gray-400">No vendors found for the current filter.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:border-primary-700 dark:bg-primary-900/30">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-primary-700">
        <thead className="bg-gray-50 dark:bg-primary-800/60">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Stall</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Contact Number</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Event Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Fee</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 dark:divide-primary-800">
          {vendors.map((vendor) => (
            <tr key={vendor.id} className="hover:bg-gray-50/90 dark:hover:bg-primary-800/40">
              <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{vendor.name}</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{getStallLabel(stalls, vendor.stallId)}</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{vendor.contactNumber}</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{vendor.eventName}</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{lkrFormatter.format(vendor.fee)}</td>
              <td className="px-4 py-3 text-right">
                <div className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(vendor)}
                    className="rounded-md border border-gray-200 p-2 text-gray-500 transition-colors hover:bg-secondary-50 hover:text-secondary-700 dark:border-primary-700 dark:text-gray-300 dark:hover:bg-primary-800"
                    aria-label={`Edit ${vendor.name}`}
                    title="Edit"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(vendor)}
                    className="rounded-md border border-gray-200 p-2 text-red-600 transition-colors hover:bg-red-50 dark:border-primary-700 dark:text-red-400 dark:hover:bg-red-900/20"
                    aria-label={`Delete ${vendor.name}`}
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
