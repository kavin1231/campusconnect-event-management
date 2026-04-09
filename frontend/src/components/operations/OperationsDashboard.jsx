import { useEffect, useState } from "react";
import {
  PageContainer,
  Container,
  Section,
  PageHeader,
  StatCard,
  Card,
  CardBody,
  CardHeader,
  Button,
} from "../ui";
import { operationsAPI } from "../../services/api";
import "./operations-theme.css";

const OperationsDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      setLoading(true);
      try {
        const data = await operationsAPI.getOverview();
        if (data.success) {
          setOverview(data.overview);
        }
      } catch (error) {
        console.error("Failed to load operations overview:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  return (
    <PageContainer>
      <PageHeader
        title="Operations Hub"
        subtitle="Organization operations, sponsorship pipeline and partner readiness"
        icon="🤝"
        action={<Button variant="primary">Create Organization</Button>}
      />

      <Container>
        <Section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon="🏢" label="Organizations" value={loading ? "..." : overview?.organizations || 0} color="indigo" />
            <StatCard icon="💼" label="Confirmed Revenue" value={loading ? "..." : `$${(overview?.confirmedRevenue || 0).toLocaleString()}`} color="green" />
            <StatCard icon="💰" label="Budget Variance" value={loading ? "..." : `$${(overview?.variance || 0).toLocaleString()}`} color="amber" />
            <StatCard icon="🍕" label="Allocated Stalls" value={loading ? "..." : overview?.allocatedStalls || 0} color="blue" />
          </div>
        </Section>

        <Section>
          <Card>
            <CardHeader title="Sponsorship Stage Snapshot" subtitle="Pipeline health at a glance" icon="📈" />
            <CardBody>
              <div className="ops-grid">
                {[
                  "LEAD",
                  "CONTACTED",
                  "PROPOSAL",
                  "NEGOTIATION",
                  "CONFIRMED",
                ].map((stage) => (
                  <div key={stage} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <div className={`ops-stage-chip ops-stage-${stage}`}>{stage}</div>
                    <div className="text-2xl font-bold text-slate-900 mt-3">
                      {loading ? "..." : overview?.stageCounts?.[stage] || 0}
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </Section>
      </Container>
    </PageContainer>
  );
};

export default OperationsDashboard;
