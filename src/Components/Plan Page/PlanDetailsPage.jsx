import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../Cart/CartProvider';
import { getPlanReviews } from '../../utils/reviewUtils';
import { API_V1, mediaUrl } from '../../utils/apiBase';
import { displayPlanName, planImagePlaceholder, planPricing } from '../../utils/planDisplay';
import { isVegetarianPlan } from '../../utils/vegFilter';
import '../Styles/planDetailsPage.css';

function PlanDetailsPage() {
  const { id } = useParams();
  const history = useHistory();
  const { addToCart } = useCart();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        const response = await axios.get(`${API_V1}/plan/${id}`);
        const next = response.data.plan;
        if (next && !isVegetarianPlan(next)) {
          setPlan(null);
          setLoading(false);
          return;
        }
        setPlan(next);
        setLoading(false);
        fetchPlanReviews(id);
      } catch (error) {
        console.error('Error fetching plan details:', error);
        setLoading(false);
      }
    };

    fetchPlanDetails();
  }, [id]);

  const fetchPlanReviews = async (planId) => {
    setReviewsLoading(true);
    try {
      const data = await getPlanReviews(planId);
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error fetching plan reviews:', error);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const nextImage = () => {
    if (plan && plan.images) {
      setCurrentImageIndex((prev) =>
        prev === plan.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (plan && plan.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? plan.images.length - 1 : prev - 1
      );
    }
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
    setIsZoomed(true);
  };

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 0.5));
    if (zoomLevel <= 1) {
      setIsZoomed(false);
    }
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setIsZoomed(false);
  };

  const handleImageClick = () => {
    if (isZoomed) {
      resetZoom();
    } else {
      zoomIn();
    }
  };

  if (loading) {
    return (
      <div className="plan-details-loading">
        <div className="loading-spinner" />
        <p className="p__opensans">Loading plan details...</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="plan-details-error">
        <h2 className="headtext__cormorant">Plan not available</h2>
        <p className="p__opensans" style={{ color: 'var(--color-grey)', marginBottom: '1rem' }}>
          We only show vegetarian meal plans. Pick another dish from the menu.
        </p>
        <button type="button" onClick={() => history.push('/allPlans')} className="back-button">
          ← Back to Plans
        </button>
      </div>
    );
  }

  const pricing = planPricing(plan);
  const imageSrc = plan.images
    ? plan.images[currentImageIndex]
    : plan.image;

  return (
    <div className="plan-details-page">
      <div className="plan-details-header">
        <button type="button" onClick={() => history.push('/allPlans')} className="back-button">
          ← Back to Plans
        </button>
        <h1 className="plan-title">{displayPlanName(plan)}</h1>
        <div className="plan-rating">
          <span className="rating-star">★</span>
          <span className="rating-value">{plan.ratingsAverage || 4.5}</span>
        </div>
      </div>

      <div className="plan-details-content">
        <div className="image-gallery-section">
          <div className="main-image-container">
            {plan.images && plan.images.length > 1 && (
              <button type="button" className="nav-button prev-button" onClick={prevImage}>
                ‹
              </button>
            )}

            <div className="main-image-wrapper" onClick={handleImageClick}>
              <img
                src={mediaUrl(imageSrc)}
                alt={displayPlanName(plan)}
                className="main-image"
                style={{
                  transform: `scale(${zoomLevel})`,
                  cursor: isZoomed ? 'zoom-out' : 'zoom-in',
                }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = planImagePlaceholder(plan);
                }}
              />
              {isZoomed && (
                <div className="zoom-indicator">Click to reset zoom</div>
              )}
            </div>

            {plan.images && plan.images.length > 1 && (
              <button type="button" className="nav-button next-button" onClick={nextImage}>
                ›
              </button>
            )}
          </div>

          {plan.images && plan.images.length > 1 && (
            <div className="thumbnail-container">
              {plan.images.map((image, index) => (
                <img
                  key={index}
                  src={mediaUrl(image)}
                  alt={`${displayPlanName(plan)} ${index + 1}`}
                  className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => goToImage(index)}
                />
              ))}
            </div>
          )}

          <div className="zoom-controls">
            <button type="button" className="zoom-btn" onClick={zoomOut} title="Zoom Out">
              −
            </button>
            <span className="zoom-level">{Math.round(zoomLevel * 100)}%</span>
            <button type="button" className="zoom-btn" onClick={zoomIn} title="Zoom In">
              +
            </button>
            <button type="button" className="reset-zoom-btn" onClick={resetZoom} title="Reset Zoom">
              ↺
            </button>
          </div>
        </div>

        <div className="plan-info-section">
          <div className="plan-basic-info">
            <h2 className="plan-name">{displayPlanName(plan)}</h2>
            <div className="plan-price-section">
              {(() => {
                const p = planPricing(plan);
                return (
                  <>
                    <span className="plan-price">₹{p.salePrice}</span>
                    {p.hasDeal && (
                      <span className="plan-price-original">₹{p.listPrice}</span>
                    )}
                    <span className="plan-duration">for {plan.duration || 30} days</span>
                  </>
                );
              })()}
            </div>
            <div className="plan-discount">
              {(() => {
                const p = planPricing(plan);
                return p.hasDeal ? `${p.percentOff}% OFF` : 'Vegetarian';
              })()}
            </div>
          </div>

          <div className="plan-description">
            <h3>Description</h3>
            <p>
              {plan.description ||
                `Indulge in our delicious ${displayPlanName(plan)} plan. This carefully crafted meal plan offers you ${plan.duration || 30} days of nutritious and tasty meals. Each dish is prepared with fresh ingredients and traditional cooking methods to ensure the best taste and quality.`}
            </p>
          </div>

          <div className="plan-features">
            <h3>What&apos;s Included</h3>
            <div className="features-grid">
              <div className="feature-item">
                <span className="feature-icon">🍽️</span>
                <span className="feature-text">{plan.duration || 30} meals included</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⭐</span>
                <span className="feature-text">High quality ingredients</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🚚</span>
                <span className="feature-text">Free delivery</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💯</span>
                <span className="feature-text">100% satisfaction guarantee</span>
              </div>
            </div>
          </div>

          <div className="plan-actions">
            <button
              type="button"
              className="add-to-cart-btn"
              onClick={() => {
                if (plan && plan._id) {
                  addToCart(plan);
                  alert(`Added "${displayPlanName(plan)}" to cart successfully!`);
                }
              }}
            >
              Add to Cart - ₹{pricing.salePrice}
            </button>
            <button
              type="button"
              className="book-now-btn custom__button"
              onClick={() => {
                if (plan && plan._id) {
                  addToCart(plan);
                  history.push('/booking1');
                }
              }}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      <div className="plan-details-reviews">
        <div className="reviews-section">
          <h3 className="reviews-title">Customer Reviews</h3>

          {reviewsLoading ? (
            <div className="reviews-loading">
              <div className="loading-spinner" />
              <p className="p__opensans">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="no-reviews">
              <div className="no-reviews-icon">💬</div>
              <h4>No reviews yet</h4>
              <p>Be the first to review this plan!</p>
            </div>
          ) : (
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review._id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">
                        {review.user?.name ? review.user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="reviewer-details">
                        <h4 className="reviewer-name">
                          {review.user?.name || 'Anonymous User'}
                        </h4>
                        <p className="review-date">
                          {new Date(review.createdAt || Date.now()).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="review-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`star ${star <= (review.rating || 5) ? 'filled' : ''}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="review-content">
                    <p className="review-text">{review.description || 'No description provided.'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default PlanDetailsPage;
