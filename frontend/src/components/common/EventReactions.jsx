import React, { useState, useEffect } from 'react';
import { MessageCircle, Trash2, Pencil } from 'lucide-react';
import { resolveImageUrl } from '../../services/api';
import './EventReactions.css';

const EventReactions = ({ eventId, isLoggedIn, studentId, onlyShowReactions = false, onlyShowComments = false }) => {
    const [reactions, setReactions] = useState([]);
    const [reactionCounts, setReactionCounts] = useState({});
    const [totalReactions, setTotalReactions] = useState(0);
    const [studentReaction, setStudentReaction] = useState(null);
    const [showAddReaction, setShowAddReaction] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const REACTION_TYPES = [
        { type: 'LIKE', emoji: '👍', label: 'Like' },
        { type: 'LOVE', emoji: '❤️', label: 'Love' },
        { type: 'WOW', emoji: '😮', label: 'Wow' },
        { type: 'FUNNY', emoji: '😂', label: 'Funny' },
        { type: 'SAD', emoji: '😢', label: 'Sad' }
    ];

    // Fetch reactions on component mount
    useEffect(() => {
        fetchReactions();
        if (isLoggedIn) {
            fetchStudentReaction();
        }
    }, [eventId, isLoggedIn]);

    const fetchReactions = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/events/${eventId}/reviews`);
            const data = await response.json();

            if (data.success) {
                setReactions(data.data.reviews);
                setReactionCounts(data.data.reactionCounts);
                setTotalReactions(data.data.totalReactions);
            }
        } catch (err) {
            setError('Failed to load reactions');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStudentReaction = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/events/${eventId}/reviews/my-review`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success && data.data) {
                setStudentReaction(data.data);
            } else if (data.success && !data.data) {
                setStudentReaction(null);
            }
        } catch (err) {
            console.error('Failed to load student reaction:', err);
        }
    };

    const handleReactionClick = async (reactionType) => {
        if (!isLoggedIn) {
            window.location.href = '/login';
            return;
        }

        try {
            const token = localStorage.getItem('token');
            
            // Toggle off if same reaction is clicked
            const finalReaction = studentReaction?.reaction === reactionType ? null : reactionType;

            const response = await fetch(`http://localhost:5000/api/events/${eventId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    reaction: finalReaction,
                    comment: studentReaction?.comment || null
                })
            });

            const data = await response.json();

            if (data.success) {
                setStudentReaction(data.data);
                fetchReactions();
            }
        } catch (err) {
            console.error('Failed to add reaction:', err);
        }
    };

    const handleCommentSubmit = async (e, comment) => {
        e.preventDefault();
        if (!isLoggedIn) {
            window.location.href = '/login';
            return;
        }

        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`http://localhost:5000/api/events/${eventId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    reaction: studentReaction?.reaction || null,
                    comment: comment
                })
            });

            const data = await response.json();

            if (data.success) {
                setStudentReaction(data.data);
                fetchReactions();
                setShowAddReaction(false);
            }
        } catch (err) {
            console.error('Failed to add comment:', err);
        }
    };

    const handleDeleteComment = async (reaction) => {
        if (!window.confirm('Are you sure you want to delete your comment?')) return;

        try {
            const token = localStorage.getItem('token');
            
            if (reaction.reaction) {
                // If there's a reaction, we just clear the comment but keep the record
                const response = await fetch(`http://localhost:5000/api/events/${eventId}/reviews`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        reaction: reaction.reaction,
                        comment: null
                    })
                });
                const data = await response.json();
                if (data.success) {
                    fetchReactions();
                    fetchStudentReaction();
                }
            } else {
                // If no reaction, delete the whole review/comment record
                const response = await fetch(`http://localhost:5000/api/events/reviews/${reaction.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    fetchReactions();
                    fetchStudentReaction();
                }
            }
        } catch (err) {
            console.error('Failed to delete comment:', err);
        }
    };

    const renderReactionBubbles = () => {
        return REACTION_TYPES.map(({ type, emoji, label }) => (
            <button
                key={type}
                className={`er-reaction-bubble ${studentReaction?.reaction === type ? 'active' : ''}`}
                onClick={() => handleReactionClick(type)}
                title={label}
            >
                <span className="er-emoji">{emoji}</span>
                {reactionCounts[type] > 0 && (
                    <span className="er-count">{reactionCounts[type]}</span>
                )}
            </button>
        ));
    };

    if (loading) {
        return <div className="er-loading">Loading reactions...</div>;
    }

    return (
        <div className="event-reactions-container">
            {/* Reaction Bubbles - Hide when onlyShowComments is true */}
            {!onlyShowComments && (
                <div className="er-bubbles-section">
                    <div className="er-bubbles">
                        {renderReactionBubbles()}
                    </div>
                    <p className="er-total-count">
                        {totalReactions} {totalReactions === 1 ? 'reaction' : 'reactions'}
                    </p>
                </div>
            )}

            {/* Add Comment Section - Only show when not in reactions-only mode */}
            {!onlyShowReactions && isLoggedIn && !studentReaction?.comment && !showAddReaction && (
                <button
                    className="er-btn-add-comment"
                    onClick={() => setShowAddReaction(true)}
                >
                    <MessageCircle size={18} />
                    Add Comment
                </button>
            )}

            {/* Comment Input Form - Only show when not in reactions-only mode */}
            {!onlyShowReactions && showAddReaction && (
                <div className="er-comment-form">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const comment = e.target.comment.value;
                        handleCommentSubmit(e, comment);
                    }}>
                        <textarea
                            name="comment"
                            className="er-comment-input"
                            placeholder="Share your thoughts about this event..."
                            defaultValue={studentReaction?.comment || ''}
                            maxLength={1000}
                        />
                        <div className="er-form-actions">
                            <button type="submit" className="er-btn-submit">
                                Post Comment
                            </button>
                            <button
                                type="button"
                                className="er-btn-cancel"
                                onClick={() => setShowAddReaction(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Comments Section - Only show if there are comments AND not in reactions-only mode */}
            {!onlyShowReactions && reactions.some(r => r.comment) && (
                <div className="er-comments-section">
                    <h3 className="er-comments-title">Comments</h3>
                    <div className="er-comments-list">
                        {reactions.map((reaction) => (
                            reaction.comment && (
                                <div key={reaction.id} className="er-comment-card">
                                    <div className="erc-header">
                                        <div className="erc-author-info">
                                            <img
                                                src={resolveImageUrl(reaction.student.profileImage) || '/default-avatar.png'}
                                                alt={reaction.student.name}
                                                className="erc-avatar"
                                            />
                                            <div>
                                                <p className="erc-name">{reaction.student.name}</p>
                                                <p className="erc-meta">
                                                    {reaction.student.department} • Year {reaction.student.year}
                                                </p>
                                            </div>
                                        </div>
                                        {isLoggedIn && studentId === reaction.student.id && (
                                            <div className="erc-actions">
                                                <button 
                                                    className="erc-btn-edit"
                                                    onClick={() => setShowAddReaction(true)}
                                                    title="Edit comment"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button 
                                                    className="erc-btn-delete"
                                                    onClick={() => handleDeleteComment(reaction)}
                                                    title="Delete comment"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <p className="erc-comment-text">{reaction.comment}</p>

                                    <p className="erc-timestamp">
                                        {new Date(reaction.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            )}

            {!onlyShowReactions && !reactions.some(r => r.comment) && (
                <div className="er-empty-state">
                    <p>No comments yet. Be the first to share your thoughts!</p>
                </div>
            )}
        </div>
    );
};

export default EventReactions;
