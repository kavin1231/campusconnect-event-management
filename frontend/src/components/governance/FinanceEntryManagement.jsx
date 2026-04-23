import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, ReceiptText, Trash2 } from "lucide-react";
import Sidebar from "../common/Sidebar";
import { FeedbackToast } from "../common/FeedbackUI";
import { governanceAPI } from "../../services/api";

const INCOME_CATEGORY_OPTIONS = [
  "Merchandise",
  "Ticket Sales",
  "Donations",
  "Other Income",
];

const EXPENSE_CATEGORY_OPTIONS = [
  "Band Cost",
  "Lighting & Sound",
  "Decorations",
  "Food / Catering",
  "Transport",
  "Security",
  "Other Expenses",
];

const EMPTY_INCOME_FORM = {
  title: "",
  category: "Merchandise",
  amount: "",
  transactionDate: "",
  notes: "",
};

const EMPTY_EXPENSE_FORM = {
  title: "",
  category: "Band Cost",
  amount: "",
  transactionDate: "",
  notes: "",
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const FinanceEntryManagement = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [incomeForm, setIncomeForm] = useState(EMPTY_INCOME_FORM);
  const [expenseForm, setExpenseForm] = useState(EMPTY_EXPENSE_FORM);
  const [incomeErrors, setIncomeErrors] = useState({});
  const [expenseErrors, setExpenseErrors] = useState({});
  const [savingIncome, setSavingIncome] = useState(false);
  const [savingExpense, setSavingExpense] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadRecords();
  }, [searchTerm, typeFilter]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const totals = useMemo(() => {
    const income = records
      .filter((record) => record.type === "INCOME")
      .reduce((sum, record) => sum + Number(record.amount || 0), 0);

    const expense = records
      .filter((record) => record.type === "EXPENSE")
      .reduce((sum, record) => sum + Number(record.amount || 0), 0);

    return {
      income,
      expense,
      net: income - expense,
    };
  }, [records]);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const response = await governanceAPI.listFinanceRecords({
        type: typeFilter,
        search: searchTerm,
      });

      if (response.success) {
        setRecords(response.records || []);
      } else {
        setRecords([]);
        setToast({ type: "error", message: response.message || "Failed to load records" });
      }
    } catch (error) {
      console.error("Load finance records error:", error);
      setRecords([]);
      setToast({ type: "error", message: "Failed to load records" });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (form) => {
    const errors = {};

    if (!form.title?.trim()) {
      errors.title = "Title is required";
    }

    if (!form.category?.trim()) {
      errors.category = "Category is required";
    }

    const amount = Number(form.amount);
    if (Number.isNaN(amount) || amount < 0) {
      errors.amount = "Amount must be a non-negative number";
    }

    if (!form.transactionDate) {
      errors.transactionDate = "Date is required";
    }

    return errors;
  };

  const submitRecord = async (type) => {
    const form = type === "INCOME" ? incomeForm : expenseForm;
    const setErrors = type === "INCOME" ? setIncomeErrors : setExpenseErrors;
    const setSaving = type === "INCOME" ? setSavingIncome : setSavingExpense;

    const errors = validateForm(form);
    setErrors(errors);
    if (Object.keys(errors).length > 0) {
      setToast({ type: "error", message: "Please fix form errors first" });
      return;
    }

    try {
      setSaving(true);
      const payload = {
        type,
        title: form.title,
        category: form.category,
        amount: Number(form.amount),
        transactionDate: form.transactionDate,
        notes: form.notes,
      };

      let response;
      if (editingRecord && editingRecord.type === type) {
        response = await governanceAPI.updateFinanceRecord(editingRecord.id, payload);
      } else {
        response = await governanceAPI.createFinanceRecord(payload);
      }

      if (response.success) {
        setToast({ type: "success", message: `${type === "INCOME" ? "Income" : "Expense"} record saved` });
        if (type === "INCOME") {
          setIncomeForm(EMPTY_INCOME_FORM);
          setIncomeErrors({});
        } else {
          setExpenseForm(EMPTY_EXPENSE_FORM);
          setExpenseErrors({});
        }
        setEditingRecord(null);
        await loadRecords();
      } else {
        setToast({ type: "error", message: response.message || "Failed to save record" });
      }
    } catch (error) {
      console.error("Save finance record error:", error);
      setToast({ type: "error", message: "Failed to save record" });
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (record) => {
    const target = {
      title: record.title || "",
      category: record.category || "",
      amount: record.amount !== undefined ? String(record.amount) : "",
      transactionDate: record.transactionDate
        ? new Date(record.transactionDate).toISOString().slice(0, 10)
        : "",
      notes: record.notes || "",
    };

    setEditingRecord(record);
    if (record.type === "INCOME") {
      setIncomeForm(target);
      setIncomeErrors({});
    } else {
      setExpenseForm(target);
      setExpenseErrors({});
    }
  };

  const handleDelete = async (record) => {
    const confirmed = window.confirm(`Delete ${record.type.toLowerCase()} record \"${record.title}\"?`);
    if (!confirmed) return;

    try {
      const response = await governanceAPI.deleteFinanceRecord(record.id);
      if (response.success) {
        setToast({ type: "success", message: "Record deleted successfully" });
        if (editingRecord?.id === record.id) {
          setEditingRecord(null);
        }
        await loadRecords();
      } else {
        setToast({ type: "error", message: response.message || "Failed to delete record" });
      }
    } catch (error) {
      console.error("Delete finance record error:", error);
      setToast({ type: "error", message: "Failed to delete record" });
    }
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg-darker)", color: "var(--text-main)" }}>
      <Sidebar isAdmin={true} />

      <div className="flex min-h-screen flex-1 flex-col">
        <FeedbackToast toast={toast} onClose={() => setToast(null)} />

        <div className="px-5 pt-8 pb-6 sm:px-8">
          <div
            className="rounded-3xl border p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
            style={{
              borderColor: "var(--border-color)",
              background: "linear-gradient(to right, rgba(2,132,199,0.12), var(--bg-card))",
            }}
          >
            <p className="mb-2 text-xs uppercase tracking-[0.18em]" style={{ color: "var(--primary-accent)" }}>
              Finance Management
            </p>
            <h1 className="text-3xl font-black md:text-4xl">Finance Entry Page</h1>
            <p className="mt-2 max-w-2xl" style={{ color: "var(--text-muted)" }}>
              Add and manage manual income and expense records used in the Finance Dashboard calculations.
            </p>
          </div>
        </div>

        <main className="mx-auto w-full max-w-[1320px] flex-1 px-5 pb-8 sm:px-8">
          <section className="mb-6 grid gap-4 md:grid-cols-3">
            <SummaryCard label="Manual Income" value={formatCurrency(totals.income)} tone="income" />
            <SummaryCard label="Manual Expenses" value={formatCurrency(totals.expense)} tone="expense" />
            <SummaryCard
              label={totals.net >= 0 ? "Manual Net" : "Manual Deficit"}
              value={formatCurrency(Math.abs(totals.net))}
              tone={totals.net >= 0 ? "profit" : "loss"}
            />
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <FinanceFormCard
              title="Add Income"
              subtitle="Merchandise, ticket sales, donations and other income"
              form={incomeForm}
              setForm={setIncomeForm}
              categories={INCOME_CATEGORY_OPTIONS}
              errors={incomeErrors}
              loading={savingIncome}
              submitLabel={editingRecord?.type === "INCOME" ? "Update Income" : "Save Income"}
              onSubmit={() => submitRecord("INCOME")}
            />

            <FinanceFormCard
              title="Add Expense"
              subtitle="Band, lighting, decorations, catering, transport and security costs"
              form={expenseForm}
              setForm={setExpenseForm}
              categories={EXPENSE_CATEGORY_OPTIONS}
              errors={expenseErrors}
              loading={savingExpense}
              submitLabel={editingRecord?.type === "EXPENSE" ? "Update Expense" : "Save Expense"}
              onSubmit={() => submitRecord("EXPENSE")}
            />
          </section>

          <section
            className="mt-6 rounded-3xl border p-5"
            style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-card)" }}
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold">Finance Records</h3>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  View, edit, and delete manual finance entries.
                </p>
              </div>
              <div className="flex gap-2">
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search title/category"
                  className="rounded-xl border px-3 py-2 text-sm"
                  style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-input)", color: "var(--text-main)" }}
                />
                <select
                  value={typeFilter}
                  onChange={(event) => setTypeFilter(event.target.value)}
                  className="rounded-xl border px-3 py-2 text-sm"
                  style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-input)", color: "var(--text-main)" }}
                >
                  <option value="ALL">All Types</option>
                  <option value="INCOME">Income</option>
                  <option value="EXPENSE">Expense</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "var(--text-muted)" }}>
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Type</th>
                    <th className="px-4 py-3 text-left font-semibold">Title</th>
                    <th className="px-4 py-3 text-left font-semibold">Category</th>
                    <th className="px-4 py-3 text-left font-semibold">Amount</th>
                    <th className="px-4 py-3 text-left font-semibold">Date</th>
                    <th className="px-4 py-3 text-left font-semibold">Notes</th>
                    <th className="px-4 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td className="px-4 py-5" colSpan={7} style={{ color: "var(--text-muted)" }}>
                        Loading records...
                      </td>
                    </tr>
                  ) : records.length === 0 ? (
                    <tr>
                      <td className="px-4 py-5" colSpan={7} style={{ color: "var(--text-muted)" }}>
                        No finance records yet.
                      </td>
                    </tr>
                  ) : (
                    records.map((record) => (
                      <tr key={record.id} className="border-t" style={{ borderColor: "var(--border-color)" }}>
                        <td className="px-4 py-3">
                          <span
                            className="inline-flex rounded-full border px-2 py-1 text-xs font-semibold"
                            style={{
                              borderColor:
                                record.type === "INCOME" ? "rgba(16,185,129,0.35)" : "rgba(239,68,68,0.35)",
                              color: record.type === "INCOME" ? "#34d399" : "#f87171",
                            }}
                          >
                            {record.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold">{record.title}</td>
                        <td className="px-4 py-3">{record.category}</td>
                        <td className="px-4 py-3">{formatCurrency(record.amount)}</td>
                        <td className="px-4 py-3">{formatDate(record.transactionDate)}</td>
                        <td className="px-4 py-3">{record.notes || "-"}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex gap-2">
                            <button
                              type="button"
                              onClick={() => startEdit(record)}
                              className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs"
                              style={{ borderColor: "rgba(255,255,255,0.2)", color: "var(--text-main)" }}
                            >
                              <Pencil size={13} /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(record)}
                              className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs"
                              style={{ borderColor: "rgba(239,68,68,0.35)", color: "#f87171" }}
                            >
                              <Trash2 size={13} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value, tone }) => {
  const tones = {
    income: "#0ea5e9",
    expense: "#f97316",
    profit: "#22c55e",
    loss: "#ef4444",
  };

  return (
    <div
      className="rounded-3xl border p-5 shadow-[0_18px_42px_rgba(0,0,0,0.12)]"
      style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-card)" }}
    >
      <div className="flex items-center gap-3">
        <div className="rounded-2xl p-2" style={{ backgroundColor: "rgba(255,255,255,0.05)", color: tones[tone] }}>
          <ReceiptText size={18} />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--text-muted)" }}>
          {label}
        </p>
      </div>
      <p className="mt-3 text-2xl font-black">{value}</p>
    </div>
  );
};

const FinanceFormCard = ({
  title,
  subtitle,
  form,
  setForm,
  categories,
  errors,
  loading,
  submitLabel,
  onSubmit,
}) => {
  return (
    <div
      className="rounded-3xl border p-5"
      style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-card)" }}
    >
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
        {subtitle}
      </p>

      <div className="mt-4 grid gap-3">
        <InputField
          label="Title / Source"
          value={form.title}
          onChange={(value) => setForm((prev) => ({ ...prev, title: value }))}
          error={errors.title}
          placeholder="Enter title"
        />

        <div>
          <label className="mb-1 block text-sm font-semibold">Category</label>
          <select
            value={form.category}
            onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
            className="w-full rounded-xl border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-input)", color: "var(--text-main)" }}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-xs text-red-300">{errors.category}</p>}
        </div>

        <InputField
          label="Amount"
          value={form.amount}
          onChange={(value) => setForm((prev) => ({ ...prev, amount: value }))}
          error={errors.amount}
          type="number"
          min="0"
          step="0.01"
          placeholder="0"
        />

        <InputField
          label="Date"
          value={form.transactionDate}
          onChange={(value) => setForm((prev) => ({ ...prev, transactionDate: value }))}
          error={errors.transactionDate}
          type="date"
        />

        <div>
          <label className="mb-1 block text-sm font-semibold">Description / Notes</label>
          <textarea
            rows={3}
            value={form.notes}
            onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
            className="w-full rounded-xl border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-input)", color: "var(--text-main)" }}
            placeholder="Optional details"
          />
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
          style={{ backgroundColor: "var(--primary-accent)" }}
        >
          <Plus size={15} /> {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange, error, ...props }) => (
  <div>
    <label className="mb-1 block text-sm font-semibold">{label}</label>
    <input
      {...props}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-xl border px-3 py-2 text-sm"
      style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-input)", color: "var(--text-main)" }}
    />
    {error && <p className="mt-1 text-xs text-red-300">{error}</p>}
  </div>
);

export default FinanceEntryManagement;
