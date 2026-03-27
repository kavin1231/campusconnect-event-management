import React, { useState, useEffect } from 'react';
import './StudyMaterials.css';
import { FileText, Link as LinkIcon, Video, Download, Calendar, User, AlertCircle } from 'lucide-react';

const StudyMaterials = () => {
    const [materials, setMaterials] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [activeTab, setActiveTab] = useState('materials'); // materials, sessions
    const [selectedSemester, setSelectedSemester] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [studentInfo, setStudentInfo] = useState(null);

    useEffect(() => {
        fetchStudentInfo();
        fetchData();
    }, []);

    const fetchStudentInfo = () => {
        const student = JSON.parse(localStorage.getItem('student'));
        if (student) {
            setStudentInfo(student);
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            const [materialsRes, sessionsRes] = await Promise.all([
                fetch('http://localhost:5000/api/study-support/materials', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                fetch('http://localhost:5000/api/study-support/sessions', {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            if (materialsRes.ok) {
                const data = await materialsRes.json();
                setMaterials(data.data || []);
            }

            if (sessionsRes.ok) {
                const data = await sessionsRes.json();
                setSessions(data.data || []);
            }

            setError(null);
        } catch (err) {
            console.error('Error fetching study materials:', err);
            setError('Failed to load study materials');
        } finally {
            setLoading(false);
        }
    };

    const getFilteredMaterials = () => {
        return materials.filter(material => {
            const semesterMatch = selectedSemester === 'all' || material.semester === selectedSemester;
            const typeMatch = selectedType === 'all' || material.materialType === selectedType;
            return semesterMatch && typeMatch;
        });
    };

    const getFilteredSessions = () => {
        return sessions.filter(session => {
            const semesterMatch = selectedSemester === 'all' || session.semester === selectedSemester;
            return semesterMatch;
        });
    };

    const getMaterialIcon = (type) => {
        switch (type) {
            case 'pdf':
                return <FileText className="material-icon" />;
            case 'link':
                return <LinkIcon className="material-icon" />;
            case 'video':
                return <Video className="material-icon" />;
            default:
                return <FileText className="material-icon" />;
        }
    };

    const getMaterialTypeLabel = (type) => {
        const labels = {
            pdf: 'PDF Document',
            link: 'External Link',
            video: 'Video',
            other: 'Other'
        };
        return labels[type] || type;
    };

    const handleDownloadOrOpen = (material) => {
        if (material.materialType === 'pdf') {
            window.open(material.contentUrl, '_blank');
        } else if (material.materialType === 'link') {
            window.open(material.contentUrl, '_blank');
        } else if (material.materialType === 'video') {
            window.open(material.contentUrl, '_blank');
        }
    };

    const uniqueSemesters = Array.from(new Set([
        ...materials.map(m => m.semester),
        ...sessions.map(s => s.semester)
    ])).sort();

    const filteredMaterials = getFilteredMaterials();
    const filteredSessions = getFilteredSessions();

    if (loading) {
        return (
            <div className="study-materials-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading study materials...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="study-materials-container">
            {/* Header */}
            <div className="materials-header">
                <div className="header-content">
                    <h1>📚 Study Support Center</h1>
                    <p>Access study materials, session notes, and resources for your semester</p>
                    {studentInfo && (
                        <div className="student-info-badge">
                            <span className="badge-label">Your Semester:</span>
                            <span className="badge-value">Year {studentInfo.year}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="materials-tabs">
                <button
                    className={`tab-button ${activeTab === 'materials' ? 'active' : ''}`}
                    onClick={() => setActiveTab('materials')}
                >
                    <FileText size={18} />
                    Study Materials
                </button>
                <button
                    className={`tab-button ${activeTab === 'sessions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('sessions')}
                >
                    <Calendar size={18} />
                    Study Sessions
                </button>
            </div>

            {/* Filters */}
            <div className="materials-filters">
                <div className="filter-group">
                    <label>Filter by Semester</label>
                    <select
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Semesters</option>
                        {uniqueSemesters.map(sem => (
                            <option key={sem} value={sem}>{sem}</option>
                        ))}
                    </select>
                </div>

                {activeTab === 'materials' && (
                    <div className="filter-group">
                        <label>Filter by Type</label>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Types</option>
                            <option value="pdf">PDF Documents</option>
                            <option value="link">External Links</option>
                            <option value="video">Videos</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                )}
            </div>

            {/* Content */}
            {error && (
                <div className="error-message">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            {activeTab === 'materials' ? (
                <div className="materials-section">
                    {filteredMaterials.length === 0 ? (
                        <div className="empty-state">
                            <FileText size={48} />
                            <h3>No Study Materials Available</h3>
                            <p>Check back later for new materials</p>
                        </div>
                    ) : (
                        <div className="materials-grid">
                            {filteredMaterials.map((material, index) => (
                                <div key={material.id} className="material-card" style={{ animationDelay: `${index * 0.05}s` }}>
                                    <div className="material-header">
                                        <div className="material-icon-wrapper">
                                            {getMaterialIcon(material.materialType)}
                                        </div>
                                        <div className="material-badge">
                                            {material.materialType.toUpperCase()}
                                        </div>
                                    </div>

                                    <div className="material-body">
                                        <h3 className="material-title">{material.title}</h3>
                                        <p className="material-description">{material.description}</p>

                                        <div className="material-meta">
                                            <span className="semester-tag">{material.semester}</span>
                                            <span className="type-label">{getMaterialTypeLabel(material.materialType)}</span>
                                        </div>

                                        <div className="material-creator">
                                            <User size={14} />
                                            <span>Added by {material.creator.name}</span>
                                        </div>
                                    </div>

                                    <div className="material-footer">
                                        <small>{new Date(material.uploadedAt).toLocaleDateString()}</small>
                                        <button
                                            className="btn-access"
                                            onClick={() => handleDownloadOrOpen(material)}
                                        >
                                            <Download size={16} />
                                            Access
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="sessions-section">
                    {filteredSessions.length === 0 ? (
                        <div className="empty-state">
                            <Calendar size={48} />
                            <h3>No Study Sessions Scheduled</h3>
                            <p>Check back for upcoming study sessions</p>
                        </div>
                    ) : (
                        <div className="sessions-list">
                            {filteredSessions.map((session, index) => (
                                <div key={session.id} className="session-card" style={{ animationDelay: `${index * 0.05}s` }}>
                                    <div className="session-header">
                                        <div className="session-date">
                                            <Calendar size={20} />
                                            <span>{new Date(session.sessionDate).toLocaleDateString()}</span>
                                        </div>
                                        <span className="semester-tag">{session.semester}</span>
                                    </div>

                                    <div className="session-body">
                                        <h3 className="session-title">{session.title}</h3>
                                        <p className="session-description">{session.description}</p>

                                        {session.sessionNotes && (
                                            <div className="session-notes">
                                                <strong>Notes:</strong>
                                                <p>{session.sessionNotes}</p>
                                            </div>
                                        )}

                                        <div className="session-creator">
                                            <User size={14} />
                                            <span>Hosted by {session.creator.name}</span>
                                        </div>
                                    </div>

                                    <div className="session-footer">
                                        {session.sessionLink && (
                                            <a
                                                href={session.sessionLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-join"
                                            >
                                                <LinkIcon size={16} />
                                                Join Session
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StudyMaterials;
