import React, { useState, useEffect } from 'react';
import { getPlanReviews, getAllReviews, submitReview, postReview } from '../../utils/reviewUtils';

// Demo component showing how to use review utilities with dynamic plan ID
const ReviewDemo = () => {
    const [planId, setPlanId] = useState('');
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to fetch reviews for a specific plan
    const fetchReviewsForPlan = async (planId) => {
        if (!planId.trim()) {
            alert('Please enter a plan ID');
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const data = await getPlanReviews(planId);
            setReviews(data.reviews || []);
            console.log(`Fetched ${data.reviews?.length || 0} reviews for plan ${planId}`);
        } catch (error) {
            setError('Failed to fetch reviews');
            setReviews([]);
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch all reviews
    const fetchAllReviews = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const data = await getAllReviews();
            setReviews(data.reviews || []);
            console.log(`Fetched ${data.reviews?.length || 0} total reviews`);
        } catch (error) {
            setError('Failed to fetch all reviews');
            setReviews([]);
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Example of submitting a review
    const submitSampleReview = async () => {
        const userId = '68cef39441b20279dfe09f4e'; // Replace with actual user ID
        const reviewPlanId = planId || '68cf08f1b8362198943057ae'; // Use entered plan ID or default
        const rating = 5;
        const reviewText = 'This is a sample review submitted via the demo component!';

        try {
            const result = await postReview(reviewPlanId, userId, rating, reviewText);
            console.log('Review submitted successfully:', result);
            alert('Sample review submitted successfully!');
            
            // Refresh reviews after submitting
            if (planId) {
                fetchReviewsForPlan(planId);
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review. Make sure you are logged in and have a valid token.');
        }
    };

    return (
        <div style={{ 
            padding: '20px', 
            maxWidth: '800px', 
            margin: '0 auto',
            backgroundColor: '#1e293b',
            color: 'white',
            borderRadius: '10px',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
                Review Utilities Demo
            </h2>

            {/* Plan ID Input */}
            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                    Enter Plan ID:
                </label>
                <input
                    type="text"
                    value={planId}
                    onChange={(e) => setPlanId(e.target.value)}
                    placeholder="e.g., 68cf08f1b8362198943057ae"
                    style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #334155',
                        backgroundColor: '#0f172a',
                        color: 'white',
                        fontSize: '16px'
                    }}
                />
            </div>

            {/* Action Buttons */}
            <div style={{ 
                display: 'flex', 
                gap: '10px', 
                marginBottom: '20px',
                flexWrap: 'wrap'
            }}>
                <button
                    onClick={() => fetchReviewsForPlan(planId)}
                    disabled={loading}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.6 : 1
                    }}
                >
                    {loading ? 'Loading...' : 'Get Plan Reviews'}
                </button>

                <button
                    onClick={fetchAllReviews}
                    disabled={loading}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.6 : 1
                    }}
                >
                    {loading ? 'Loading...' : 'Get All Reviews'}
                </button>

                <button
                    onClick={submitSampleReview}
                    disabled={loading}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.6 : 1
                    }}
                >
                    Submit Sample Review
                </button>
            </div>

            {/* Error Display */}
            {error && (
                <div style={{
                    backgroundColor: '#dc2626',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '5px',
                    marginBottom: '20px',
                    textAlign: 'center'
                }}>
                    {error}
                </div>
            )}

            {/* Reviews Display */}
            <div>
                <h3 style={{ marginBottom: '15px' }}>
                    Reviews ({reviews.length})
                </h3>
                
                {reviews.length === 0 && !loading ? (
                    <div style={{
                        textAlign: 'center',
                        color: '#94a3b8',
                        padding: '40px',
                        backgroundColor: '#0f172a',
                        borderRadius: '10px',
                        border: '1px solid #334155'
                    }}>
                        <p>No reviews found. Try fetching reviews for a plan!</p>
                    </div>
                ) : (
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {reviews.map((review, index) => (
                            <div key={review._id || index} style={{
                                backgroundColor: '#0f172a',
                                padding: '15px',
                                marginBottom: '10px',
                                borderRadius: '8px',
                                border: '1px solid #334155'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <div>
                                        <strong style={{ color: '#3b82f6' }}>
                                            {review.user?.name || 'Anonymous User'}
                                        </strong>
                                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                                            {new Date(review.createdAt || Date.now()).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div style={{ color: '#fbbf24' }}>
                                        {'★'.repeat(review.rating || 5)}
                                    </div>
                                </div>
                                <p style={{ color: '#cbd5e1', margin: 0, fontStyle: 'italic' }}>
                                    {review.description || 'No description provided.'}
                                </p>
                                {review.plan && (
                                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
                                        Plan ID: {review.plan}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Usage Instructions */}
            <div style={{
                marginTop: '30px',
                padding: '20px',
                backgroundColor: '#0f172a',
                borderRadius: '10px',
                border: '1px solid #334155'
            }}>
                <h4 style={{ color: '#3b82f6', marginBottom: '15px' }}>How to Use:</h4>
                <ol style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                    <li><strong>Enter a Plan ID</strong> in the input field above</li>
                    <li><strong>Click "Get Plan Reviews"</strong> to fetch reviews for that specific plan</li>
                    <li><strong>Click "Get All Reviews"</strong> to fetch all reviews from the system</li>
                    <li><strong>Click "Submit Sample Review"</strong> to test the review submission functionality</li>
                </ol>
                <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '15px' }}>
                    <strong>Note:</strong> Make sure your backend is running on localhost:3000 for this demo to work.
                </p>
            </div>
        </div>
    );
};

export default ReviewDemo;
