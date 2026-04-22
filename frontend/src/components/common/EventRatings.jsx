import React, { useState, useEffect } from 'react';
import { Star, Trash2, Edit2, X } from 'lucide-react';
import { resolveImageUrl } from '../../services/api';
import './EventRatings.css';

const EventRatings = ({ eventId, isLoggedIn, studentId }) => {
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [ratingDistribution, setRatingDistribution] = useState({});
    const [studentReview, setStudentReview] = useState(null);
    const [showAddReview, setShowAddReview] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch reviews on component mount
    useEffect(() => {
        fetchReviews();
        if (isLoggedIn) {
            fetchStudentReview();
        }
    }, [eventId, isLoggedIn]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/events/${eventId}/reviews`);
            const data = await response.json();

            if (data.success) {
                setReviews(data.data.reviews);
                setAverageRating(data.data.averageRating);
                setTotalReviews(data.data.totalReviews);
                setRatingDistribution(data.data.ratingDistribution);
            }
        } catch (err) {
            setError('Failed to load reviews');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStudentReview = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/events/${eventId}/reviews/my-review`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success && data.data) {
                setStudentReview(data.data);
            }
        } catch (err) {
            console.error('Failed to load student review:', err);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete your review?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/events/reviews/${reviewId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success) {
                setStudentReview(null);
                fetchReviews();
            }
        } catch (err) {
            console.error('Failed to delete review:', err);
        }
    };

    if (loading) {
        return <div className="er-loading">Loading reviews...</div>;
    }

    return (
        <div className="event-ratings-container">
            {/* Rating Summary */}
            <div className="er-summary">
                <div className="er-average">
                    <div className="er-rating-large">
                        {averageRating > 0 ? averageRating : 'N/A'}
                    </div>
                    <div className="er-stars">
                        {renderStars(averageRating)}
                    </div>
                    <p className="er-review-count">
                        Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                    </p>
                </div>

                {/* Rating Distribution */}
                <div className="er-distribution">
                    {[5, 4, 3, 2, 1].map(star => (
                        <div key={star} className="er-dist-row">
                            <span className="er-dist-label">{star} ⭐</span>
                            <div className="er-dist-bar">
                                <div
                                    className="er-dist-fill"
                                    style={{
                                        width: totalReviews > 0 
                                            ? `${(ratingDistribution[star] / totalReviews) * 100}%` 
                                            : '0%'
                                    }}
                                />
                            </div>
                            <span className="er-dist-count">{ratingDistribution[star] || 0}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add/Edit Review Section */}
            {isLoggedIn ? (
                <div className="er-add-review-section">
                    {studentReview ? (
                        <div className="er-student-review-exists">
                            <p>✅ You've already reviewed this event</p>
                            <button
                                className="er-btn-edit"
                                onClick={() => setShowAddReview(!showAddReview)}
                            >
                                {showAddReview ? 'Cancel' : 'Edit Your Review'}
                            </button>
                            {showAddReview && (
                                <AddReviewForm
                                    eventId={eventId}
                                    existingReview={studentReview}
                                    onSuccess={() => {
                                        fetchReviews();
                                        fetchStudentReview();
                                        setShowAddReview(false);
                                    }}
                                    onCancel={() => setShowAddReview(false)}
                                />
                            )}
                        </div>
                    ) : (
                        <>
                            <button
                                className="er-btn-add-review"
                                onClick={() => setShowAddReview(!showAddReview)}
                            >
                                {showAddReview ? '✕ Cancel' : '⭐ Write a Review'}
                            </button>
                            {showAddReview && (
                                <AddReviewForm
                                    eventId={eventId}
                                    onSuccess={() => {
                                        fetchReviews();
                                        fetchStudentReview();
                                        setShowAddReview(false);
                                    }}
                                    onCancel={() => setShowAddReview(false)}
                                />
                            )}
                        </>
                    )}
                </div>
            ) : (
                <div className="er-login-prompt">
                    <p>🔐 Log in to write a review</p>
                </div>
            )}

            {/* Reviews List */}
            <div className="er-reviews-list">
                <h3 className="er-reviews-title">
                    Reviews ({totalReviews})
                </h3>

                {reviews.length > 0 ? (
                    reviews.map(review => (
                        <ReviewCard
                            key={review.id}
                            review={review}
                            isOwner={isLoggedIn && studentId === review.studentId}
                            onDelete={handleDeleteReview}
                            onEditSuccess={() => {
                                fetchReviews();
                                fetchStudentReview();
                            }}
                        />
                    ))
                ) : (
                    <div className="er-no-reviews">
                        <p>No reviews yet. Be the first to review!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Rating Stars Component
function renderStars(rating) {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars.push(
                <span key={i} className="er-star filled">★</span>
            );
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars.push(
                <span key={i} className="er-star half">★</span>
            );
        } else {
            stars.push(
                <span key={i} className="er-star empty">★</span>
            );
        }
    }

    return stars;
}

// Add Review Form Component
const AddReviewForm = ({ eventId, existingReview, onSuccess, onCancel }) => {
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState(existingReview?.review || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const url = existingReview
                ? `/api/events/reviews/${existingReview.id}`
                : `/api/events/${eventId}/reviews`;
            const method = existingReview ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ rating, review: review || null })
            });

            const data = await response.json();

            if (data.success) {
                onSuccess();
            } else {
                setError(data.message || 'Failed to save review');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="er-add-review-form" onSubmit={handleSubmit}>
            {error && <div className="er-error-message">{error}</div>}

            <div className="erf-rating-input">
                <label>Rating *</label>
                <div className="erf-stars">
                    {[1, 2, 3, 4, 5].map(star => (
                        <button
                            key={star}
                            type="button"
                            className={`erf-star-btn ${
                                (hoverRating || rating) >= star ? 'active' : ''
                            }`}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                        >
                            ★
                        </button>
                    ))}
                </div>
                <span className="erf-rating-value">
                    {rating > 0 && `${rating} / 5 stars`}
                </span>
            </div>

            <div className="erf-review-input">
                <label htmlFor="review-text">Review (optional)</label>
                <textarea
                    id="review-text"
                    placeholder="Share your experience with this event..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    maxLength={1000}
                    rows={4}
                />
                <span className="erf-char-count">
                    {review.length} / 1000 characters
                </span>
            </div>

            <div className="erf-buttons">
                <button
                    type="submit"
                    disabled={loading}
                    className="erf-btn-submit"
                >
                    {loading ? 'Saving...' : existingReview ? 'Update Review' : 'Submit Review'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="erf-btn-cancel"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

// Review Card Component
const ReviewCard = ({ review, isOwner, onDelete, onEditSuccess }) => {
    const [showEdit, setShowEdit] = useState(false);

    return (
        <div className="er-review-card">
            <div className="erc-header">
                <div className="erc-author">
                    {review.student.profileImage && (
                        <img
                            src={resolveImageUrl(review.student.profileImage)}
                            alt={review.student.name}
                            className="erc-avatar"
                        />
                    )}
                    <div className="erc-author-info">
                        <h4>{review.student.name}</h4>
                        <p className="erc-meta">
                            {review.student.year > 0 && `Year ${review.student.year} •`}
                            {' '}{review.student.department}
                        </p>
                    </div>
                </div>

                {isOwner && (
                    <div className="erc-actions">
                        <button
                            className="erc-action-btn edit"
                            title="Edit"
                            onClick={() => setShowEdit(!showEdit)}
                        >
                            <Edit2 size={16} />
                        </button>
                        <button
                            className="erc-action-btn delete"
                            title="Delete"
                            onClick={() => onDelete(review.id)}
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}
            </div>

            <div className="erc-rating">
                {renderStars(review.rating)}
                <span className="erc-rating-value">{review.rating}.0 / 5.0</span>
            </div>

            {review.review && (
                <p className="erc-text">{review.review}</p>
            )}

            <p className="erc-date">
                {new Date(review.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                })}
            </p>

            {showEdit && isOwner && (
                <AddReviewForm
                    eventId={review.eventId}
                    existingReview={review}
                    onSuccess={() => {
                        setShowEdit(false);
                        onEditSuccess();
                    }}
                    onCancel={() => setShowEdit(false)}
                />
            )}
        </div>
    );
};

export default EventRatings;
