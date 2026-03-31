/** Single source of truth for admin allowlist — keep in sync with deployment secrets/docs if needed */
export const ADMIN_EMAILS: readonly string[] = ["gambew@gmail.com"];

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return ADMIN_EMAILS.some((e) => e === normalized);
}
