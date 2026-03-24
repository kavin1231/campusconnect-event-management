import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0,
  }).format(amount ?? 0)
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null
  }

  const item = payload[0].payload

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg dark:border-primary-700 dark:bg-primary-900">
      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-300">{item.name}</p>
      <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(item.value)}</p>
      <p className="text-xs text-gray-500 dark:text-gray-300">{item.percentage}%</p>
    </div>
  )
}

export default function DonutChartCard({ title, subtitle, data, total }) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-primary-700 dark:bg-primary-900/30">
      <header className="mb-4">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">{subtitle}</p>
      </header>

      <div className="relative h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={105}
              paddingAngle={3}
              cornerRadius={5}
            >
              {data.map((segment) => (
                <Cell key={segment.name} fill={segment.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-xl bg-white/95 px-3 py-2 text-center shadow-sm ring-1 ring-gray-200 dark:bg-primary-950/90 dark:ring-primary-700">
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-300">Total</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(total)}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {data.map((segment) => (
          <div
            key={segment.name}
            className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-primary-700"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: segment.color }}
                aria-hidden="true"
              />
              <span className="text-gray-700 dark:text-gray-200">{segment.name}</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white">{segment.percentage}%</span>
          </div>
        ))}
      </div>
    </article>
  )
}
