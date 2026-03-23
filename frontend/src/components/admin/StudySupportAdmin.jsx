import React, { useState, useEffect } from 'react';
import './StudySupportAdmin.css';
import { Plus, Edit2, Trash2, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

const StudySupportAdmin = () => {
    const [activeTab, setActiveTab] = useState('materials'); // materials, sessions, dashboard
    const [materials, setMaterials] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [dashboard, setDashboard] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        semester: 'Y1S1',
        title: '',
        description: '',
        materialType: 'pdf',
        contentUrl: '',
        sessionDate: '',
        sessionLink: '',
        sessionNotes: ''
    });

    const SEMESTERS = ['Y1S1', 'Y1S2', 'Y2S1', 'Y2S2', 'Y3S1', 'Y3S2', 'Y4S1', 'Y4S2'];
    const MATERIAL_TYPES = ['pdf', 'link', 'video', 'other'];

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            if (activeTab === 'dashboard') {
                const res = await fetch('http://localhost:5000/api/study-support/admin/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setDashboard(data.data || {});
                }
            } else if (activeTab === 'materials') {
                const res = await fetch('http://localhost:5000/api/study-support/admin/materials', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setMaterials(data.data || []);
                }
            } else if (activeTab === 'sessions') {
                const res = await fetch('http://localhost:5000/api/study-support/admin/sessions', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setSessions(data.data || []);
                }
            }

            setError(null);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleAddNew = () => {
        setEditingId(null);
        setFormData({
            semester: 'Y1S1',
            title: '',
            description: '',
            materialType: 'pdf',
            contentUrl: '',
            sessionDate: '',
            sessionLink: '',
            sessionNotes: ''
        });
        setShowForm(true);
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setFormData({
            semester: item.semester,
            title: item.title,
            description: item.description || '',
            materialType: item.materialType || item.sessionDate ? 'session' : 'pdf',
            contentUrl: item.contentUrl || item.sessionLink || '',
            sessionDate: item.sessionDate ? new Date(item.sessionDate).toISOString().slice(0, 16) : '',
            sessionLink: item.sessionLink || '',
            sessionNotes: item.sessionNotes || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id, type) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            const endpoint = type === 'material'
                ? `/api/study-support/materials/${id}`
                : `/api/study-support/sessions/${id}`;

            const res = await fetch(`http://localhost:5000${endpoint}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (res.ok) {
                if (type === 'material') {
                    setMaterials(materials.filter(m => m.id !== id));
                } else {
                    setSessions(sessions.filter(s => s.id !== id));
                }
            }
        } catch (err) {
            console.error('Error deleting:', err);
            setError('Failed to delete item');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const isSession = activeTab === 'sessions';
            const endpoint = isSession
                ? editingId
                    ? `/api/study-support/sessions/${editingId}`
                    : '/api/study-support/sessions'
                : editingId
                    ? `/api/study-support/materials/${editingId}`
                    : '/api/study-support/materials';

            const payload = isSession
                ? {
                    semester: formData.semester,
                    title: formData.title,
                    description: formData.description,
                    sessionDate: formData.sessionDate,
                    sessionLink: formData.sessionLink,
                    sessionNotes: formData.sessionNotes
                }
                : {
                    semester: formData.semester,
                    title: formData.title,
                    description: formData.description,
                    materialType: formData.materialType,
                    contentUrl: formData.contentUrl
                };

            const res = await fetch(`http://localhost:5000${endpoint}`, {
                method: editingId ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const data = await res.json();
                if (isSession) {
                    if (editingId) {
                        setSessions(sessions.map(s => s.id === editingId ? data.data : s));
                    } else {
                        setSessions([data.data, ...sessions]);
                    }
                } else {
                    if (editingId) {
                        setMaterials(materials.map(m => m.id === editingId ? data.data : m));
                    } else {
                        setMaterials([data.data, ...materials]);
                    }
                }
                setShowForm(false);
            }
        } catch (err) {
            console.error('Error submitting form:', err);
            setError('Failed to save item');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) {
        return (
            <div className="admin-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading study support dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-container">
            {/* Header */}
            <div className="admin-header">
                <h1>📚 Study Support Management</h1>
                <p>Manage study materials, sessions, and resources for students</p>
            </div>

            {/* Tabs */}
            <div className="admin-tabs">
                <button
                    className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dashboard')}
                >
                    Dashboard
                </button>
                <button
                    className={`tab-btn ${activeTab === 'materials' ? 'active' : ''}`}
                    onClick={() => setActiveTab('materials')}
                >
                    Study Materials
                </button>
                <button
                    className={`tab-btn ${activeTab === 'sessions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('sessions')}
                >
                    Study Sessions
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="error-message">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
                <div className="dashboard-section">
                    <div className="stats-grid">
                        {SEMESTERS.map(sem => (
                            <div key={sem} className="stat-card">
                                <h3>{sem}</h3>
                                <div className="stat-content">
                                    <div className="stat-item">
                                        <span className="stat-label">Materials</span>
                                        <span className="stat-value">{dashboard[sem]?.materials || 0}</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Sessions</span>
                                        <span className="stat-value">{dashboard[sem]?.sessions || 0}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Materials Tab */}
            {activeTab === 'materials' && (
                <div className="materials-section">
                    <div className="section-header">
                        <h2>Study Materials</h2>
                        <button className="btn-primary" onClick={handleAddNew}>
                            <Plus size={18} />
                            Add Material
                        </button>
                    </div>

                    {materials.length === 0 ? (
                        <div className="empty-state">
                            <p>No study materials yet. Create one to get started!</p>
                        </div>
                    ) : (
                        <div className="materials-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Semester</th>
                                        <th>Type</th>
                                        <th>Created By</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {materials.map(material => (
                                        <tr key={material.id}>
                                            <td>
                                                <strong>{material.title}</strong>
                                                <small>{material.description}</small>
                                            </td>
                                            <td><span className="badge">{material.semester}</span></td>
                                            <td><span className="badge badge-type">{material.materialType}</span></td>
                                            <td>{material.creator.name}</td>
                                            <td>{new Date(material.uploadedAt).toLocaleDateString()}</td>
                                            <td>
                                                <div className="actions">
                                                    <button
                                                        className="btn-edit"
                                                        onClick={() => handleEdit(material)}
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        className="btn-delete"
                                                        onClick={() => handleDelete(material.id, 'material')}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Sessions Tab */}
            {activeTab === 'sessions' && (
                <div className="sessions-section">
                    <div className="section-header">
                        <h2>Study Sessions</h2>
                        <button className="btn-primary" onClick={handleAddNew}>
                            <Plus size={18} />
                            Add Session
                        </button>
                    </div>

                    {sessions.length === 0 ? (
                        <div className="empty-state">
                            <p>No study sessions yet. Schedule one to get started!</p>
                        </div>
                    ) : (
                        <div className="sessions-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Semester</th>
                                        <th>Date</th>
                                        <th>Has Link</th>
                                        <th>Created By</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sessions.map(session => (
                                        <tr key={session.id}>
                                            <td>
                                                <strong>{session.title}</strong>
                                                <small>{session.description}</small>
                                            </td>
                                            <td><span className="badge">{session.semester}</span></td>
                                            <td>{new Date(session.sessionDate).toLocaleDateString()}</td>
                                            <td>
                                                {session.sessionLink ? (
                                                    <Eye size={16} style={{ color: 'green' }} />
                                                ) : (
                                                    <EyeOff size={16} style={{ color: 'gray' }} />
                                                )}
                                            </td>
                                            <td>{session.creator.name}</td>
                                            <td>
                                                <div className="actions">
                                                    <button
                                                        className="btn-edit"
                                                        onClick={() => handleEdit(session)}
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        className="btn-delete"
                                                        onClick={() => handleDelete(session.id, 'session')}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <div className="form-modal" onClick={() => setShowForm(false)}>
                    <div className="form-content" onClick={e => e.stopPropagation()}>
                        <div className="form-header">
                            <h3>{editingId ? 'Edit' : 'Add'} {activeTab === 'sessions' ? 'Session' : 'Material'}</h3>
                            <button className="btn-close" onClick={() => setShowForm(false)}>×</button>
                        </div>

                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="form-group">
                                <label>Semester *</label>
                                <select
                                    name="semester"
                                    value={formData.semester}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {SEMESTERS.map(sem => (
                                        <option key={sem} value={sem}>{sem}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Enter title"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter description"
                                    rows="3"
                                />
                            </div>

                            {activeTab === 'materials' ? (
                                <>
                                    <div className="form-group">
                                        <label>Material Type *</label>
                                        <select
                                            name="materialType"
                                            value={formData.materialType}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            {MATERIAL_TYPES.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Content URL *</label>
                                        <input
                                            type="url"
                                            name="contentUrl"
                                            value={formData.contentUrl}
                                            onChange={handleInputChange}
                                            placeholder="https://example.com/material.pdf"
                                            required
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="form-group">
                                        <label>Session Date & Time *</label>
                                        <input
                                            type="datetime-local"
                                            name="sessionDate"
                                            value={formData.sessionDate}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Session Link (Zoom/Meet)</label>
                                        <input
                                            type="url"
                                            name="sessionLink"
                                            value={formData.sessionLink}
                                            onChange={handleInputChange}
                                            placeholder="https://zoom.us/..."
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Session Notes</label>
                                        <textarea
                                            name="sessionNotes"
                                            value={formData.sessionNotes}
                                            onChange={handleInputChange}
                                            placeholder="Additional notes for the session"
                                            rows="3"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="form-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-submit">
                                    <CheckCircle size={16} />
                                    {editingId ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudySupportAdmin;
