import { useEffect, useState } from "react";
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
  StatusBadge,
} from "../ui";
import { operationsAPI } from "../../services/api";
import "./operations-theme.css";

const StallManagement = () => {
  const [stalls, setStalls] = useState([]);

  useEffect(() => {
    const loadStalls = async () => {
      try {
        const data = await operationsAPI.listStalls();
        if (data.success) {
          setStalls(data.stalls || []);
        }
      } catch (error) {
        console.error("Failed to load stalls:", error);
      }
    };

    loadStalls();
  }, []);

  return (
    <PageContainer>
      <PageHeader title="Stall Slot Allocation" subtitle="Assign event stalls to approved food vendors" icon="🛒" />
      <Container>
        <Section>
          <Card>
            <CardHeader title="Stall Map List" subtitle="No overlapping slot assignments for each vendor" icon="📍" />
            <CardBody>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Slot</TableHeader>
                    <TableHeader>Location</TableHeader>
                    <TableHeader>Event Date</TableHeader>
                    <TableHeader>Time</TableHeader>
                    <TableHeader>Vendor</TableHeader>
                    <TableHeader>Status</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stalls.map((stall) => (
                    <TableRow key={stall.id}>
                      <TableCell>{stall.slotCode}</TableCell>
                      <TableCell>{stall.location}</TableCell>
                      <TableCell>{new Date(stall.eventDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {new Date(stall.startTime).toLocaleTimeString()} - {new Date(stall.endTime).toLocaleTimeString()}
                      </TableCell>
                      <TableCell>{stall.vendor?.name || "Unassigned"}</TableCell>
                      <TableCell>
                        <StatusBadge
                          status={stall.vendor ? "approved" : "pending"}
                          label={stall.vendor ? "Allocated" : "Open"}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {stalls.length === 0 && <p className="ops-card-muted mt-3">No stall slots configured.</p>}
            </CardBody>
          </Card>
        </Section>
      </Container>
    </PageContainer>
  );
};

export default StallManagement;
