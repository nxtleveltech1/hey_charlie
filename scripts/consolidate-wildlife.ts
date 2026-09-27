import { ARCHIVED_PACKAGE_SLUGS } from "../src/lib/archived-packages";
import { Client } from "pg";
import { writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { getPackageBySlug } from "../src/lib/content/packages";
import { WILDLIFE_EXPLORER_SLUG } from "../src/lib/wildlife-packages";

// Run with bun so the same local environment as the app is loaded.
// Default is a rollback preview; pass --apply to commit this targeted change.
const pkg = getPackageBySlug(WILDLIFE_EXPLORER_SLUG);
if (!pkg) throw new Error("Missing consolidated package content");
const client = new Client({ connectionString: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL });
await client.connect();
try {
  await client.query("BEGIN");
  const before = await client.query("SELECT * FROM packages WHERE slug = ANY($1::text[]) FOR UPDATE", [[...ARCHIVED_PACKAGE_SLUGS, pkg.slug]]);
  const history = await client.query("SELECT count(*)::int AS count FROM bookings WHERE package_id IN (SELECT id FROM packages WHERE slug = ANY($1::text[]))", [ARCHIVED_PACKAGE_SLUGS]);
  const backup = join(tmpdir(), `hey-charlie-wildlife-before-${Date.now()}.json`);
  await writeFile(backup, JSON.stringify(before.rows, null, 2));
  await client.query("UPDATE packages SET is_active = false, is_featured = false, updated_at = now() WHERE slug = ANY($1::text[])", [ARCHIVED_PACKAGE_SLUGS]);
  await client.query(`INSERT INTO packages
    (slug, name, tagline, description, duration, price_per_person, min_guests, max_guests, category, highlights, image_url, is_active, is_featured)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,true,true)
    ON CONFLICT (slug) DO NOTHING`, [pkg.slug, pkg.name, pkg.tagline, pkg.longDescription, pkg.durationLabel, pkg.price, pkg.minGuests, pkg.maxGuests, pkg.category, pkg.highlights, pkg.heroImage]);
  const after = await client.query("SELECT slug, name, price_per_person, is_active, is_featured FROM packages WHERE slug = ANY($1::text[]) ORDER BY slug", [[...ARCHIVED_PACKAGE_SLUGS, pkg.slug]]);
  const active = after.rows.filter((row) => row.is_active);
  if (active.length !== 1 || active[0].slug !== pkg.slug || Number(active[0].price_per_person) !== 1950) throw new Error("Unexpected consolidated package state; rolling back");
  const apply = process.argv.includes("--apply");
  await client.query(apply ? "COMMIT" : "ROLLBACK");
  console.log(JSON.stringify({ applied: apply, packages: after.rows, preservedBookings: history.rows[0].count, backup }, null, 2));
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  await client.end();
}
