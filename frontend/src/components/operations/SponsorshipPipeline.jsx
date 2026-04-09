import { useEffect, useState } from "react";
import {
  PageContainer,
  Container,
  Section,
  PageHeader,
  Card,
  CardHeader,
  CardBody,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  SelectInput,
} from "../ui";
import { operationsAPI } from "../../services/api";
import "./operations-theme.css";

const STAGES = ["LEAD", "CONTACTED", "PROPOSAL", "NEGOTIATION", "CONFIRMED"];

const SponsorshipPipeline = () => {
  const [sponsorships, setSponsorships] = useState([]);
  const [stageFilter, setStageFilter] = useState("");

  const loadSponsorships = async () => {
    try {
      const data = await operationsAPI.listSponsorships(stageFilter || undefined);
      if (data.success) {
        setSponsorships(data.sponsorships || []);
      }
    } catch (error) {
      console.error("Failed to load sponsorships:", error);
    }
  };

  useEffect(() => {
    loadSponsorships();
  }, [stageFilter]);

  const promoteStage = async (sponsorship) => {
    const currentIdx = STAGES.indexOf(sponsorship.stage);
    if (currentIdx < 0 || currentIdx === STAGES.length - 1) {
      return;
    }

    const nextStage = STAGES[currentIdx + 1];
    try {
      const data = await operationsAPI.moveSponsorshipStage(sponsorship.id, nextStage);
      if (data.success) {
        loadSponsorships();
      }
    } catch (error) {
      console.error("Failed to move sponsorship stage:", error);
    }
  };

  return (
    <PageContainer>
      <PageHeader title="Sponsorship Pipeline" subtitle="Lead to confirmed sponsor lifecycle" icon="💼" />
      <Container>
        <Section>
          <Card>
            <CardHeader title="Pipeline Tracker" subtitle="Track progress and package outcomes" icon="🧭" />
            <CardBody>
              <div className="mb-4 max-w-[280px]">
                <SelectInput
                  label="Filter by stage"
                  value={stageFilter}
                  onChange={(e) => setStageFilter(e.target.value)}
                  options={[
                    { value: "", label: "All stages" },
                    ...STAGES.map((stage) => ({ value: stage, label: stage })),
                  ]}
                />
              </div>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Sponsor</TableHeader>
                    <TableHeader>Organization</TableHeader>
                    <TableHeader>Stage</TableHeader>
                    <TableHeader>Package</TableHeader>
                    <TableHeader>Expected</TableHeader>
                    <TableHeader>Action</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sponsorships.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.sponsorName}</TableCell>
                      <TableCell>{item.organization?.name || "-"}</TableCell>
                      <TableCell>
                        <span className={`ops-stage-chip ops-stage-${item.stage}`}>{item.stage}</span>
                      </TableCell>
                      <TableCell>{item.packageTier || "-"}</TableCell>
                      <TableCell>${(item.expectedValue || 0).toLocaleString()}</TableCell>
                      <TableCell>
                        <Button variant="secondary" size="sm" onClick={() => promoteStage(item)}>
                          Move Next
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {sponsorships.length === 0 && <p className="ops-card-muted mt-3">No sponsorship leads found.</p>}
            </CardBody>
          </Card>
        </Section>
      </Container>
    </PageContainer>
  );
};

export default SponsorshipPipeline;
