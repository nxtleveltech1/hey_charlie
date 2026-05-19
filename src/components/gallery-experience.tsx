"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export interface GalleryMediaItem {
  id: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  alt: string;
  title: string;
  width: number;
  height: number;
}

type GalleryFilter = "all" | "image" | "video";

interface GalleryExperienceProps {
  media: GalleryMediaItem[];
}

const filterOptions: Array<{ id: GalleryFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "image", label: "Photos" },
  { id: "video", label: "Videos" },
];

function ChevronLeftIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function MediaPreview({
  item,
  sizes,
  priority = false,
  playPreview = false,
  className = "",
}: {
  item: GalleryMediaItem;
  sizes: string;
  priority?: boolean;
  playPreview?: boolean;
  className?: string;
}) {
  if (item.type === "video") {
    return (
      <video
        className={`h-full w-full object-cover ${className}`}
        poster={item.poster}
        muted
        loop
        autoPlay={playPreview}
        playsInline
        preload="metadata"
      >
        <source src={item.src} type="video/mp4" />
      </video>
    );
  }

  return (
    <Image
      src={item.src}
      alt={item.alt}
      fill
      priority={priority}
      sizes={sizes}
      className={`object-cover ${className}`}
    />
  );
}

export function GalleryExperience({ media }: GalleryExperienceProps) {
  const [activeFilter, setActiveFilter] = useState<GalleryFilter>("all");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const photos = useMemo(() => media.filter((item) => item.type === "image"), [media]);
  const videos = useMemo(() => media.filter((item) => item.type === "video"), [media]);
  const featuredMedia = videos[0] ?? photos[0];
  const heroStrip = useMemo(
    () => [photos[7], videos[1], photos[14], photos[24], videos[3], photos[35]].filter(Boolean) as GalleryMediaItem[],
    [photos, videos],
  );

  const filteredMedia = useMemo(() => {
    if (activeFilter === "all") {
      return media;
    }

    return media.filter((item) => item.type === activeFilter);
  }, [activeFilter, media]);

  const selectedItem = selectedIndex === null ? null : filteredMedia[selectedIndex];

  useEffect(() => {
    if (!selectedItem) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedIndex(null);
      }

      if (event.key === "ArrowLeft") {
        setSelectedIndex((current) =>
          current === null ? current : (current - 1 + filteredMedia.length) % filteredMedia.length,
        );
      }

      if (event.key === "ArrowRight") {
        setSelectedIndex((current) =>
          current === null ? current : (current + 1) % filteredMedia.length,
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [filteredMedia.length, selectedItem]);

  const openMedia = (index: number) => {
    setSelectedIndex(index);
  };

  const goToPrevious = () => {
    setSelectedIndex((current) =>
      current === null ? current : (current - 1 + filteredMedia.length) % filteredMedia.length,
    );
  };

  const goToNext = () => {
    setSelectedIndex((current) =>
      current === null ? current : (current + 1) % filteredMedia.length,
    );
  };

  if (!featuredMedia) {
    return (
      <section className="flex min-h-screen items-center justify-center px-6 pt-28 text-center">
        <div>
          <h1 className="text-4xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Gallery
          </h1>
          <p className="mt-4 text-[var(--theme-text-muted)]">No gallery media was found.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 transition-colors duration-300"
          style={{
            background:
              "linear-gradient(180deg, var(--theme-gradient-start) 0%, var(--theme-gradient-mid) 42%, var(--theme-gradient-start) 100%)",
          }}
        />
      </div>

      <section className="relative min-h-[92svh] overflow-hidden pt-24 lg:min-h-screen lg:pt-32">
        <div className="absolute inset-0">
          <MediaPreview
            item={featuredMedia}
            priority
            sizes="100vw"
            playPreview
            className="scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-[var(--theme-bg)] lg:bg-gradient-to-r lg:from-black/80 lg:via-black/45 lg:to-black/20" />
        </div>

        <div className="wide-shell relative flex min-h-[calc(92svh-6rem)] items-end pb-10 lg:min-h-[calc(100vh-8rem)] lg:items-center lg:pb-0">
          <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(24rem,0.52fr)] lg:items-end">
            <div className="max-w-5xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-cyan-300" />
                Real charters, real Cape water
              </div>

              <h1
                className="max-w-5xl text-4xl font-bold leading-[1.02] text-white sm:text-6xl lg:text-8xl 2xl:text-9xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                The <span className="text-gradient-sunset">Hey Charlie</span>{" "}
                <span className="text-gradient-ocean">Gallery</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/78 sm:text-lg lg:text-xl">
                Salt spray, open decks, big smiles, fish on the line, and Cape Town doing that outrageous Cape Town thing.
              </p>

              <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3">
                <div className="border-l border-white/20 pl-4">
                  <p className="text-3xl font-bold text-white">{photos.length}</p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/55">Photos</p>
                </div>
                <div className="border-l border-white/20 pl-4">
                  <p className="text-3xl font-bold text-white">{videos.length}</p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/55">Videos</p>
                </div>
                <div className="border-l border-white/20 pl-4">
                  <p className="text-3xl font-bold text-white">{media.length}</p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/55">Moments</p>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-3">
                {heroStrip.slice(0, 4).map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      const targetIndex = filteredMedia.findIndex((mediaItem) => mediaItem.id === item.id);
                      openMedia(targetIndex >= 0 ? targetIndex : 0);
                    }}
                    className={`group relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 text-left shadow-2xl shadow-black/20 ${
                      index === 0 ? "col-span-2 aspect-[16/9]" : "aspect-[4/3]"
                    }`}
                    aria-label={`Open ${item.title}`}
                  >
                    <MediaPreview item={item} sizes="(min-width: 1024px) 26vw, 50vw" playPreview />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-60" />
                    {item.type === "video" && (
                      <span className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-transform group-hover:scale-110">
                        <PlayIcon />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad-sm">
        <div className="wide-shell">
          <div className="flex flex-col gap-5 border-y border-[var(--theme-border)] py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">Sea stories</p>
              <h2
                className="mt-1 text-2xl font-bold sm:text-3xl lg:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Photos and films from the water
              </h2>
            </div>

            <div className="inline-grid w-full grid-cols-3 rounded-full border border-[var(--theme-border)] bg-[var(--theme-surface)] p-1 sm:w-auto">
              {filterOptions.map((option) => {
                const isActive = activeFilter === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setActiveFilter(option.id);
                      setSelectedIndex(null);
                    }}
                    className={`min-h-11 rounded-full px-4 text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/20"
                        : "text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="wide-shell pb-20">
        <div className="columns-1 gap-2 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5">
          {filteredMedia.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => openMedia(index)}
              className="group relative mb-2 block w-full break-inside-avoid overflow-hidden rounded-xl border border-[var(--theme-border)] bg-black text-left shadow-lg shadow-black/10 transition-all duration-500 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-cyan-500/10"
              aria-label={`Open ${item.title}`}
              style={{ aspectRatio: `${item.width} / ${item.height}` }}
            >
              <MediaPreview
                item={item}
                sizes="(min-width: 1536px) 20vw, (min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/10 to-transparent opacity-75 transition-opacity duration-300 group-hover:opacity-95" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/55">
                    {item.type === "video" ? "Video" : "Photo"}
                  </p>
                  <p className="mt-1 text-base font-semibold text-white">{item.title}</p>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white opacity-90 backdrop-blur transition-transform group-hover:scale-110">
                  {item.type === "video" ? <PlayIcon /> : <ChevronRightIcon />}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--theme-border)] bg-gradient-to-r from-cyan-500/10 via-transparent to-orange-500/10 py-12 lg:py-16">
        <div className="wide-shell flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-cyan-500">Your turn next</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl lg:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
              Get in the next album.
            </h2>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/packages"
              className="min-h-12 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-7 py-3 text-center font-semibold text-white shadow-lg shadow-orange-500/20 transition-opacity hover:opacity-90 btn-primary"
            >
              Book a Charter
            </Link>
            <Link
              href="/#contact"
              className="min-h-12 rounded-full border border-[var(--theme-border)] bg-[var(--theme-card-bg)] px-7 py-3 text-center font-semibold transition-colors hover:bg-[var(--theme-surface)]"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {selectedItem && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 p-3 text-white backdrop-blur-md sm:p-6"
          onClick={() => setSelectedIndex(null)}
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setSelectedIndex(null);
            }}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
            aria-label="Close gallery preview"
          >
            <CloseIcon />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 sm:left-6"
            aria-label="Previous media"
          >
            <ChevronLeftIcon />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goToNext();
            }}
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 sm:right-6"
            aria-label="Next media"
          >
            <ChevronRightIcon />
          </button>

          <div
            className="relative flex h-full w-full max-w-7xl items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            {selectedItem.type === "video" ? (
              <video
                key={selectedItem.src}
                className="max-h-[84svh] w-full rounded-2xl object-contain"
                poster={selectedItem.poster}
                controls
                autoPlay
                playsInline
              >
                <source src={selectedItem.src} type="video/mp4" />
              </video>
            ) : (
              <div className="relative h-[84svh] w-full">
                <Image
                  src={selectedItem.src}
                  alt={selectedItem.alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </div>
            )}
          </div>

          <div className="absolute bottom-4 left-1/2 z-10 w-[min(100%-2rem,38rem)] -translate-x-1/2 rounded-full border border-white/15 bg-black/35 px-4 py-3 text-center text-sm text-white/75 backdrop-blur-md">
            <span className="font-semibold text-white">{selectedItem.title}</span>
            <span className="mx-2 text-white/35">/</span>
            <span>
              {(selectedIndex ?? 0) + 1} of {filteredMedia.length}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
