import type { Metadata } from "next";
import { GalleryExperience } from "@/components/gallery-experience";
import { getGalleryMedia } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Gallery | Hey Charlie Charters",
  description:
    "Browse Hey Charlie Charters photos and videos from real Cape Town boat charter adventures.",
};

// Rendered at build time: the Gallery folder only changes via deploy, and
// Vercel's serverless functions can't read public/ at request time.
export default async function GalleryPage() {
  const media = await getGalleryMedia();

  return <GalleryExperience media={media} />;
}
