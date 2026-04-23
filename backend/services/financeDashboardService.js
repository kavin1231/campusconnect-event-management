import prisma from "../prisma/client.js";

const CURRENCY = "LKR";

const INCOME_CATEGORY_MAP = {
  MERCHANDISE: "merchandise",
  "TICKET SALES": "ticketSales",
  DONATIONS: "donations",
  "OTHER INCOME": "otherIncome",
};

const INCOME_CATEGORY_LABELS = {
  merchandise: "Merchandise",
  ticketSales: "Ticket Sales",
  donations: "Donations",
  otherIncome: "Other Income",
};

const EXPENSE_CATEGORY_MAP = {
  "BAND COST": "bandCost",
  "LIGHTING & SOUND": "lightingSound",
  DECORATIONS: "decorations",
  "FOOD / CATERING": "foodCatering",
  TRANSPORT: "transport",
  SECURITY: "security",
  "OTHER EXPENSES": "otherExpenses",
};

const EXPENSE_CATEGORY_LABELS = {
  bandCost: "Band Cost",
  lightingSound: "Lighting & Sound",
  decorations: "Decorations",
  foodCatering: "Food / Catering",
  transport: "Transport",
  security: "Security",
  otherExpenses: "Other Expenses",
};

const INCOME_BREAKDOWN_TEMPLATE = [
  { key: "sponsorship", label: "Sponsorship", color: "#0ea5e9" },
  { key: "vendorFees", label: "Vendor Fees", color: "#22c55e" },
  { key: "merchandise", label: "Merchandise", color: "#14b8a6" },
  { key: "ticketSales", label: "Ticket Sales", color: "#3b82f6" },
  { key: "donations", label: "Donations", color: "#0d9488" },
  { key: "otherIncome", label: "Other Income", color: "#06b6d4" },
];

const INCOME_SOURCE_CONFIG = [
  {
    key: "sponsorship",
    label: "Sponsorship",
    color: "#0ea5e9",
    resolver: resolveSponsorshipIncome,
  },
  {
    key: "vendorFees",
    label: "Vendor Fees",
    color: "#22c55e",
    resolver: resolveVendorFeeIncome,
  },
];

const EXPENSE_BREAKDOWN_TEMPLATE = [
  { key: "bandCost", label: "Band Cost", color: "#ef4444" },
  { key: "lightingSound", label: "Lighting & Sound", color: "#f97316" },
  { key: "decorations", label: "Decorations", color: "#fb7185" },
  { key: "foodCatering", label: "Food / Catering", color: "#f59e0b" },
  { key: "transport", label: "Transport", color: "#eab308" },
  { key: "security", label: "Security", color: "#a855f7" },
  { key: "otherExpenses", label: "Other Expenses", color: "#f59e0b" },
];

function createHttpError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function toSafeNumber(value) {
  const numberValue = Number(value || 0);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function normalizeIncomeCategory(rawCategory) {
  const category = String(rawCategory || "").trim().toUpperCase();
  return INCOME_CATEGORY_MAP[category] || "otherIncome";
}

function normalizeExpenseCategory(rawCategory) {
  const category = String(rawCategory || "").trim().toUpperCase();
  return EXPENSE_CATEGORY_MAP[category] || "otherExpenses";
}

function normalizeRecordType(rawType) {
  const type = String(rawType || "").trim().toUpperCase();
  if (!["INCOME", "EXPENSE"].includes(type)) {
    throw createHttpError("type must be INCOME or EXPENSE", 400);
  }
  return type;
}

function normalizeCategory(type, category) {
  if (!category || !String(category).trim()) {
    throw createHttpError("category is required", 400);
  }

  return type === "INCOME"
    ? normalizeIncomeCategory(category)
    : normalizeExpenseCategory(category);
}

function buildTransactionDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw createHttpError("transactionDate must be a valid date", 400);
  }
  return date;
}

function validateAmount(value) {
  const amount = Number(value);
  if (Number.isNaN(amount) || amount < 0) {
    throw createHttpError("amount must be a non-negative number", 400);
  }
  return amount;
}

function normalizeRecordPayload(payload) {
  const type = normalizeRecordType(payload.type);
  const title = String(payload.title || "").trim();
  if (!title) {
    throw createHttpError("title is required", 400);
  }

  return {
    type,
    title,
    category: normalizeCategory(type, payload.category),
    amount: validateAmount(payload.amount),
    transactionDate: buildTransactionDate(payload.transactionDate),
    notes: payload.notes ? String(payload.notes).trim() : null,
  };
}

function formatRecordCategoryLabel(type, category) {
  if (type === "INCOME") {
    return INCOME_CATEGORY_LABELS[normalizeIncomeCategory(category)] || "Other Income";
  }

  return EXPENSE_CATEGORY_LABELS[normalizeExpenseCategory(category)] || "Other Expenses";
}

function mapFinanceRecord(record) {
  return {
    id: record.id,
    type: record.type,
    title: record.title,
    category: formatRecordCategoryLabel(record.type, record.category),
    amount: toSafeNumber(record.amount),
    transactionDate: record.transactionDate,
    notes: record.notes || "",
    createdById: record.createdById,
    createdByName: record.createdBy?.name || "",
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

async function resolveSponsorshipIncome({ eventId }) {
  const where = {
    ...(eventId ? { eventId } : {}),
    status: { not: "INACTIVE" },
  };

  const result = await prisma.sponsorshipLead.aggregate({
    where,
    _sum: { sponsorshipAmount: true },
    _count: { id: true },
  });

  return {
    amount: toSafeNumber(result._sum.sponsorshipAmount),
    meta: {
      sponsorshipCount: toSafeNumber(result._count.id),
    },
  };
}

async function resolveVendorFeeIncome({ eventId }) {
  if (eventId) {
    const reservedStalls = await prisma.eventStall.findMany({
      where: {
        eventId,
        status: "RESERVED",
        vendorId: { not: null },
      },
      select: {
        vendorId: true,
        vendor: {
          select: {
            vendorFee: true,
          },
        },
      },
    });

    const vendorFeeById = new Map();
    reservedStalls.forEach((stall) => {
      if (stall.vendorId === null || vendorFeeById.has(stall.vendorId)) return;
      vendorFeeById.set(stall.vendorId, toSafeNumber(stall.vendor?.vendorFee));
    });

    const vendorCount = vendorFeeById.size;
    const amount = Array.from(vendorFeeById.values()).reduce(
      (sum, fee) => sum + toSafeNumber(fee),
      0,
    );

    return {
      amount,
      meta: {
        vendorCount,
        strategy: "sum-vendor-fees-for-reserved-stalls-by-event",
      },
    };
  }

  const activeVendorFeeSummary = await prisma.vendorPartner.aggregate({
    where: { status: "ACTIVE" },
    _sum: { vendorFee: true },
    _count: { id: true },
  });

  return {
    amount: toSafeNumber(activeVendorFeeSummary._sum.vendorFee),
    meta: {
      vendorCount: toSafeNumber(activeVendorFeeSummary._count.id),
      strategy: "sum-vendor-fees-for-active-vendors",
    },
  };
}

async function getManualRecordsSummary() {
  const records = await prisma.financeRecord.findMany({
    orderBy: { transactionDate: "desc" },
  });

  const incomesByCategory = {
    merchandise: 0,
    ticketSales: 0,
    donations: 0,
    otherIncome: 0,
  };

  const expensesByCategory = {
    bandCost: 0,
    lightingSound: 0,
    decorations: 0,
    foodCatering: 0,
    transport: 0,
    security: 0,
    otherExpenses: 0,
  };

  records.forEach((record) => {
    const amount = toSafeNumber(record.amount);
    if (record.type === "INCOME") {
      const category = normalizeIncomeCategory(record.category);
      incomesByCategory[category] = toSafeNumber(incomesByCategory[category]) + amount;
      return;
    }

    const category = normalizeExpenseCategory(record.category);
    expensesByCategory[category] = toSafeNumber(expensesByCategory[category]) + amount;
  });

  return {
    incomesByCategory,
    expensesByCategory,
    recentRecords: records.slice(0, 10).map(mapFinanceRecord),
  };
}

export async function getFinanceDashboardData({ eventId = null } = {}) {
  const incomeSourceBreakdown = [];

  for (const source of INCOME_SOURCE_CONFIG) {
    const resolved = await source.resolver({ eventId });
    incomeSourceBreakdown.push({
      key: source.key,
      label: source.label,
      amount: toSafeNumber(resolved.amount),
      color: source.color,
      meta: resolved.meta || {},
    });
  }

  const {
    incomesByCategory,
    expensesByCategory,
    recentRecords,
  } = await getManualRecordsSummary();

  const sponsorshipIncome =
    incomeSourceBreakdown.find((item) => item.key === "sponsorship")?.amount || 0;
  const vendorFeeIncome =
    incomeSourceBreakdown.find((item) => item.key === "vendorFees")?.amount || 0;
  const manualIncomeTotal = Object.values(incomesByCategory).reduce(
    (sum, amount) => sum + toSafeNumber(amount),
    0,
  );

  const incomeByKey = {
    sponsorship: sponsorshipIncome,
    vendorFees: vendorFeeIncome,
    ...incomesByCategory,
  };

  const incomeBreakdown = INCOME_BREAKDOWN_TEMPLATE.map((entry) => ({
    ...entry,
    amount: toSafeNumber(incomeByKey[entry.key]),
  }));

  const totalIncome = incomeBreakdown.reduce(
    (sum, entry) => sum + toSafeNumber(entry.amount),
    0,
  );

  const expenseBreakdown = EXPENSE_BREAKDOWN_TEMPLATE.map((item) => ({
    ...item,
    amount: toSafeNumber(expensesByCategory[item.key]),
  }));

  const totalExpenses = expenseBreakdown.reduce(
    (sum, entry) => sum + toSafeNumber(entry.amount),
    0,
  );
  const netProfit = totalIncome - totalExpenses;

  return {
    summary: {
      currency: CURRENCY,
      totalIncome,
      sponsorshipIncome,
      vendorFeeIncome,
      manualIncome: manualIncomeTotal,
      totalExpenses,
      netProfit,
    },
    incomeBreakdown,
    expenseBreakdown,
    recentRecords,
    meta: {
      filters: {
        eventId,
      },
      generatedAt: new Date().toISOString(),
      architecture: {
        incomeSources: INCOME_SOURCE_CONFIG.map((source) => source.key),
        expenseSources: EXPENSE_BREAKDOWN_TEMPLATE.map((source) => source.key),
      },
    },
  };
}

export async function listFinanceRecords({ type, search }) {
  const where = {};

  if (type) {
    where.type = normalizeRecordType(type);
  }

  if (search && String(search).trim()) {
    const term = String(search).trim();
    where.OR = [
      { title: { contains: term, mode: "insensitive" } },
      { category: { contains: term, mode: "insensitive" } },
      { notes: { contains: term, mode: "insensitive" } },
    ];
  }

  const rows = await prisma.financeRecord.findMany({
    where,
    include: {
      createdBy: {
        select: { id: true, name: true },
      },
    },
    orderBy: [
      { transactionDate: "desc" },
      { createdAt: "desc" },
    ],
  });

  return rows.map(mapFinanceRecord);
}

export async function createFinanceRecord(payload, createdById) {
  if (!createdById) {
    throw createHttpError("createdById is required", 400);
  }

  const data = normalizeRecordPayload(payload);

  const record = await prisma.financeRecord.create({
    data: {
      ...data,
      createdById,
    },
    include: {
      createdBy: {
        select: { id: true, name: true },
      },
    },
  });

  return mapFinanceRecord(record);
}

export async function updateFinanceRecord(id, payload) {
  const numericId = Number(id);
  if (!numericId || Number.isNaN(numericId)) {
    throw createHttpError("Invalid finance record id", 400);
  }

  const existing = await prisma.financeRecord.findUnique({ where: { id: numericId } });
  if (!existing) {
    throw createHttpError("Finance record not found", 404);
  }

  const mergedPayload = {
    type: payload.type ?? existing.type,
    title: payload.title ?? existing.title,
    category: payload.category ?? existing.category,
    amount: payload.amount ?? existing.amount,
    transactionDate: payload.transactionDate ?? existing.transactionDate,
    notes: payload.notes ?? existing.notes,
  };

  const data = normalizeRecordPayload(mergedPayload);

  const record = await prisma.financeRecord.update({
    where: { id: numericId },
    data,
    include: {
      createdBy: {
        select: { id: true, name: true },
      },
    },
  });

  return mapFinanceRecord(record);
}

export async function deleteFinanceRecord(id) {
  const numericId = Number(id);
  if (!numericId || Number.isNaN(numericId)) {
    throw createHttpError("Invalid finance record id", 400);
  }

  const existing = await prisma.financeRecord.findUnique({ where: { id: numericId } });
  if (!existing) {
    throw createHttpError("Finance record not found", 404);
  }

  await prisma.financeRecord.delete({ where: { id: numericId } });
}
