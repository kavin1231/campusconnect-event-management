import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CalendarDays,
  CircleDollarSign,
  Download,
  Drum,
  HandCoins,
  Landmark,
  Lightbulb,
  Music,
  Shield,
  ShoppingBag,
  Sparkles,
  Store,
  Ticket,
  Truck,
  Utensils,
  Wallet,
} from "lucide-react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Sidebar from "../common/Sidebar";
import { governanceAPI } from "../../services/api";
import "./PresidentFinanceDashboard.css";

const DATE_FILTERS = [
  { label: "All Dates", value: "ALL" },
  { label: "Last 30 Days", value: "LAST_30_DAYS" },
  { label: "Last 90 Days", value: "LAST_90_DAYS" },
  { label: "This Year", value: "THIS_YEAR" },
];

const INCOME_COLORS = {
  sponsorship: "#0ea5e9",
  vendorFees: "#22c55e",
  merchandise: "#14b8a6",
  ticketSales: "#3b82f6",
  donations: "#0d9488",
  otherIncome: "#06b6d4",
};

const EXPENSE_COLORS = {
  bandCost: "#ef4444",
  lightingSound: "#f97316",
  decorations: "#fb7185",
  foodCatering: "#f59e0b",
  transport: "#eab308",
  security: "#a855f7",
  otherExpenses: "#f59e0b",
};

const ICON_BY_KEY = {
  sponsorship: Landmark,
  vendorFees: Store,
  merchandise: ShoppingBag,
  ticketSales: Ticket,
  donations: HandCoins,
  otherIncome: Wallet,
  bandCost: Music,
  lightingSound: Lightbulb,
  decorations: Sparkles,
  foodCatering: Utensils,
  transport: Truck,
  security: Shield,
  otherExpenses: Ticket,
};

const EMPTY_DASHBOARD_DATA = {
  summary: {
    totalIncome: 0,
    sponsorshipIncome: 0,
    vendorFeeIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    currency: "LKR",
  },
  incomeBreakdown: [
    { key: "sponsorship", label: "Sponsorship", amount: 0, color: INCOME_COLORS.sponsorship },
    { key: "vendorFees", label: "Vendor Fees", amount: 0, color: INCOME_COLORS.vendorFees },
    { key: "merchandise", label: "Merchandise", amount: 0, color: INCOME_COLORS.merchandise },
    { key: "ticketSales", label: "Ticket Sales", amount: 0, color: INCOME_COLORS.ticketSales },
    { key: "donations", label: "Donations", amount: 0, color: INCOME_COLORS.donations },
    { key: "otherIncome", label: "Other Income", amount: 0, color: INCOME_COLORS.otherIncome },
  ],
  expenseBreakdown: [
    { key: "bandCost", label: "Band Cost", amount: 0, color: EXPENSE_COLORS.bandCost },
    { key: "lightingSound", label: "Lighting & Sound", amount: 0, color: EXPENSE_COLORS.lightingSound },
    { key: "decorations", label: "Decorations", amount: 0, color: EXPENSE_COLORS.decorations },
    { key: "foodCatering", label: "Food / Catering", amount: 0, color: EXPENSE_COLORS.foodCatering },
    { key: "transport", label: "Transport", amount: 0, color: EXPENSE_COLORS.transport },
    { key: "security", label: "Security", amount: 0, color: EXPENSE_COLORS.security },
    { key: "otherExpenses", label: "Other Expenses", amount: 0, color: EXPENSE_COLORS.otherExpenses },
  ],
  recentRecords: [],
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
};

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const PresidentFinanceDashboard = () => {
  const navigate = useNavigate();
  const [eventFilter, setEventFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [events, setEvents] = useState([]);
  const [dashboardData, setDashboardData] = useState(EMPTY_DASHBOARD_DATA);
  const [loading, setLoading] = useState(true);

  const selectedDateLabel =
    DATE_FILTERS.find((item) => item.value === dateFilter)?.label || "All Dates";

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const eventsResponse = await governanceAPI.listEvents();
        if (eventsResponse.success && Array.isArray(eventsResponse.events)) {
          setEvents(eventsResponse.events);
        }
      } catch (error) {
        console.error("Failed to load events for finance filters:", error);
      }
    };

    bootstrap();
  }, []);

  useEffect(() => {
    const loadFinanceDashboard = async () => {
      setLoading(true);
      try {
        const response = await governanceAPI.getFinanceDashboard({ eventId: eventFilter });
        if (response.success && response.data) {
          setDashboardData(response.data);
        } else {
          setDashboardData(EMPTY_DASHBOARD_DATA);
        }
      } catch (error) {
        console.error("Failed to load finance dashboard:", error);
        setDashboardData(EMPTY_DASHBOARD_DATA);
      } finally {
        setLoading(false);
      }
    };

    loadFinanceDashboard();
  }, [eventFilter]);

  const eventOptions = useMemo(() => {
    return events.map((event) => ({
      label: event.title || event.eventName || `Event ${event.id || event.eventId}`,
      value: String(event.id || event.eventId),
    }));
  }, [events]);

  const incomeTotal = Number(dashboardData.summary?.totalIncome || 0);
  const expenseTotal = Number(dashboardData.summary?.totalExpenses || 0);
  const netValue = incomeTotal - expenseTotal;

  const incomeChartData = useMemo(() => {
    const source = dashboardData.incomeBreakdown || [];
    return source.map((item) => ({
      key: item.key,
      name: item.label,
      value: Number(item.amount || 0),
      color: item.color || INCOME_COLORS[item.key] || "#22c55e",
      icon: ICON_BY_KEY[item.key] || Wallet,
    }));
  }, [dashboardData.incomeBreakdown]);

  const expenseChartData = useMemo(() => {
    const source = dashboardData.expenseBreakdown || [];
    return source.map((item) => ({
      key: item.key,
      name: item.label,
      value: Number(item.amount || 0),
      color: item.color || EXPENSE_COLORS[item.key] || "#f97316",
      icon: ICON_BY_KEY[item.key] || Ticket,
    }));
  }, [dashboardData.expenseBreakdown]);

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    const generatedAt = formatDate(new Date().toISOString());

    doc.setFontSize(18);
    doc.text("President Finance Dashboard Report", 14, 18);

    doc.setFontSize(11);
    doc.text(`Generated: ${generatedAt}`, 14, 26);
    doc.text(
      `Filters: Event = ${eventFilter === "ALL" ? "All Events" : eventOptions.find((opt) => opt.value === eventFilter)?.label || "All Events"}, Date = ${selectedDateLabel}`,
      14,
      32,
    );

    autoTable(doc, {
      startY: 38,
      head: [["Summary", "Amount"]],
      body: [
        ["Total Income", formatCurrency(incomeTotal)],
        ["Total Expenses", formatCurrency(expenseTotal)],
        [netValue >= 0 ? "Net Profit" : "Net Loss", formatCurrency(Math.abs(netValue))],
      ],
      styles: { fontSize: 10 },
      headStyles: { fillColor: [15, 118, 110] },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 8,
      head: [["Income Category", "Amount"]],
      body: incomeChartData.map((item) => [item.name, formatCurrency(item.value)]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [14, 165, 233] },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 8,
      head: [["Expense Category", "Amount"]],
      body: expenseChartData.map((item) => [item.name, formatCurrency(item.value)]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [239, 68, 68] },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 8,
      head: [["Scope", "Date Filter", "Income", "Expenses", "Net"]],
      body: [[
        eventFilter === "ALL"
          ? "All Events"
          : eventOptions.find((opt) => String(opt.value) === String(eventFilter))?.label || "Selected Event",
        selectedDateLabel,
        formatCurrency(incomeTotal),
        formatCurrency(expenseTotal),
        formatCurrency(netValue),
      ]],
      styles: { fontSize: 9 },
      headStyles: { fillColor: [51, 65, 85] },
    });

    doc.save(`president-finance-report-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="pres-finance-shell">
      <Sidebar isAdmin={true} />

      <main className="pres-finance-main">
        <section className="pres-finance-header">
          <div>
            <p className="pres-kicker">President Analytics</p>
            <h1>Income vs Expenses Dashboard</h1>
            <p className="pres-subtitle">
              Track event-level earnings, monitor spending, and review profitability in one place.
            </p>
          </div>

          <div className="pres-controls">
            <div className="pres-filters" aria-label="Dashboard filters">
              <label>
                <CalendarDays size={16} />
                <span>Date</span>
                <select value={dateFilter} onChange={(event) => setDateFilter(event.target.value)}>
                  {DATE_FILTERS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <Wallet size={16} />
                <span>Event</span>
                <select value={eventFilter} onChange={(event) => setEventFilter(event.target.value)}>
                  <option value="ALL">All Events</option>
                  {eventOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <button type="button" className="pres-download-button" onClick={handleDownloadPdf}>
              <Download size={16} />
              Download PDF
            </button>
            <button
              type="button"
              className="pres-entry-button"
              onClick={() => navigate("/governance/finance/entries")}
            >
              <Drum size={16} />
              Manage Entries
            </button>
          </div>
        </section>

        <section className="pres-summary-grid">
          <article className="pres-summary-card pres-income-card">
            <div className="pres-summary-icon">
              <ArrowUpCircle size={20} />
            </div>
            <p>Total Income</p>
            <h2>{loading ? "..." : formatCurrency(incomeTotal)}</h2>
          </article>

          <article className="pres-summary-card pres-expense-card">
            <div className="pres-summary-icon">
              <ArrowDownCircle size={20} />
            </div>
            <p>Total Expenses</p>
            <h2>{loading ? "..." : formatCurrency(expenseTotal)}</h2>
          </article>

          <article
            className={`pres-summary-card ${
              netValue >= 0 ? "pres-profit-card" : "pres-loss-card"
            }`}
          >
            <div className="pres-summary-icon">
              <CircleDollarSign size={20} />
            </div>
            <p>{netValue >= 0 ? "Net Profit" : "Net Loss"}</p>
            <h2>{loading ? "..." : formatCurrency(Math.abs(netValue))}</h2>
          </article>
        </section>

        <section className="pres-chart-grid">
          <article className="pres-panel-card">
            <header className="pres-panel-head">
              <div>
                <h3>Income Distribution</h3>
                <p>Sponsorship, vendor fees, and merchandise</p>
              </div>
              <button
                type="button"
                className="pres-ghost-button pres-income-tone"
                onClick={() => navigate("/governance/finance/entries")}
              >
                View Details
              </button>
            </header>

            <div className="pres-chart-wrap" role="img" aria-label="Income distribution chart">
              <ResponsiveContainer width="100%" height={290}>
                <PieChart>
                  <Pie
                    data={incomeChartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={76}
                    outerRadius={112}
                    paddingAngle={4}
                  >
                    {incomeChartData.map((entry) => (
                      <Cell key={entry.key} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <ul className="pres-breakdown-list">
              {incomeChartData.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <li key={item.key}>
                    <span className="pres-breakdown-left">
                      <ItemIcon size={16} style={{ color: item.color }} />
                      {item.name}
                    </span>
                    <strong>{formatCurrency(item.value)}</strong>
                  </li>
                );
              })}
            </ul>
          </article>

          <article className="pres-panel-card">
            <header className="pres-panel-head">
              <div>
                <h3>Expense Distribution</h3>
                <p>Band, lighting, decor, and operational spending</p>
              </div>
              <button
                type="button"
                className="pres-ghost-button pres-expense-tone"
                onClick={() => navigate("/governance/finance/entries")}
              >
                View Details
              </button>
            </header>

            <div className="pres-chart-wrap" role="img" aria-label="Expense distribution chart">
              <ResponsiveContainer width="100%" height={290}>
                <PieChart>
                  <Pie
                    data={expenseChartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={76}
                    outerRadius={112}
                    paddingAngle={4}
                  >
                    {expenseChartData.map((entry) => (
                      <Cell key={entry.key} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <ul className="pres-breakdown-list">
              {expenseChartData.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <li key={item.key}>
                    <span className="pres-breakdown-left">
                      <ItemIcon size={16} style={{ color: item.color }} />
                      {item.name}
                    </span>
                    <strong>{formatCurrency(item.value)}</strong>
                  </li>
                );
              })}
            </ul>
          </article>
        </section>

        <section className="pres-records-card">
          <div className="pres-records-head">
            <div>
              <h3>Recent Finance Records</h3>
              <p>Latest manual income and expense entries used in calculations.</p>
            </div>
            <button
              type="button"
              className="pres-ghost-button pres-income-tone"
              onClick={() => navigate("/governance/finance/entries")}
            >
              Open Entry Page
            </button>
          </div>

          <div className="pres-records-table-wrap">
            <table className="pres-records-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {(dashboardData.recentRecords || []).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="pres-empty-cell">
                      No manual finance records yet.
                    </td>
                  </tr>
                ) : (
                  (dashboardData.recentRecords || []).map((record) => (
                    <tr key={record.id}>
                      <td>
                        <span className={`pres-record-type ${record.type === "INCOME" ? "income" : "expense"}`}>
                          {record.type}
                        </span>
                      </td>
                      <td>{record.title}</td>
                      <td>{record.category}</td>
                      <td>{formatCurrency(record.amount)}</td>
                      <td>{formatDate(record.transactionDate)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PresidentFinanceDashboard;