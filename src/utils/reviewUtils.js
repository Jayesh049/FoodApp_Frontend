import axios from 'axios';
import { getAuthHeaders } from './apiAuth';
import { API_V1 } from './apiBase';

export const getPlanReviews = async (planId) => {
  try {
    const response = await axios.get(`${API_V1}/review/plan/${planId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching plan reviews:', error);
    throw error;
  }
};

export const getAllReviews = async () => {
  try {
    const response = await axios.get(`${API_V1}/review`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    throw error;
  }
};

export const submitReview = async (planId, reviewData) => {
  try {
    const response = await axios.post(
      `${API_V1}/review/plan/${planId}`,
      reviewData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};

export const postReview = async (planId, _userId, rating, reviewText) => {
  try {
    const response = await axios.post(
      `${API_V1}/review/plan/${planId}`,
      {
        rating,
        description: reviewText,
      },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error posting review:', error);
    throw error;
  }
};

export const getUserReviews = async () => {
  try {
    const response = await axios.get(`${API_V1}/review`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    throw error;
  }
};
