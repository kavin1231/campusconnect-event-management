import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import EventReactions from '../common/EventReactions';
import { dashboardAPI } from '../../services/api';
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

        fetchEvent();
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
            <div className="detail-hero">
                <img src={event.image} alt={event.title} className="hero-image" />
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <div className="category-tag">{event.category}</div>
                    <h1 className="event-title">{event.title}</h1>
                    <div className="hero-meta">
                        <div className="meta-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="meta-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><polyline points="12 1 5 5 5 19 19 19 19 5 12 1"></polyline></svg>
                            <span>{formatTime(event.date)}</span>
                        </div>
                        <div className="meta-item">
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
                    <section className="section">
                        <h2>About This Event</h2>
                        <p className="description">{event.description}</p>
                    </section>

                    {/* Event Details Grid */}
                    <section className="section">
                        <h2>Event Details</h2>
                        <div className="details-grid">
                            <div className="detail-item">
                                <span className="detail-label">Organizer</span>
                                <span className="detail-value">{event.organizer || 'Organized by Administrator'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Participants</span>
                                <span className="detail-value">{event.registeredCount || 0} Joined</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Category</span>
                                <span className="detail-value">{event.category}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Venue</span>
                                <span className="detail-value">{event.location}</span>
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
                    {/* Event Card Summary */}
                    <div className="sidebar-card">
                        <h3>Quick Info</h3>
                        <div className="info-group">
                            <label>Date & Time</label>
                            <p>{formatDate(event.date)}</p>
                            <p className="time">{formatTime(event.date)}</p>
                        </div>
                        <div className="info-group">
                            <label>Location</label>
                            <p>{event.location}</p>
                        </div>
                        <div className="info-group">
                            <label>Status</label>
                            <p className="status-active">🟢 Upcoming</p>
                        </div>
                        <button 
                            className={`btn-register-sidebar ${isRegistered ? 'btn-joined' : ''}`}
                            onClick={isRegistered ? handleUnregister : handleRegister}
                            disabled={registrationLoading}
                        >
                            {registrationLoading 
                                ? '⌛ Processing...' 
                                : isLoggedIn 
                                    ? (isRegistered ? '✓ Joined (Cancel)' : '📝 Register Now') 
                                    : '🔐 Login to Register'}
                        </button>
                    </div>

                    {/* Share */}
                    <div className="sidebar-card">
                        <h3>Share Event</h3>
                        <div className="share-buttons">
                            <button className="share-btn" title="Share on Facebook">f</button>
                            <button className="share-btn" title="Share on Twitter">𝕏</button>
                            <button className="share-btn" title="Share on WhatsApp">💬</button>
                            <button className="share-btn" title="Copy Link">🔗</button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
        </>
    );
};

export default EventDetail;
