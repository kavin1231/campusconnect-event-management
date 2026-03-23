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

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const loadVendors = async () => {
      try {
        const data = await operationsAPI.listVendors();
        if (data.success) {
          setVendors(data.vendors || []);
        }
      } catch (error) {
        console.error("Failed to load vendors:", error);
      }
    };

    loadVendors();
  }, []);

  const toStatus = (status) => {
    if (status === "SIGNED") return "approved";
    if (status === "UNDER_REVIEW") return "pending";
    if (status === "EXPIRED") return "rejected";
    return "pending";
  };

  return (
    <PageContainer>
      <PageHeader title="Food Vendor Partners" subtitle="Vendor registration, requirements and agreement readiness" icon="🍕" />
      <Container>
        <Section>
          <Card>
            <CardHeader title="Vendor Registry" subtitle="Manage partner vendors for events and stalls" icon="🏪" />
            <CardBody>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Vendor</TableHeader>
                    <TableHeader>Organization</TableHeader>
                    <TableHeader>Contact</TableHeader>
                    <TableHeader>Requirements</TableHeader>
                    <TableHeader>Agreement</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell>{vendor.name}</TableCell>
                      <TableCell>{vendor.organization?.name || "-"}</TableCell>
                      <TableCell>{vendor.contactName}</TableCell>
                      <TableCell>
                        {vendor.requirements ? "Checklist Added" : "Pending Checklist"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={toStatus(vendor.agreementStatus)} label={vendor.agreementStatus} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {vendors.length === 0 && <p className="ops-card-muted mt-3">No vendor partners found.</p>}
            </CardBody>
          </Card>
        </Section>
      </Container>
    </PageContainer>
  );
};

export default VendorManagement;
