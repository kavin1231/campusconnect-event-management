import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalEvents: 0,
        pendingApprovals: 0,
        activeOrganizers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (!token || !userStr) {
            navigate('/login');
            return;
        }

        try {
            const u = JSON.parse(userStr);
            if (u.role !== 'SYSTEM_ADMIN') {
                navigate('/');
                return;
            }
            setUser(u);

            // Mock stats for now - in a real app, these would come from an API
            setStats({
                totalUsers: 1250,
                totalEvents: 45,
                pendingApprovals: 12,
                activeOrganizers: 28
            });
            setLoading(false);
        } catch (error) {
            console.error('Error parsing user data:', error);
            navigate('/login');
        }
    }, [navigate]);

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="admin-spinner"></div>
                <p>Loading Admin Portal...</p>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            <Sidebar activePage="admin-dashboard" />

            <div className="admin-content-wrapper">
                <nav className="admin-navbar">
                    <div className="admin-nav-left">
                        <h2 className="admin-page-title">System Administration</h2>
                    </div>
                </nav>

                <header className="admin-header">
                    <div className="admin-header-content">
                        <div className="admin-header-text">
                            <span className="admin-header-badge">MASTER CONTROL</span>
                            <h1>Welcome, {user?.name?.split(' ')[0]}! 🔐</h1>
                            <p>Manage the entire NEXORA ecosystem from here.</p>
                        </div>
                    </div>
                </header>

                <main className="admin-main">
                    <div className="admin-stats-grid">
                        <div className="admin-stat-card">
                            <div className="admin-stat-icon users">👥</div>
                            <div className="admin-stat-info">
                                <span className="admin-stat-value">{stats.totalUsers}</span>
                                <span className="admin-stat-label">Total Users</span>
                            </div>
                        </div>
                        <div className="admin-stat-card">
                            <div className="admin-stat-icon events">📅</div>
                            <div className="admin-stat-info">
                                <span className="admin-stat-value">{stats.totalEvents}</span>
                                <span className="admin-stat-label">Total Events</span>
                            </div>
                        </div>
                        <div className="admin-stat-card">
                            <div className="admin-stat-icon pending">⏳</div>
                            <div className="admin-stat-info">
                                <span className="admin-stat-value">{stats.pendingApprovals}</span>
                                <span className="admin-stat-label">Pending Approvals</span>
                            </div>
                        </div>
                        <div className="admin-stat-card">
                            <div className="admin-stat-icon organizers">🛡️</div>
                            <div className="admin-stat-info">
                                <span className="admin-stat-value">{stats.activeOrganizers}</span>
                                <span className="admin-stat-label">Active Organizers</span>
                            </div>
                        </div>
                    </div>

                    <section className="admin-section">
                        <div className="admin-section-header">
                            <h3>Quick Actions</h3>
                        </div>
                        <div className="admin-actions-grid">
                            <button className="admin-action-btn">
                                <span className="action-icon">➕</span>
                                <span className="action-text">Create Organizer</span>
                            </button>
                            <button className="admin-action-btn">
                                <span className="action-icon">🛡️</span>
                                <span className="action-text">Manage Roles</span>
                            </button>
                            <button className="admin-action-btn">
                                <span className="action-icon">📊</span>
                                <span className="action-text">System Reports</span>
                            </button>
                            <button className="admin-action-btn">
                                <span className="action-icon">⚙️</span>
                                <span className="action-text">Global Settings</span>
                            </button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
