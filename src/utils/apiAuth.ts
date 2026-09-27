import Cookies from 'js-cookie';

export type AuthHeaders = {
  Authorization?: string;
};

export function getAuthHeaders(): AuthHeaders {
  const token = Cookies.get('jwt');
  if (!token) return {};
  const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  return { Authorization: authHeader };
}
