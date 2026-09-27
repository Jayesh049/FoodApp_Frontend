export type AuthUser = {
  role?: string;
  email?: string;
  [key: string]: unknown;
};

export function isAdmin(user: AuthUser | null | undefined): boolean {
  return Boolean(user && user.role === 'admin');
}
