import axios from 'axios';
import Cookies from 'js-cookie';

axios.defaults.withCredentials = true;

let csrfToken = '';

export function setCsrfToken(token: string) {
  csrfToken = token || '';
}

export function getCsrfToken() {
  return csrfToken || Cookies.get('csrf') || '';
}

export type AuthHeaders = {
  'X-CSRF-Token'?: string;
};

export function getAuthHeaders(): AuthHeaders {
  const token = getCsrfToken();
  if (!token) return {};
  return { 'X-CSRF-Token': token };
}

axios.interceptors.request.use((config) => {
  config.withCredentials = true;
  const token = getCsrfToken();
  if (token) {
    config.headers = config.headers || {};
    if (!config.headers['X-CSRF-Token']) {
      config.headers['X-CSRF-Token'] = token;
    }
  }
  return config;
});
