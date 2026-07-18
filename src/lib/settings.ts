import { db } from "@/db";
import { siteSettings, type SiteSettings } from "@/db/schema";

/**
 * Fetch the single site-settings row, creating it with defaults on first
 * access so callers never have to handle a missing row.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  const existing = await db.query.siteSettings.findFirst();
  if (existing) return existing;

  const [created] = await db
    .insert(siteSettings)
    .values({ id: 1 })
    .onConflictDoNothing()
    .returning();

  if (created) return created;

  // Lost a create race — the row exists now.
  const settings = await db.query.siteSettings.findFirst();
  if (!settings) throw new Error("Failed to initialise site settings");
  return settings;
}
