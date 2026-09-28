import { Client } from "pg";
import { writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { getPackageBySlug } from "../src/lib/content/packages";

const slugs = ["sundowner-cruise", "beach-hopper", "cape-wildlife-explorer"];
const client = new Client({ connectionString: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL });
await client.connect();
try {
  await client.query("BEGIN");
  const before = await client.query("SELECT * FROM packages WHERE slug = ANY($1::text[]) FOR UPDATE", [slugs]);
  if (before.rows.length !== slugs.length) throw new Error("Expected all three existing packages");
  const backup = join(tmpdir(), `hey-charlie-five-hour-cruises-${Date.now()}.json`);
  await writeFile(backup, JSON.stringify(before.rows, null, 2));
  for (const slug of slugs) {
    const pkg = getPackageBySlug(slug);
    if (!pkg || pkg.price !== 1750 || pkg.durationHours !== 5) throw new Error(`Unexpected catalogue values for ${slug}`);
    await client.query(`UPDATE packages SET name=$2, tagline=$3, description=$4,
      duration=$5, price_per_person=$6, updated_at=now() WHERE slug=$1`,
    [slug, pkg.name, pkg.tagline, pkg.longDescription, pkg.durationLabel, pkg.price]);
  }
  const after = await client.query("SELECT slug, name, duration, price_per_person, image_url FROM packages WHERE slug = ANY($1::text[]) ORDER BY slug", [slugs]);
  const apply = process.argv.includes("--apply");
  await client.query(apply ? "COMMIT" : "ROLLBACK");
  console.log(JSON.stringify({ applied: apply, backup, packages: after.rows }, null, 2));
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  await client.end();
}
