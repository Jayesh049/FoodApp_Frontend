export function isAdmin(user: { role?: string } | null | undefined): boolean {
  return Boolean(user && user.role === "admin");
}
