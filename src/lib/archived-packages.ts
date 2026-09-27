import { ARCHIVED_WILDLIFE_SLUGS } from "./wildlife-packages";

export const ARCHIVED_PACKAGE_SLUGS = [
  ...ARCHIVED_WILDLIFE_SLUGS,
  "deep-sea-fishing",
  "fishing-charter",
  "seafood-beach-feast",
  "seafood-feast",
  "coastline-crawler",
  "shipwreck-tour",
];

export function isArchivedPackage(slug: string): boolean {
  return ARCHIVED_PACKAGE_SLUGS.includes(slug);
}
