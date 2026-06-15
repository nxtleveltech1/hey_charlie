/** Admin allowlist — override via ADMIN_EMAILS env (comma-separated). */
const DEFAULT_ADMIN_EMAILS = ["gambew@gmail.com"];

function parseAdminEmails(): readonly string[] {
  const fromEnv = process.env.ADMIN_EMAILS?.trim();
  if (!fromEnv) return DEFAULT_ADMIN_EMAILS;
  return fromEnv
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export const ADMIN_EMAILS: readonly string[] = parseAdminEmails();

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return ADMIN_EMAILS.some((e) => e === normalized);
}
