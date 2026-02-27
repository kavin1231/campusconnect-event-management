import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import './Landing.css';

const events = [
    {
        id: 1,
        title: "AI & Robotics Workshop",
        date: { day: "24", month: "OCT" },
        category: "TECH",
        location: "Engineering Block, Hall A",
        registered: "124 Students Registered",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 2,
        title: "Intra-University Sprint Meet",
        date: { day: "28", month: "OCT" },
        category: "SPORTS",
        location: "Main Sports Complex",
        registered: "350+ Participants",
        image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 3,
        title: "Midnight Canvas: Live Painting",
        date: { day: "02", month: "NOV" },
        category: "ARTS",
        location: "Central Plaza Garden",
        registered: "42 Registered",
        image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 4,
        title: "Battle of the Bands: Auditions",
        date: { day: "05", month: "NOV" },
        category: "MUSIC",
        location: "Auditorium 2",
        registered: "15 Bands Registered",
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 5,
        title: "International Relations Mock UN",
        date: { day: "08", month: "NOV" },
        category: "DEBATE",
        location: "Humanities Seminar Room",
        registered: "88 Delegates",
        image: "https://images.unsplash.com/photo-1431576901776-e539bd916ba2?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 6,
        title: "24h Hackathon: Build for Campus",
        date: { day: "12", month: "NOV" },
        category: "TECH",
        location: "CS Innovation Lab",
        registered: "200+ Developers",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800"
    }
];

const Landing = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const userDataStr = localStorage.getItem('user');

        if (token && userDataStr) {
            try {
                const parsedUser = JSON.parse(userDataStr);
                if (parsedUser) {
                    setIsLoggedIn(true);
                    setUser(parsedUser);
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
                // Clear malformed data
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };

        if (showProfileMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showProfileMenu]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUser(null);
        setShowProfileMenu(false);
    };

    return (
        <div className="landing-container">
            <nav className="navbar">
                <div className="nav-left">
                    <div className="logo">
                        <div className="logo-icon">🚀</div>
                        <span>CampusConnect</span>
                    </div>
                    <div className="nav-links">
                        <a href="#explore" className="nav-link active">Explore</a>
                        <a href="#my-events" className="nav-link">My Events</a>
                        <a href="#logistics" className="nav-link">Logistics</a>
                        <a href="#clubs" className="nav-link">Clubs</a>
                    </div>
                </div>
                <div className="nav-right">
                    <div className="search-bar">
                        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input type="text" placeholder="Search events..." />
                    </div>
                    <button className="icon-btn" aria-label="Notifications">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                    </button>
                    <button className="icon-btn" aria-label="Calendar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    </button>

                    {isLoggedIn ? (
                        <div className="profile-container" ref={profileRef}>
                            <button
                                className="profile-btn"
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                aria-label="Profile"
                            >
                                <div className="profile-avatar">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            </button>

                            {showProfileMenu && (
                                <div className="profile-dropdown">
                                    <div className="profile-header">
                                        <div className="profile-avatar-large">
                                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div className="profile-info">
                                            <h4>{user?.name}</h4>
                                            <p>{user?.email}</p>
                                            <span className="user-role-badge">{user?.role}</span>
                                            {user?.studentId && <span className="student-id">{user.studentId}</span>}
                                        </div>
                                    </div>
                                    <div className="profile-menu-divider"></div>
                                    <div className="profile-menu-items">
                                        <Link to="/profile" className="profile-menu-item">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                            My Profile
                                        </Link>
                                        <Link to="/my-events" className="profile-menu-item">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                            My Events
                                        </Link>
                                        <Link to="/settings" className="profile-menu-item">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v6m0 6v6m5.2-15.8l-4.2 4.2m0 5.2l4.2 4.2M23 12h-6m-6 0H1m20.8-5.2l-4.2 4.2m0 5.2l4.2 4.2"></path></svg>
                                            Settings
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
                    ) : (
                        <Link to="/login" className="btn-login-nav">
                            Log In
                        </Link>
                    )}
                </div>
            </nav>

            <main className="main-content">
                <div className="filter-chips">
                    <button className="chip active">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                        All Events
                    </button>
                    <button className="chip">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
                        Sports
                    </button>
                    <button className="chip">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                        Tech
                    </button>
                    <button className="chip">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="2"></circle><line x1="12" y1="2" x2="12" y2="10"></line><line x1="12" y1="14" x2="12" y2="22"></line></svg>
                        Arts
                    </button>
                    <button className="chip">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
                        Music
                    </button>
                </div>

                <section className="hero-banner">
                    <div className="hero-overlay"></div>
                    <div className="hero-content">
                        <div className="hero-meta">
                            <span className="featured-tag">FEATURED EVENT</span>
                            <span className="hero-date">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                Nov 15 - 17, 2024
                            </span>
                        </div>
                        <h1 className="hero-title">Annual University <span className="highlight-accent">Fest<br />2024</span></h1>
                        <p className="hero-desc">
                            Experience the biggest cultural and technical extravaganza of the year. Join us for 3 days of non-stop excitement, guest stars, and innovation!
                        </p>
                        <div className="hero-actions">
                            <button className="btn-primary">
                                Register Now
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                            </button>
                            <button className="btn-secondary">Learn More</button>
                        </div>
                    </div>
                </section>

                <section className="events-section">
                    <div className="section-header">
                        <div className="section-title-wrap">
                            <h2>Upcoming Club Events</h2>
                            <p>Discover what's happening around campus</p>
                        </div>
                        <a href="#view-all" className="view-all">View All <span>&gt;</span></a>
                    </div>

                    <div className="events-grid">
                        {events.map(event => (
                            <div key={event.id} className="event-card">
                                <div className="card-image-wrap">
                                    <img src={event.image} alt={event.title} className="card-bg-img" />
                                    <div className="date-badge">
                                        <span className="day">{event.date.day}</span>
                                        <span className="month">{event.date.month}</span>
                                    </div>
                                    <div className="category-badge">{event.category}</div>
                                </div>
                                <div className="card-body">
                                    <h3 className="card-title">{event.title}</h3>
                                    <div className="card-meta">
                                        <div className="meta-item">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                            {event.location}
                                        </div>
                                        <div className="meta-item">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                            {event.registered}
                                        </div>
                                    </div>
                                    <Link to={`/login`} className="btn-register">Register</Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="load-more-container">
                        <button className="btn-load-more">Load More Events <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Landing;
