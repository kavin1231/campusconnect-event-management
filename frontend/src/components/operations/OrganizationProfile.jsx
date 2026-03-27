import { useEffect, useState } from "react";
import {
  PageContainer,
  Container,
  Section,
  PageHeader,
  Card,
  CardHeader,
  CardBody,
  Input,
  FormRow,
  Button,
} from "../ui";
import { operationsAPI } from "../../services/api";
import "./operations-theme.css";

const initialForm = {
  name: "",
  faculty: "",
  contactEmail: "",
  contactPhone: "",
  description: "",
  logoUrl: "",
  themePrimary: "#FF6B35",
  themeAccent: "#1E293B",
};

const OrganizationProfile = () => {
  const [organizations, setOrganizations] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const loadOrganizations = async () => {
    try {
      const data = await operationsAPI.listOrganizations();
      if (data.success) {
        setOrganizations(data.organizations || []);
      }
    } catch (error) {
      console.error("Failed to load organizations:", error);
    }
  };

  useEffect(() => {
    loadOrganizations();
  }, []);

  const handleCreate = async () => {
    setSaving(true);
    try {
      const data = await operationsAPI.createOrganization(form);
      if (data.success) {
        setForm(initialForm);
        loadOrganizations();
      }
    } catch (error) {
      console.error("Failed to create organization:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader title="Organization Profile & Branding" subtitle="Manage club/faculty identity and visual settings" icon="🎨" />
      <Container>
        <Section className="mb-8">
          <Card>
            <CardHeader title="Create Organization" subtitle="Operations-ready profile with brand tokens" icon="🏢" />
            <CardBody>
              <FormRow>
                <Input label="Organization Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input label="Faculty" value={form.faculty} onChange={(e) => setForm({ ...form, faculty: e.target.value })} />
              </FormRow>
              <FormRow>
                <Input label="Contact Email" type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
                <Input label="Contact Phone" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
              </FormRow>
              <FormRow>
                <Input label="Logo URL" value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} />
                <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </FormRow>
              <FormRow>
                <Input label="Theme Primary" value={form.themePrimary} onChange={(e) => setForm({ ...form, themePrimary: e.target.value })} />
                <Input label="Theme Accent" value={form.themeAccent} onChange={(e) => setForm({ ...form, themeAccent: e.target.value })} />
              </FormRow>
              <Button variant="primary" onClick={handleCreate} loading={saving}>
                Save Organization
              </Button>
            </CardBody>
          </Card>
        </Section>

        <Section>
          <Card>
            <CardHeader title="Registered Organizations" subtitle="Current operations scope" icon="📋" />
            <CardBody>
              <div className="ops-grid">
                {organizations.map((org) => (
                  <div key={org.id} className="p-4 rounded-xl border border-slate-200 bg-white">
                    <h3 className="font-bold text-slate-900">{org.name}</h3>
                    <p className="ops-card-muted">{org.faculty}</p>
                    <p className="ops-card-muted">{org.contactEmail}</p>
                  </div>
                ))}
                {organizations.length === 0 && <p className="ops-card-muted">No organizations yet.</p>}
              </div>
            </CardBody>
          </Card>
        </Section>
      </Container>
    </PageContainer>
  );
};

export default OrganizationProfile;
