import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PageContainer,
  PageHeader,
  Container,
  Section,
  StatCard,
  Card,
  CardBody,
  CardHeader,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  StatusBadge,
  Button,
  ButtonGroup,
} from "../ui";
import { governanceAPI } from "../../services/api";
import "./professional-theme.css";

const GovernanceDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    pendingClubApprovals: 0,
    pendingEventApprovals: 0,
    activeClubs: 0,
    totalEvents: 0,
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      navigate("/login");
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
      fetchEventApprovals();
    } catch (e) {
      navigate("/login");
    }
  }, [navigate]);

  const fetchEventApprovals = async () => {
    setLoading(true);
    try {
      const data = await governanceAPI.getEventApprovals();
      if (data.success) {
        // Update stats based on fetched data
        setStats({
          pendingClubApprovals:
            data.events?.filter((e) => e.status === "pending_club_approval")
              .length || 0,
          pendingEventApprovals:
            data.events?.filter((e) => e.status === "pending_approval")
              .length || 0,
          activeClubs: data.stats?.activeClubs || 0,
          totalEvents: data.events?.length || 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch event approvals:", error);
    }
    setLoading(false);
  };

  if (!user) return <div className="p-10">Loading...</div>;

  return (
    <PageContainer>
      {/* HEADER */}
      <PageHeader
        title="Governance Hub"
        subtitle="Manage approvals, roles & permissions"
        icon="⚙️"
        action={
          <Button variant="danger" onClick={() => navigate("/login")}>
            Logout
          </Button>
        }
      />

      {/* MAIN CONTENT */}
      <Container>
        {/* STATS GRID */}
        <Section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon="🏢"
              label="Pending Club Approvals"
              value={stats.pendingClubApprovals}
              color="blue"
              trend={10}
            />
            <StatCard
              icon="📅"
              label="Pending Event Approvals"
              value={stats.pendingEventApprovals}
              color="amber"
              trend={-5}
            />
            <StatCard
              icon="👥"
              label="Active Clubs"
              value={stats.activeClubs}
              color="green"
              trend={8}
            />
            <StatCard
              icon="🎉"
              label="Total Events"
              value={stats.totalEvents}
              color="indigo"
              trend={15}
            />
          </div>
        </Section>

        {/* TAB NAVIGATION */}
        <Section title="Dashboard">
          <div className="flex gap-2 border-b border-gray-200 mb-6">
            {["overview", "approvals", "permissions"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold transition-all ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "approvals" && <ApprovalsTab />}
          {activeTab === "permissions" && <PermissionsTab />}
        </Section>
      </Container>
    </PageContainer>
  );
};

// ============================================
// OVERVIEW TAB
// ============================================
const OverviewTab = () => {
  return (
    <div className="space-y-6">
      {/* QUICK ACTIONS */}
      <Card>
        <CardHeader
          title="Quick Actions"
          subtitle="Common management tasks"
          icon="⚡"
        />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ActionButton
              icon="🏢"
              title="Club Onboarding"
              desc="Review & approve clubs"
              href="/governance/club-onboarding"
            />
            <ActionButton
              icon="📅"
              title="Event Approvals"
              desc="Manage event submissions"
              href="/governance/event-approval"
            />
            <ActionButton
              icon="🔐"
              title="Role Management"
              desc="Configure permissions"
              href="/governance/roles"
            />
          </div>
        </CardBody>
      </Card>

      {/* RECENT ACTIVITIES */}
      <Card>
        <CardHeader
          title="Recent Activities"
          subtitle="Latest actions on the platform"
          icon="📋"
        />
        <CardBody className="divide-y divide-gray-200">
          <ActivityItem
            title="Arts Club approval completed"
            time="2 hours ago"
            status="success"
          />
          <ActivityItem
            title="Tech Summit event rejected"
            time="4 hours ago"
            status="danger"
          />
          <ActivityItem
            title="Photography Club pending review"
            time="6 hours ago"
            status="pending"
          />
          <ActivityItem
            title="Workshop event approved"
            time="1 day ago"
            status="success"
          />
          <ActivityItem
            title="Science Club onboarding submitted"
            time="1 day ago"
            status="pending"
          />
        </CardBody>
      </Card>
    </div>
  );
};

const ActionButton = ({ icon, title, desc, href }) => (
  <button
    onClick={() => (window.location.href = href)}
    className="p-6 bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 hover:border-blue-400 rounded-lg text-left transition group"
  >
    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition">
      {title}
    </h3>
    <p className="text-sm text-gray-600">{desc}</p>
  </button>
);

const ActivityItem = ({ title, time, status }) => {
  const statusConfig = {
    success: { badge: "✓", color: "bg-green-50 text-green-700" },
    danger: { badge: "✕", color: "bg-red-50 text-red-700" },
    pending: { badge: "⏳", color: "bg-amber-50 text-amber-700" },
  };

  const config = statusConfig[status];

  return (
    <div className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
      <div
        className={`px-3 py-1.5 rounded-lg text-sm font-medium ${config.color}`}
      >
        {config.badge}
      </div>
      <div className="flex-1">
        <p className="text-gray-900 font-medium">{title}</p>
        <p className="text-sm text-gray-500 mt-0.5">{time}</p>
      </div>
    </div>
  );
};

// ============================================
// APPROVALS TAB
// ============================================
const ApprovalsTab = () => {
  const [approvals] = useState([
    {
      id: 1,
      type: "Club",
      name: "Drama Club",
      status: "pending",
      submittedBy: "John Doe",
      date: "2024-03-20",
    },
    {
      id: 2,
      type: "Event",
      name: "Annual Fest 2024",
      status: "pending",
      submittedBy: "Art Club",
      date: "2024-03-19",
    },
    {
      id: 3,
      type: "Club",
      name: "Tech Club",
      status: "approved",
      submittedBy: "Admin",
      date: "2024-03-18",
    },
    {
      id: 4,
      type: "Event",
      name: "Hackathon",
      status: "approved",
      submittedBy: "Tech Club",
      date: "2024-03-17",
    },
    {
      id: 5,
      type: "Club",
      name: "Photography Club",
      status: "rejected",
      submittedBy: "Jane Smith",
      date: "2024-03-16",
    },
  ]);

  return (
    <Card>
      <CardHeader
        title="Pending & Managed Approvals"
        subtitle="All club and event submissions"
        icon="📋"
        action={<Button variant="primary">+ New Approval</Button>}
      />
      <CardBody className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Type</TableHeader>
                <TableHeader>Name</TableHeader>
                <TableHeader>Submitted By</TableHeader>
                <TableHeader>Date</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader align="right">Action</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {approvals.map((approval) => (
                <TableRow key={approval.id}>
                  <TableCell>
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                      {approval.type}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{approval.name}</TableCell>
                  <TableCell>{approval.submittedBy}</TableCell>
                  <TableCell className="text-gray-500">
                    {approval.date}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={approval.status} />
                  </TableCell>
                  <TableCell align="right">
                    <ButtonGroup>
                      <Button variant="secondary" size="sm">
                        View
                      </Button>
                      {approval.status === "pending" && (
                        <Button variant="primary" size="sm">
                          Review
                        </Button>
                      )}
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardBody>
    </Card>
  );
};

// ============================================
// PERMISSIONS TAB
// ============================================
const PermissionsTab = () => {
  const [roles] = useState([
    {
      id: 1,
      name: "President",
      permissions: ["approve_clubs", "approve_events", "manage_roles"],
      description: "Full administrative access",
    },
    {
      id: 2,
      name: "Treasurer",
      permissions: ["view_finance", "approve_budget"],
      description: "Financial management access",
    },
    {
      id: 3,
      name: "Event Manager",
      permissions: ["approve_events", "manage_venues"],
      description: "Event management access",
    },
  ]);

  return (
    <div className="space-y-6">
      {roles.map((role) => (
        <Card key={role.id}>
          <CardHeader
            title={role.name}
            subtitle={role.description}
            action={
              <Button variant="secondary" size="sm">
                Edit Permissions
              </Button>
            }
          />
          <CardBody>
            <div className="flex flex-wrap gap-2">
              {role.permissions.map((perm) => (
                <span
                  key={perm}
                  className="inline-block px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 text-sm rounded-lg font-medium"
                >
                  {perm.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default GovernanceDashboard;
