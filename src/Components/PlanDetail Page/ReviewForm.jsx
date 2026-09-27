import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useAuth } from '../Context/AuthProvider';
import { API_V1 } from '../../utils/apiBase';
import '../Styles/planDetail.css';

function ReviewForm({ planId, reviews = [], onReviewSubmitted }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submitReview = async (e) => {
    e.preventDefault();
    setError("");

    if (!user || !user._id) {
      alert('User is not logged in or user information is missing.');
      return;
    }

    if (!planId || typeof planId !== 'string' || planId.trim() === '') {
      setError('Invalid plan. Please refresh and try again.');
      return;
    }

    if (!rating || !review.trim()) {
      setError('Please add a rating and review text.');
      return;
    }

    const token = Cookies.get('jwt');
    const authHeader = token?.startsWith('Bearer ') ? token : `Bearer ${token}`;

    setSubmitting(true);
    try {
      const response = await axios.post(
        `${API_V1}/review/plan/${planId}`,
        {
          description: review.trim(),
          rating: rating,
        },
        {
          headers: token ? { Authorization: authHeader } : {},
        }
      );
      setReview("");
      setRating(0);
      if (onReviewSubmitted) {
        onReviewSubmitted(response.data);
      } else {
        alert('Review submitted successfully!');
        window.location.reload();
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Error submitting review. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = () => {
    return (
      <div className="star-rating-input">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star-input ${star <= (hoveredRating || rating) ? 'filled' : ''}`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
          >
            ★
          </span>
        ))}
        <span className="rating-text">
          {rating === 0 ? 'Click to rate' : 
           rating === 1 ? 'Poor' :
           rating === 2 ? 'Fair' :
           rating === 3 ? 'Good' :
           rating === 4 ? 'Very Good' : 'Excellent'}
        </span>
      </div>
    );
  };

  return (
    <div className='reviewBox'>
        <div className="reviewEnrty">
          <input 
            type="text" 
            value={review} 
            onChange={(e) => { setReview(e.target.value); setError(""); }} 
            placeholder="Write your review..."
          />
          <StarRating />
          {error && <p className="review-form-error">{error}</p>}
          <button className="btn" onClick={submitReview} disabled={rating === 0 || submitting}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
        {reviews && reviews.length > 0 ? (
          reviews.map((ele, key) => (
            <div className="reviewsCard" key={key}>
              <div className="pdreviews">
                <div className="pdrdetail">
                  <h3>{ele.user?.name || 'Anonymous'}</h3>
                  <div className="input">{ele.description}</div>
                </div>
                <div className='rate'>
                  <label htmlFor="star5" title="text">{ele.rating}</label>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to review this plan!</p>
          </div>
        )}
      </div>
  );
}

export default ReviewForm;
