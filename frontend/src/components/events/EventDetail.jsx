import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import EventReactions from '../common/EventReactions';
import { dashboardAPI, eventsAPI, resolveImageUrl } from '../../services/api';
import VendorStallMap from './VendorStallMap';
import './EventDetail.css';

const EventDetail = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [registrationLoading, setRegistrationLoading] = useState(false);
    const [stalls, setStalls] = useState([]);
    const [stallsLoading, setStallsLoading] = useState(false);
    const [stallsError, setStallsError] = useState(null);

    const resolveMediaUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        const base = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
        return `${base}${url.startsWith('/') ? url : `/${url}`}`;
    };

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
            } catch (err) {
                console.error('Error parsing user data:', err);
            }
        }

        // Fetch event details
        const fetchEvent = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/events/${eventId}`);
                const data = await response.json();

                if (data.success) {
                    setEvent(data.data);
                } else {
                    setError(data.message || 'Failed to load event');
                }
            } catch (err) {
                console.error('Error fetching event:', err);
                setError('Failed to load event details');
            } finally {
                setLoading(false);
            }
        };

        const fetchStalls = async () => {
            setStallsLoading(true);
            setStallsError(null);

            const response = await eventsAPI.getEventStalls(eventId);
            if (response.success) {
                setStalls(response.stalls || []);
            } else {
                setStalls([]);
                setStallsError(response.message || 'Failed to load vendor allocations');
            }

            setStallsLoading(false);
        };

        fetchEvent();
        fetchStalls();
    }, [eventId]);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const handleRegister = async () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        setRegistrationLoading(true);
        try {
            const response = await dashboardAPI.registerEvent(eventId);
            if (response.success) {
                // Refresh event data
                const res = await fetch(`http://localhost:5000/api/events/${eventId}`);
                const data = await res.json();
                if (data.success) setEvent(data.data);
            }
        } catch (err) {
            console.error('Registration error:', err);
        } finally {
            setRegistrationLoading(false);
        }
    };

    const handleUnregister = async () => {
        if (!isLoggedIn) return;

        setRegistrationLoading(true);
        try {
            const response = await dashboardAPI.unregisterEvent(eventId);
            if (response.success) {
                // Refresh event data
                const res = await fetch(`http://localhost:5000/api/events/${eventId}`);
                const data = await res.json();
                if (data.success) setEvent(data.data);
            }
        } catch (err) {
            console.error('Unregistration error:', err);
        } finally {
            setRegistrationLoading(false);
        }
    };

    const isRegistered = event?.registrations?.some(r => r.studentId === user?.id);
    const resolvedEventImage = resolveMediaUrl(event?.image);

    if (loading) {
        return (
            <div className="event-detail-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading event details...</p>
                </div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="event-detail-container">
                <div className="error-state">
                    <h2>⚠️ Event Not Found</h2>
                    <p>{error || 'The event you are looking for does not exist.'}</p>
                    <button className="btn-back" onClick={() => navigate('/')}>
                        ← Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="event-detail-container">
            {/* Header with back button */}
            <div className="detail-header">
                <button className="btn-back" onClick={() => navigate('/')}>
                    ← Back to Events
                </button>
                <div className="header-status">
                    {event.isFeatured && <span className="badge-featured">⭐ Featured</span>}
                </div>
            </div>

            {/* Hero Section */}
            <div className="detail-hero-new">
                <div className="hero-background">
                    <img src={resolveImageUrl(event.image)} alt={event.title} className="hero-img" />
                    <div className="hero-gradient-overlay"></div>
                </div>
                
                <div className="hero-content-new">
                    <div className="hero-top">
                        <span className="category-pill">{event.category}</span>
                        {event.isFeatured && <span className="featured-pill">⭐ Featured Event</span>}
                    </div>
                    
                    <h1 className="event-main-title">{event.title}</h1>
                    
                    <div className="hero-info-grid">
                        <div className="info-pill">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="info-pill">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            <span>{formatTime(event.date)}</span>
                        </div>
                        <div className="info-pill">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            <span>{event.location}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reaction Bar - Outside Banner */}
            <div className="reactions-bar-section">
                <EventReactions 
                    eventId={parseInt(eventId)} 
                    isLoggedIn={isLoggedIn}
                    studentId={user?.id}
                    onlyShowReactions={true}
                />
            </div>

            {/* Main Content */}
            <div className="detail-content">
                <div className="detail-main">
                    {/* Description */}
                    <section className="detail-section glass">
                        <div className="section-header">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            <h2>About This Event</h2>
                        </div>
                        <p className="description-text">{event.description}</p>
                    </section>

                    {/* Highlights */}
                    <section className="detail-section glass">
                        <div className="section-header">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                            <h2>Event Highlights</h2>
                        </div>
                        <div className="highlights-grid">
                            <div className="highlight-item">
                                <div className="highlight-icon">🎟️</div>
                                <div>
                                    <h4>Free Entry</h4>
                                    <p>Open to all students with ID</p>
                                </div>
                            </div>
                            <div className="highlight-item">
                                <div className="highlight-icon">🍱</div>
                                <div>
                                    <h4>Refreshments</h4>
                                    <p>Complimentary snacks provided</p>
                                </div>
                            </div>
                            <div className="highlight-item">
                                <div className="highlight-icon">📜</div>
                                <div>
                                    <h4>Certificates</h4>
                                    <p>Participation certificates included</p>
                                </div>
                            </div>
                            <div className="highlight-item">
                                <div className="highlight-icon">🤝</div>
                                <div>
                                    <h4>Networking</h4>
                                    <p>Connect with industry experts</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Hosted By */}
                    <section className="detail-section glass">
                        <div className="section-header">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            <h2>Hosted By</h2>
                        </div>
                        <div className="organizer-box">
                            <div className="organizer-avatar">
                                {event.organizer?.charAt(0) || 'A'}
                            </div>
                            <div className="organizer-info">
                                <h3>{event.organizer || 'Campus Administrator'}</h3>
                                <p>{event.organizerType || 'Official University Club'}</p>
                            </div>
                        </div>
                    </section>

                    {/* Reactions & Comments Section */}
                    <section className="section">
                        <h2>Student Comments</h2>
                        <EventReactions 
                            eventId={parseInt(eventId)} 
                            isLoggedIn={isLoggedIn}
                            studentId={user?.id}
                            onlyShowComments={true}
                        />
                    </section>
                </div>

                {/* Sidebar */}
                <aside className="detail-sidebar">
                    {/* Ticket Card */}
                    <div className="ticket-card shadow-premium">
                        <div className="ticket-header">
                            <span className="ticket-label">ADMISSION</span>
                            <span className="ticket-price">FREE</span>
                        </div>
                        
                        <div className="ticket-body">
                            <div className="ticket-info">
                                <label>Date & Time</label>
                                <p>{formatDate(event.date)}</p>
                                <p className="ticket-time">{formatTime(event.date)}</p>
                            </div>
                            
                            <div className="ticket-info">
                                <label>Location</label>
                                <p>{event.location}</p>
                            </div>

                            <div className="ticket-divider"></div>
                            
                            <div className="ticket-stats">
                                <div className="stat">
                                    <span className="stat-value">{event.registeredCount || 0}</span>
                                    <span className="stat-label">Joined</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-value">{event.expectedAttendees || 500}</span>
                                    <span className="stat-label">Capacity</span>
                                </div>
                            </div>
                        </div>

                        <button 
                            className={`btn-registration-new ${isRegistered ? 'unregister' : 'register'}`}
                            onClick={isRegistered ? handleUnregister : handleRegister}
                            disabled={registrationLoading}
                        >
                            {registrationLoading 
                                ? <div className="btn-spinner"></div> 
                                : isLoggedIn 
                                    ? (isRegistered ? 'Cancel Registration' : 'Confirm Registration') 
                                    : 'Login to Register'}
                        </button>
                        
                        {isRegistered && <p className="registration-success">🎉 You're on the list!</p>}
                    </div>

                    {/* Share Section */}
                    <div className="sidebar-section">
                        <h3>Share with Friends</h3>
                        <div className="social-grid">
                            <button className="social-link fb" title="Facebook">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                            </button>
                            <button className="social-link tw" title="Twitter">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                            </button>
                            <button className="social-link wa" title="WhatsApp">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                            </button>
                            <button className="social-link cp" title="Copy Link">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                            </button>
                        </div>
                    </div>
                </aside>
            </div>

            <section className="section section-map-bottom">
                <VendorStallMap
                    stalls={stalls}
                    loading={stallsLoading}
                    error={stallsError}
                    isDarkMode={false}
                    title={`${event.title} Stall Allocation Map`}
                    subtitle={event.category || ''}
                />
            </section>
        </div>
        </>
    );
};

export default EventDetail;
