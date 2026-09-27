import React, { useState } from 'react';
import { postReview, getPlanReviews } from '../../utils/reviewUtils';

const ReviewTest = () => {
  const [planId, setPlanId] = useState('68cf08f1b8362198943057ae');
  const [userId, setUserId] = useState('68cef39441b20279dfe09f4e');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('Amazing food! Highly recommended!');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmitReview = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const result = await postReview(planId, userId, rating, reviewText);
      setResult(result);
      console.log('Review posted:', result);
      alert('Review posted successfully!');
    } catch (error) {
      setError(error.message);
      console.error('Failed to post review:', error);
      alert('Failed to post review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchReviews = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const reviews = await getPlanReviews(planId);
      setResult(reviews);
      console.log('Reviews fetched:', reviews);
      alert(`Fetched ${reviews.reviews?.length || 0} reviews for plan ${planId}`);
    } catch (error) {
      setError(error.message);
      console.error('Failed to fetch reviews:', error);
      alert('Failed to fetch reviews. Please try again.');
    } finally {
      setLoading(false);
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
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#3b82f6' }}>
        Review Posting Test
      </h2>

      {/* Input Fields */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Plan ID:
          </label>
          <input
            type="text"
            value={planId}
            onChange={(e) => setPlanId(e.target.value)}
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

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            User ID:
          </label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
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

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Rating:
          </label>
          <select
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #334155',
              backgroundColor: '#0f172a',
              color: 'white',
              fontSize: '16px'
            }}
          >
            <option value={1}>1 Star</option>
            <option value={2}>2 Stars</option>
            <option value={3}>3 Stars</option>
            <option value={4}>4 Stars</option>
            <option value={5}>5 Stars</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Review Text:
          </label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={4}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #334155',
              backgroundColor: '#0f172a',
              color: 'white',
              fontSize: '16px',
              resize: 'vertical'
            }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={handleSubmitReview}
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Posting...' : 'Post Review'}
        </button>

        <button
          onClick={handleFetchReviews}
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Fetching...' : 'Fetch Reviews'}
        </button>
      </div>

      {/* Token Status */}
      <div style={{
        padding: '15px',
        backgroundColor: '#0f172a',
        borderRadius: '5px',
        marginBottom: '20px',
        border: '1px solid #334155'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#f59e0b' }}>Authentication Status:</h4>
        <p style={{ margin: 0, color: localStorage.getItem('token') ? '#10b981' : '#ef4444' }}>
          {localStorage.getItem('token') ? '✅ Token found' : '❌ No token found'}
        </p>
        {localStorage.getItem('token') && (
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
            Token: {localStorage.getItem('token').substring(0, 20)}...
          </p>
        )}
      </div>

      {/* Results */}
      {result && (
        <div style={{
          padding: '15px',
          backgroundColor: '#0f172a',
          borderRadius: '5px',
          marginBottom: '20px',
          border: '1px solid #10b981'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#10b981' }}>✅ Success Result:</h4>
          <pre style={{ 
            margin: 0, 
            color: '#cbd5e1', 
            fontSize: '12px',
            overflow: 'auto',
            maxHeight: '200px'
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {error && (
        <div style={{
          padding: '15px',
          backgroundColor: '#0f172a',
          borderRadius: '5px',
          marginBottom: '20px',
          border: '1px solid #ef4444'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#ef4444' }}>❌ Error:</h4>
          <p style={{ margin: 0, color: '#ef4444' }}>{error}</p>
        </div>
      )}

      {/* Instructions */}
      <div style={{
        padding: '20px',
        backgroundColor: '#0f172a',
        borderRadius: '10px',
        border: '1px solid #334155'
      }}>
        <h4 style={{ color: '#3b82f6', marginBottom: '15px' }}>Test Instructions:</h4>
        <ol style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
          <li><strong>Login first</strong> - Make sure you're logged in to get a valid token</li>
          <li><strong>Update Plan ID</strong> - Use a valid plan ID from your database</li>
          <li><strong>Update User ID</strong> - Use a valid user ID from your database</li>
          <li><strong>Click "Post Review"</strong> - Test the review submission</li>
          <li><strong>Click "Fetch Reviews"</strong> - Verify the review was saved</li>
        </ol>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '15px' }}>
          <strong>Note:</strong> Check the browser console for detailed logs and the network tab to see the API calls.
        </p>
      </div>
    </div>
  );
};

export default ReviewTest;
