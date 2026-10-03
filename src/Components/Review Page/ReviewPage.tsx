import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../Context/AuthProvider';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getAuthHeaders } from '../../utils/apiAuth';
import { API_V1, mediaUrl } from '../../utils/apiBase';
import { displayPlanName, planImagePlaceholder } from '../../utils/planDisplay';
import '../Styles/reviewPage.css';

const ReviewPage = () => {
  const [purchasedPlans, setPurchasedPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPlans, setLoadingPlans] = useState<boolean>(true);
  const [canReview, setCanReview] = useState<boolean>(false);
  const [eligibilityMessage, setEligibilityMessage] = useState<string>('');
  const [reviews, setReviews] = useState<any[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const locationPlans = (location.state as { plans?: any[] } | null)?.plans;

  const fetchPlanReviews = useCallback(async (planId) => {
    try {
      const response = await axios.get(`${API_V1}/review/plan/${planId}`);
      setReviews(response.data.reviews || []);
    } catch (error: any) {
      console.error('Error fetching plan reviews:', error);
      setReviews([]);
    }
  }, []);

  const checkCanReview = useCallback(async (planId) => {
    try {
      const response = await axios.get(`${API_V1}/review/can-review/${planId}`, {
        headers: getAuthHeaders(),
      });
      setCanReview(response.data.canReview);
      setEligibilityMessage(response.data.message || '');
      return response.data;
    } catch (error: any) {
      console.error('Error checking review eligibility:', error);
      setCanReview(false);
      setEligibilityMessage('Unable to verify review eligibility.');
      return null;
    }
  }, []);

  const handlePlanSelect = useCallback(async (plan) => {
    setSelectedPlan(plan);
    setReviewText('');
    setRating(5);
    await checkCanReview(plan._id);
    fetchPlanReviews(plan._id);
  }, [checkCanReview, fetchPlanReviews]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    let cancelled = false;

    async function loadPurchasedPlans() {
      setLoadingPlans(true);
      try {
        const response = await axios.get(`${API_V1}/review/my-purchases`, {
          headers: getAuthHeaders(),
        });
        if (cancelled) return;

        const plans = response.data.plans?.length
          ? response.data.plans
          : (locationPlans || []);
        setPurchasedPlans(plans);

        if (plans.length > 0) {
          const statePlans = locationPlans;
          const initial =
            statePlans?.length === 1
              ? plans.find((p: any) => p._id === statePlans[0]._id) || plans[0]
              : plans[0];
          setSelectedPlan(initial);
          const eligibility = await axios.get(`${API_V1}/review/can-review/${initial._id}`, {
            headers: getAuthHeaders(),
          });
          if (!cancelled) {
            setCanReview(eligibility.data.canReview);
            setEligibilityMessage(eligibility.data.message || '');
          }
          fetchPlanReviews(initial._id);
        }
      } catch (error: any) {
        console.error('Error fetching purchased plans:', error);
        const statePlans = locationPlans;
        if (!cancelled && statePlans?.length) {
          setPurchasedPlans(statePlans);
          const initial = statePlans[0];
          setSelectedPlan(initial);
          await checkCanReview(initial._id);
          fetchPlanReviews(initial._id);
        }
      } finally {
        if (!cancelled) setLoadingPlans(false);
      }
    }

    loadPurchasedPlans();
    return () => {
      cancelled = true;
    };
  }, [user, history, location.state, checkCanReview, fetchPlanReviews]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!selectedPlan) {
      alert('Please select a plan to review');
      return;
    }

    if (!canReview) {
      alert(eligibilityMessage || 'You cannot review this plan');
      return;
    }

    if (!reviewText.trim()) {
      alert('Please write a review');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${API_V1}/review/plan/${selectedPlan._id}`,
        {
          rating,
          description: reviewText.trim(),
        },
        { headers: getAuthHeaders() }
      );

      alert('Review submitted successfully!');
      setReviewText('');
      setRating(5);
      setCanReview(false);
      setEligibilityMessage('You have already reviewed this plan');
      fetchPlanReviews(selectedPlan._id);
    } catch (error: any) {
      console.error('Error submitting review:', error);
      alert(error.response?.data?.message || 'Error submitting review');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (
    starRating: number,
    interactive = false,
    onRatingChange?: ((value: number) => void) | null
  ) => (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star: any) => (
        <span
          key={star}
          className={`star ${star <= starRating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
          onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
        >
          ★
        </span>
      ))}
    </div>
  );

  const planImage = (plan) => {
    if (!plan?.image) return '';
    return mediaUrl(plan.image);
  };

  if (loadingPlans) {
    return (
      <div className="review-page">
        <div className="review-container">
          <p className="review-loading">Loading your purchases...</p>
        </div>
      </div>
    );
  }

  if (purchasedPlans.length === 0) {
    return (
      <div className="review-page">
        <div className="review-container">
          <h1>Rate & Review Your Experience</h1>
          <div className="review-empty-state">
            <p>You have no purchased plans to review yet.</p>
            <button className="back-btn" type="button" onClick={() => navigate('/allPlans')}>
              Browse Plans
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="review-page">
      <div className="review-container">
        <h1>Rate & Review Your Experience</h1>

        {purchasedPlans.length > 1 && (
          <div className="plan-picker-section">
            <h2>Select a plan to review</h2>
            <div className="plan-picker-grid">
              {purchasedPlans.map((plan: any) => (
                <button
                  key={plan._id}
                  type="button"
                  className={`plan-picker-card ${selectedPlan?._id === plan._id ? 'selected' : ''}`}
                  onClick={() => handlePlanSelect(plan)}
                >
                  {plan.image && (
                    <img
                      src={planImage(plan)}
                      alt={displayPlanName(plan)}
                      className="plan-picker-image"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = planImagePlaceholder(plan);
                      }}
                    />
                  )}
                  <span className="plan-picker-name">{displayPlanName(plan)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedPlan && (
          <div className="plan-info-section">
            <h2>Review for: {selectedPlan.name}</h2>
            <div className="plan-details">
              {selectedPlan.image && (
                <img
                  src={planImage(selectedPlan)}
                  alt={selectedPlan.name}
                  className="plan-image"
                />
              )}
              <div className="plan-info">
                <p><strong>Price:</strong> ₹{selectedPlan.price}</p>
                {selectedPlan.duration != null && (
                  <p><strong>Duration:</strong> {selectedPlan.duration} days</p>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedPlan && eligibilityMessage && (
          <p className={`eligibility-message ${canReview ? 'eligible' : 'ineligible'}`}>
            {eligibilityMessage}
          </p>
        )}

        {selectedPlan && (
          <div className="review-form-section">
            <form onSubmit={handleSubmitReview} className="review-form">
              <div className="rating-section">
                <label>Your Rating:</label>
                {renderStars(rating, canReview, canReview ? setRating : null)}
                <span className="rating-text">{rating} out of 5 stars</span>
              </div>

              <div className="review-text-section">
                <label htmlFor="reviewText">Your Review:</label>
                <textarea
                  id="reviewText"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder={`Share your experience with ${selectedPlan.name}...`}
                  rows={4}
                  required
                  disabled={!canReview}
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="submit-review-btn"
                  disabled={loading || !reviewText.trim() || !canReview}
                >
                  {loading ? 'Submitting...' : 'Submit Review'}
                </button>

                <button
                  type="button"
                  className="skip-btn"
                  onClick={() => navigate('/allPlans')}
                >
                  Skip Review
                </button>
              </div>
            </form>
          </div>
        )}

        {selectedPlan && (
          <div className="existing-reviews">
            <h3>Reviews for {selectedPlan.name}</h3>
            {reviews.length === 0 ? (
              <p>No reviews yet. Be the first to review!</p>
            ) : (
              <div className="reviews-list">
                {reviews.map((review: any) => (
                  <div key={review._id} className="review-item">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">
                          {review.user?.name ? review.user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <h4>{review.user?.name || 'Anonymous'}</h4>
                          <p>{new Date(review.createdAt || Date.now()).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="review-rating">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="review-text">{review.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="back-to-plans">
          <button className="back-btn" type="button" onClick={() => navigate('/allPlans')}>
            ← Back to Plans
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
