import { useEffect, useMemo, useState } from "react";
import {
  PageContainer,
  Container,
  Section,
  PageHeader,
  Card,
  CardHeader,
  CardBody,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from "../ui";
import { operationsAPI } from "../../services/api";
import "./operations-theme.css";

const BudgetTracking = () => {
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    const loadBudgets = async () => {
      try {
        const data = await operationsAPI.listBudgets();
        if (data.success) {
          setBudgets(data.budgets || []);
        }
      } catch (error) {
        console.error("Failed to load budgets:", error);
      }
    };
    loadBudgets();
  }, []);

  const summary = useMemo(() => {
    return budgets.reduce(
      (acc, entry) => {
        acc.planned += entry.plannedAmount || 0;
        acc.actual += entry.actualAmount || 0;
        return acc;
      },
      { planned: 0, actual: 0 },
    );
  }, [budgets]);

  return (
    <PageContainer>
      <PageHeader title="Budget Tracking" subtitle="Planned vs actual organization spending" icon="💰" />
      <Container>
        <Section className="mb-6">
          <div className="ops-grid">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <p className="ops-card-muted">Total Planned</p>
              <p className="text-2xl font-bold text-slate-900">${summary.planned.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <p className="ops-card-muted">Total Actual</p>
              <p className="text-2xl font-bold text-slate-900">${summary.actual.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <p className="ops-card-muted">Variance</p>
              <p className="text-2xl font-bold text-slate-900">${(summary.planned - summary.actual).toLocaleString()}</p>
            </div>
          </div>
        </Section>

        <Section>
          <Card>
            <CardHeader title="Budget Line Items" subtitle="Track category-level financial execution" icon="📊" />
            <CardBody>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Organization</TableHeader>
                    <TableHeader>Category</TableHeader>
                    <TableHeader>Planned</TableHeader>
                    <TableHeader>Actual</TableHeader>
                    <TableHeader>Variance</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {budgets.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.organization?.name || "-"}</TableCell>
                      <TableCell>{entry.category}</TableCell>
                      <TableCell>${(entry.plannedAmount || 0).toLocaleString()}</TableCell>
                      <TableCell>${(entry.actualAmount || 0).toLocaleString()}</TableCell>
                      <TableCell>${((entry.plannedAmount || 0) - (entry.actualAmount || 0)).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {budgets.length === 0 && <p className="ops-card-muted mt-3">No budget entries found.</p>}
            </CardBody>
          </Card>
        </Section>
      </Container>
    </PageContainer>
  );
};

export default BudgetTracking;
