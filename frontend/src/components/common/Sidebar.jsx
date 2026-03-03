import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ activePage }) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <aside className="sd-sidebar">
            <div className="sd-side-header">
                <Link to="/" className="sd-logo">
                    <div className="sd-logo-icon">🚀</div>
                    <span>NEXORA</span>
                </Link>
            </div>
            <div className="sd-side-nav">
                <Link
                    to={user.role === 'SYSTEM_ADMIN' ? "/admin-dashboard" : "/dashboard"}
                    className={`sd-side-link ${activePage === 'dashboard' || activePage === 'admin-dashboard' ? 'sd-side-active' : ''}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                    <span>Dashboard</span>
                </Link>
                <Link to="/profile" className={`sd-side-link ${activePage === 'profile' ? 'sd-side-active' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    <span>My Profile</span>
                </Link>
            </div>
            <div className="sd-side-footer">
                <div className="sd-side-user">
                    <div className="sd-side-avatar">
                        {user.profileImage ? (
                            <img src={user.profileImage} alt={user.name} />
                        ) : (
                            user.name?.charAt(0).toUpperCase() || 'U'
                        )}
                    </div>
                    <div className="sd-side-user-info">
                        <span className="sd-side-user-name">{user.name}</span>
                        <span className="sd-side-user-role">{user.role}</span>
                    </div>
                </div>
                <button onClick={handleLogout} className="sd-side-logout-btn" title="Sign Out">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
