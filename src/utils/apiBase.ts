const DEFAULT_API_ORIGIN =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_ORIGIN) ||
  'http://localhost:3000';

export const API_ORIGIN = String(DEFAULT_API_ORIGIN).replace(/\/$/, '');

export const API_V1 = `${API_ORIGIN}/api/v1`;

/**
 * Build URL for an uploads-relative path like "uploads/foo.png".
 * In Vite dev, prefer same-origin `/uploads/...` (proxied) so Helmet CORP
 * cannot block images served from a different port than the SPA.
 * In production, use absolute API_ORIGIN unless the path is already absolute.
 */
export function mediaUrl(relativePath?: string | null): string {
  if (!relativePath) return '';
  const path = String(relativePath).replace(/\\/g, '/');
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const isDev =
    typeof import.meta !== 'undefined' && Boolean(import.meta.env?.DEV);
  if (isDev) return normalized;
  return `${API_ORIGIN}${normalized}`;
}

export default API_ORIGIN;
