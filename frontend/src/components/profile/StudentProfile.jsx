import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './StudentProfile.css';

const DEPARTMENTS = [
    'Computer Science',
    'Information Technology',
    'Electronics & Communication',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Biotechnology',
    'Mathematics',
    'Physics',
    'Business Administration',
    'Other',
];

const StudentProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const profileRef = useRef(null);

    // Form state
    const [formData, setFormData] = useState({ name: '', department: '', year: '' });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userDataStr = localStorage.getItem('user');

        if (!token || !userDataStr) {
            navigate('/login');
            return;
        }

        try {
            const parsedUser = JSON.parse(userDataStr);
            setUser(parsedUser);
        } catch {
            navigate('/login');
            return;
        }

        fetchProfile(token);
    }, [navigate]);

    const fetchProfile = async (token) => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/auth/profile', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setProfile(data.profile);
                setFormData({
                    name: data.profile.name,
                    department: data.profile.department || '',
                    year: data.profile.year || '',
                });
            } else {
                setErrorMsg(data.message || 'Failed to load profile');
            }
        } catch {
            setErrorMsg('Network error. Is the server running?');
        } finally {
            setLoading(false);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setShowProfileMenu(false);
            }
        };
        if (showProfileMenu) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showProfileMenu]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const handleEdit = () => {
        setEditing(true);
        setSuccessMsg('');
        setErrorMsg('');
    };

    const handleCancel = () => {
        setEditing(false);
        setFormData({
            name: profile.name,
            department: profile.department || '',
            year: profile.year || '',
        });
        setErrorMsg('');
    };

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');
        setSaving(true);

        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success) {
                setProfile(data.profile);
                // Update localStorage user name
                const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                storedUser.name = data.profile.name;
                localStorage.setItem('user', JSON.stringify(storedUser));
                setUser(storedUser);
                setEditing(false);
                setSuccessMsg('Profile updated successfully!');
                setTimeout(() => setSuccessMsg(''), 3000);
            } else {
                setErrorMsg(data.message || 'Failed to update profile');
            }
        } catch {
            setErrorMsg('Network error. Is the server running?');
        } finally {
            setSaving(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    const getYearLabel = (year) => {
        const labels = { 1: '1st Year', 2: '2nd Year', 3: '3rd Year', 4: '4th Year', 5: '5th Year' };
        return labels[year] || `Year ${year}`;
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="sp-page">
            {/* ── Navbar ── */}
            <nav className="navbar">
                <div className="nav-left">
                    <Link to="/" className="logo">
                        <div className="logo-icon">🚀</div>
                        <span>CampusConnect</span>
                    </Link>
                    <div className="nav-links">
                        <Link to="/" className="nav-link">Explore</Link>
                        <Link to="/dashboard" className="nav-link">My Events</Link>
                    </div>
                </div>
                <div className="nav-right">
                    <div className="profile-container" ref={profileRef}>
                        <button
                            className="profile-btn"
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                        >
                            <div className="profile-avatar">{getInitials(user?.name)}</div>
                        </button>
                        {showProfileMenu && (
                            <div className="profile-dropdown">
                                <div className="profile-header">
                                    <div className="profile-avatar-large">{getInitials(user?.name)}</div>
                                    <div className="profile-info">
                                        <h4>{user?.name}</h4>
                                        <p>{user?.email}</p>
                                        <span className="user-role-badge">{user?.role}</span>
                                    </div>
                                </div>
                                <div className="profile-menu-divider"></div>
                                <div className="profile-menu-items">
                                    <Link to="/profile" className="profile-menu-item active-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                        My Profile
                                    </Link>
                                    <Link to="/dashboard" className="profile-menu-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                        My Events
                                    </Link>
                                </div>
                                <div className="profile-menu-divider"></div>
                                <button onClick={handleLogout} className="profile-menu-item logout">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* ── Body ── */}
            <main className="sp-main">
                {/* Breadcrumb */}
                <div className="sp-breadcrumb">
                    <Link to="/">Home</Link>
                    <span className="sp-breadcrumb-sep">›</span>
                    <span>My Profile</span>
                </div>

                {loading ? (
                    <div className="sp-loading">
                        <div className="sp-spinner"></div>
                        <p>Loading your profile…</p>
                    </div>
                ) : (
                    <div className="sp-layout">
                        {/* ── Sidebar card ── */}
                        <aside className="sp-sidebar">
                            <div className="sp-avatar-wrap">
                                <div className="sp-avatar-circle">
                                    {getInitials(profile?.name)}
                                </div>
                                <div className="sp-avatar-ring"></div>
                            </div>

                            <h2 className="sp-sidebar-name">{profile?.name}</h2>
                            <p className="sp-sidebar-email">{profile?.email}</p>

                            <div className="sp-badge-row">
                                <span className="sp-badge sp-badge-role">STUDENT</span>
                                {profile?.year && (
                                    <span className="sp-badge sp-badge-year">
                                        {getYearLabel(profile.year)}
                                    </span>
                                )}
                            </div>

                            <div className="sp-sidebar-stats">
                                <div className="sp-stat">
                                    <span className="sp-stat-value">0</span>
                                    <span className="sp-stat-label">Events Joined</span>
                                </div>
                                <div className="sp-stat-divider"></div>
                                <div className="sp-stat">
                                    <span className="sp-stat-value">0</span>
                                    <span className="sp-stat-label">Upcoming</span>
                                </div>
                                <div className="sp-stat-divider"></div>
                                <div className="sp-stat">
                                    <span className="sp-stat-value">0</span>
                                    <span className="sp-stat-label">Completed</span>
                                </div>
                            </div>

                            {profile?.createdAt && (
                                <p className="sp-joined-date">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                    Joined {formatDate(profile.createdAt)}
                                </p>
                            )}
                        </aside>

                        {/* ── Main detail card ── */}
                        <section className="sp-detail-section">
                            {/* Alerts */}
                            {successMsg && (
                                <div className="sp-alert sp-alert-success">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                    {successMsg}
                                </div>
                            )}
                            {errorMsg && (
                                <div className="sp-alert sp-alert-error">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                    {errorMsg}
                                </div>
                            )}

                            {/* Profile Info Card */}
                            <div className="sp-card">
                                <div className="sp-card-header">
                                    <div className="sp-card-title-wrap">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                        <h3>Profile Information</h3>
                                    </div>
                                    {!editing && (
                                        <button className="sp-btn-edit" onClick={handleEdit}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                            Edit Profile
                                        </button>
                                    )}
                                </div>

                                {!editing ? (
                                    /* ── Read-only view ── */
                                    <div className="sp-info-grid">
                                        <div className="sp-info-item">
                                            <span className="sp-info-label">Full Name</span>
                                            <span className="sp-info-value">{profile?.name}</span>
                                        </div>
                                        <div className="sp-info-item">
                                            <span className="sp-info-label">Email Address</span>
                                            <span className="sp-info-value">{profile?.email}</span>
                                        </div>
                                        <div className="sp-info-item">
                                            <span className="sp-info-label">Student ID</span>
                                            <span className="sp-info-value sp-mono">{profile?.studentId}</span>
                                        </div>
                                        <div className="sp-info-item">
                                            <span className="sp-info-label">Department</span>
                                            <span className="sp-info-value">{profile?.department || '—'}</span>
                                        </div>
                                        <div className="sp-info-item">
                                            <span className="sp-info-label">Year of Study</span>
                                            <span className="sp-info-value">{profile?.year ? getYearLabel(profile.year) : '—'}</span>
                                        </div>
                                        <div className="sp-info-item">
                                            <span className="sp-info-label">Role</span>
                                            <span className="sp-info-value">
                                                <span className="sp-badge sp-badge-role">STUDENT</span>
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    /* ── Edit form ── */
                                    <form className="sp-edit-form" onSubmit={handleSave}>
                                        <div className="sp-form-row">
                                            <div className="sp-form-group">
                                                <label htmlFor="name">Full Name</label>
                                                <input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="Your full name"
                                                    required
                                                />
                                            </div>
                                            <div className="sp-form-group sp-readonly-group">
                                                <label>Email Address</label>
                                                <input
                                                    type="email"
                                                    value={profile?.email}
                                                    readOnly
                                                    className="sp-readonly-input"
                                                />
                                                <span className="sp-readonly-note">Email cannot be changed</span>
                                            </div>
                                        </div>

                                        <div className="sp-form-row">
                                            <div className="sp-form-group sp-readonly-group">
                                                <label>Student ID</label>
                                                <input
                                                    type="text"
                                                    value={profile?.studentId}
                                                    readOnly
                                                    className="sp-readonly-input sp-mono"
                                                />
                                                <span className="sp-readonly-note">Student ID cannot be changed</span>
                                            </div>
                                            <div className="sp-form-group">
                                                <label htmlFor="year">Year of Study</label>
                                                <select
                                                    id="year"
                                                    name="year"
                                                    value={formData.year}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="">Select year</option>
                                                    {[1, 2, 3, 4, 5].map((y) => (
                                                        <option key={y} value={y}>{getYearLabel(y)}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="sp-form-row">
                                            <div className="sp-form-group sp-form-group-full">
                                                <label htmlFor="department">Department</label>
                                                <select
                                                    id="department"
                                                    name="department"
                                                    value={formData.department}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="">Select department</option>
                                                    {DEPARTMENTS.map((d) => (
                                                        <option key={d} value={d}>{d}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="sp-form-actions">
                                            <button
                                                type="button"
                                                className="sp-btn-cancel"
                                                onClick={handleCancel}
                                                disabled={saving}
                                            >
                                                Cancel
                                            </button>
                                            <button type="submit" className="sp-btn-save" disabled={saving}>
                                                {saving ? (
                                                    <>
                                                        <div className="sp-btn-spinner"></div>
                                                        Saving…
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                                                        Save Changes
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>

                            {/* Account Security Card */}
                            <div className="sp-card sp-card-security">
                                <div className="sp-card-header">
                                    <div className="sp-card-title-wrap">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                        <h3>Account Security</h3>
                                    </div>
                                </div>
                                <div className="sp-security-row">
                                    <div className="sp-security-info">
                                        <span className="sp-security-label">Password</span>
                                        <span className="sp-security-sub">Last changed at registration</span>
                                    </div>
                                    <button className="sp-btn-secondary" disabled>
                                        Change Password
                                        <span className="sp-coming-soon">Coming Soon</span>
                                    </button>
                                </div>
                                <div className="sp-security-row">
                                    <div className="sp-security-info">
                                        <span className="sp-security-label">Two-Factor Authentication</span>
                                        <span className="sp-security-sub">Add an extra layer of security</span>
                                    </div>
                                    <button className="sp-btn-secondary" disabled>
                                        Enable 2FA
                                        <span className="sp-coming-soon">Coming Soon</span>
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>
                )}
            </main>
        </div>
    );
};

export default StudentProfile;
