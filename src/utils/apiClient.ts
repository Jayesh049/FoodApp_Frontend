import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { API_ORIGIN, API_V1 } from './apiBase';

/** Shared axios instance for FoodApp API calls. */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_V1,
  timeout: 30000,
  withCredentials: true,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = Cookies.get('jwt');
  if (token) {
    const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    config.headers.set('Authorization', authHeader);
  }
  return config;
});

export { apiClient, API_ORIGIN, API_V1 };
export default apiClient;
