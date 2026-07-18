// Hosts allowed in next.config.ts images.remotePatterns. next/image throws at
// runtime for any other host, so unknown/bad URLs must fall back to no image.
const ALLOWED_REMOTE_HOSTS = ["images.unsplash.com", "upload.wikimedia.org"];

export function displayableImageSrc(src: string | null | undefined): string | null {
  if (!src) return null;
  if (src.startsWith("/")) return src;
  try {
    const url = new URL(src);
    if (url.protocol === "https:" && ALLOWED_REMOTE_HOSTS.includes(url.hostname)) {
      return src;
    }
  } catch {
    // not a valid absolute URL
  }
  return null;
}
