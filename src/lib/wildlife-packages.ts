export const WILDLIFE_EXPLORER_SLUG = "cape-wildlife-explorer";
export const ARCHIVED_WILDLIFE_SLUGS = [
  "seal-island",
  "whale-watching",
  "whale-watching-expedition",
];

export function isArchivedWildlifePackage(slug: string): boolean {
  return ARCHIVED_WILDLIFE_SLUGS.includes(slug);
}
