import StatCard from './StatCard'
import DonutChartCard from './DonutChartCard'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0,
  }).format(amount ?? 0)
}

export default function EventOverview({ eventData }) {
  if (!eventData) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500 shadow-sm dark:border-primary-700 dark:bg-primary-900/30 dark:text-gray-300">
        Select an event to view details.
      </div>
    )
  }

  const totalSponsorContribution = eventData.sponsors.reduce((sum, sponsor) => sum + sponsor.amount, 0)
  const totalVendorFees = eventData.vendors.reduce((sum, vendor) => sum + vendor.fee, 0)
  const totalVendorProfit = eventData.vendors.reduce((sum, vendor) => sum + vendor.profit, 0)
  const totalIncomeForChart = totalSponsorContribution + totalVendorFees + eventData.merchandise_income
  const safeIncomeTotal = totalIncomeForChart > 0 ? totalIncomeForChart : 1
  const safeExpenseTotal = eventData.total_expenses > 0 ? eventData.total_expenses : 1
  const expenseEntries = Object.entries(eventData.expenses)
  const highestExpenseEntry = expenseEntries.reduce(
    (maxEntry, currentEntry) => (currentEntry[1] > maxEntry[1] ? currentEntry : maxEntry),
    expenseEntries[0]
  )

  const topSponsor =
    eventData.sponsors.length > 0
      ? eventData.sponsors.reduce(
          (top, sponsor) => (sponsor.amount > top.amount ? sponsor : top),
          eventData.sponsors[0]
        )
      : { name: 'N/A', amount: 0, profit_share: 0 }

  const topVendor =
    eventData.vendors.length > 0
      ? eventData.vendors.reduce(
          (top, vendor) => (vendor.profit > top.profit ? vendor : top),
          eventData.vendors[0]
        )
      : { name: 'N/A', profit: 0 }

  const incomeChartData = [
    {
      name: 'Sponsors',
      value: totalSponsorContribution,
      color: '#0D4480',
      percentage: ((totalSponsorContribution / safeIncomeTotal) * 100).toFixed(1),
    },
    {
      name: 'Vendor Fees',
      value: totalVendorFees,
      color: '#FF7100',
      percentage: ((totalVendorFees / safeIncomeTotal) * 100).toFixed(1),
    },
    {
      name: 'Merchandise',
      value: eventData.merchandise_income,
      color: '#15803D',
      percentage: ((eventData.merchandise_income / safeIncomeTotal) * 100).toFixed(1),
    },
  ]

  const expenseChartData = [
    {
      name: 'Lighting',
      value: eventData.expenses.lighting,
      color: '#1D4ED8',
      percentage: ((eventData.expenses.lighting / safeExpenseTotal) * 100).toFixed(1),
    },
    {
      name: 'Sound',
      value: eventData.expenses.sound,
      color: '#F97316',
      percentage: ((eventData.expenses.sound / safeExpenseTotal) * 100).toFixed(1),
    },
    {
      name: 'Costumes',
      value: eventData.expenses.costumes,
      color: '#9333EA',
      percentage: ((eventData.expenses.costumes / safeExpenseTotal) * 100).toFixed(1),
    },
    {
      name: 'Miscellaneous',
      value: eventData.expenses.miscellaneous,
      color: '#14B8A6',
      percentage: ((eventData.expenses.miscellaneous / safeExpenseTotal) * 100).toFixed(1),
    },
  ]

  return (
    <section className="space-y-5">
      <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-primary-700 dark:bg-primary-900/30">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{eventData.event_name}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
          {eventData.date} | {eventData.start_time} - {eventData.end_time}
        </p>
      </article>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Income" value={formatCurrency(eventData.total_income)} tone="primary" />
        <StatCard label="Total Expenses" value={formatCurrency(eventData.total_expenses)} tone="secondary" />
        <StatCard label="Total Profit" value={formatCurrency(eventData.total_profit)} tone="success" />
        <StatCard label="Merchandise Income" value={formatCurrency(eventData.merchandise_income)} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <DonutChartCard
          title="Income Breakdown"
          subtitle="Distribution of sponsor, vendor, and merchandise income"
          data={incomeChartData}
          total={eventData.total_income}
        />
        <DonutChartCard
          title="Expense Breakdown"
          subtitle="Distribution of operational expenses"
          data={expenseChartData}
          total={eventData.total_expenses}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-primary-700 dark:bg-primary-900/30">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Sponsor Analysis</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
            Total sponsor backing: {formatCurrency(totalSponsorContribution)}
          </p>
          <dl className="mt-4 space-y-3 text-sm text-gray-700 dark:text-gray-200">
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-2 dark:border-primary-800">
              <dt>Top sponsor</dt>
              <dd className="font-medium">{topSponsor.name}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-2 dark:border-primary-800">
              <dt>Top sponsor amount</dt>
              <dd className="font-medium">{formatCurrency(topSponsor.amount)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt>Profit share paid</dt>
              <dd className="font-medium">{formatCurrency(topSponsor.profit_share)}</dd>
            </div>
          </dl>
        </article>

        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-primary-700 dark:bg-primary-900/30">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Vendor Analysis</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
            Vendor fee total: {formatCurrency(totalVendorFees)}
          </p>
          <dl className="mt-4 space-y-3 text-sm text-gray-700 dark:text-gray-200">
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-2 dark:border-primary-800">
              <dt>Most profitable vendor</dt>
              <dd className="font-medium">{topVendor.name}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-2 dark:border-primary-800">
              <dt>Total vendor profit</dt>
              <dd className="font-medium">{formatCurrency(totalVendorProfit)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt>Vendor count</dt>
              <dd className="font-medium">{eventData.vendors.length}</dd>
            </div>
          </dl>
        </article>
      </div>

      <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-primary-700 dark:bg-primary-900/30">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Expense Breakdown</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
          Highest expense area: {highestExpenseEntry[0]} ({formatCurrency(highestExpenseEntry[1])})
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {expenseEntries.map(([label, amount]) => (
            <div key={label} className="rounded-lg border border-gray-200 px-3 py-3 dark:border-primary-700">
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-300">{label}</p>
              <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(amount)}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}
