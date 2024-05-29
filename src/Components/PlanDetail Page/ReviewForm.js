import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../Context/AuthProvider';

function ReviewForm({ planId }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const submitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('User is not logged in or user information is missing.');
      return;
    }

    try {
      const response = await axios.post('https://foodappbackend-lk5m.onrender.com/api/v1/review', {
        rating,
        comment,
        user: user._id,
        plan: planId
      });
      console.log('Review submitted:', response.data);
    } catch (error) {
      console.error('Error submitting review:', error.message);
    }
  };

  return (
    <form onSubmit={submitReview}>
      <div>
        <label>Rating:</label>
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          max="5"
          min="1"
        />
      </div>
      <div>
        <label>Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
      </div>
      <button type="submit">Submit Review</button>
    </form>
  );
}

export default ReviewForm;
