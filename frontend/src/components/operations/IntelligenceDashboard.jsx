import { useEffect, useMemo, useState } from "react";
import {
  PageContainer,
  Container,
  Section,
  PageHeader,
  Card,
  CardHeader,
  CardBody,
  StatCard,
} from "../ui";
import { operationsAPI } from "../../services/api";
import "./operations-theme.css";

const IntelligenceDashboard = () => {
  const [payload, setPayload] = useState({ budgetTrend: [], sponsorTrend: [], nextMonthRevenueForecast: 0 });

  useEffect(() => {
    const loadIntelligence = async () => {
      try {
        const data = await operationsAPI.getIntelligence();
        if (data.success) {
          setPayload(data.intelligence || { budgetTrend: [], sponsorTrend: [], nextMonthRevenueForecast: 0 });
        }
      } catch (error) {
        console.error("Failed to load intelligence data:", error);
      }
    };

    loadIntelligence();
  }, []);

  const latestBudget = useMemo(() => payload.budgetTrend[payload.budgetTrend.length - 1], [payload]);
  const latestSponsor = useMemo(() => payload.sponsorTrend[payload.sponsorTrend.length - 1], [payload]);

  return (
    <PageContainer>
      <PageHeader title="Organization Intelligence Dashboard" subtitle="Event success, sponsor and financial insight layer" icon="🧠" />
      <Container>
        <Section className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              icon="📈"
              label="Latest Confirmed Revenue"
              value={`$${(latestSponsor?.confirmedRevenue || 0).toLocaleString()}`}
              color="green"
            />
            <StatCard
              icon="💸"
              label="Latest Actual Spend"
              value={`$${(latestBudget?.actual || 0).toLocaleString()}`}
              color="amber"
            />
            <StatCard
              icon="🔮"
              label="Forecast Next Month"
              value={`$${(payload.nextMonthRevenueForecast || 0).toLocaleString()}`}
              color="indigo"
            />
          </div>
        </Section>

        <Section>
          <Card>
            <CardHeader title="Trend Readout" subtitle="Current lightweight forecasting baseline" icon="📊" />
            <CardBody>
              <div className="ops-grid">
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h3 className="font-bold text-slate-900 mb-2">Budget Trend</h3>
                  {payload.budgetTrend.map((item) => (
                    <p key={item.month} className="ops-card-muted">
                      {item.month}: planned ${item.planned.toLocaleString()} | actual ${item.actual.toLocaleString()}
                    </p>
                  ))}
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h3 className="font-bold text-slate-900 mb-2">Sponsor Trend</h3>
                  {payload.sponsorTrend.map((item) => (
                    <p key={item.month} className="ops-card-muted">
                      {item.month}: confirmed ${item.confirmedRevenue.toLocaleString()}
                    </p>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        </Section>
      </Container>
    </PageContainer>
  );
};

export default IntelligenceDashboard;
