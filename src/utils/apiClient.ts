import axios, { type AxiosInstance } from 'axios';
import { API_ORIGIN, API_V1 } from './apiBase';
import { getCsrfToken } from './apiAuth';

/** Shared axios instance for FoodApp API calls. Session is an httpOnly cookie. */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_V1,
  timeout: 30000,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = getCsrfToken();
  if (token) config.headers.set('X-CSRF-Token', token);
  return config;
});

export { apiClient, API_ORIGIN, API_V1 };
export default apiClient;
