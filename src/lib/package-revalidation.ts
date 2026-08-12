export function getPackageRevalidationPaths(slugs: string[]): string[] {
  const paths = new Set(["/", "/packages"]);

  for (const slug of slugs) {
    const normalizedSlug = slug.trim();
    if (!normalizedSlug) continue;

    paths.add(`/packages/${normalizedSlug}`);
    paths.add(`/booking/${normalizedSlug}`);
  }

  return [...paths];
}
