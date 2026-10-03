import axios from "axios";
import { getAuthHeaders } from "./apiAuth";
import { API_V1 } from "./apiBase";

export const getPlanReviews = async (planId: string) => {
  const response = await axios.get(`${API_V1}/review/plan/${planId}`);
  return response.data;
};

export const getAllReviews = async () => {
  const response = await axios.get(`${API_V1}/review`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const submitReview = async (
  planId: string,
  reviewData: { rating: number; description?: string; review?: string }
) => {
  const response = await axios.post(`${API_V1}/review/plan/${planId}`, reviewData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const postReview = async (
  planId: string,
  _userId: string | undefined,
  rating: number,
  reviewText: string
) => {
  const response = await axios.post(
    `${API_V1}/review/plan/${planId}`,
    {
      rating,
      description: reviewText,
    },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const getUserReviews = async () => {
  const response = await axios.get(`${API_V1}/review`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
