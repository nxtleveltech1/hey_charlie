"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Video {
  embedUrl: string;
  title: string;
  thumbnail?: string;
}

interface LocationVideosProps {
  videos: Video[];
}

export function LocationVideos({ videos }: LocationVideosProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsOpen(false);
      };
      
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const handleOpen = (video: Video) => {
    setCurrentVideo(video);
    setIsOpen(true);
  };

  return (
    <>
      {/* Video Grid */}
      <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
        {videos.map((video, i) => (
          <button
            key={i}
            onClick={() => handleOpen(video)}
            className="group text-left"
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-[var(--theme-border)]">
              {video.thumbnail && (
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center group-hover:scale-110 group-hover:bg-orange-500/30 transition-all">
                  <svg className="w-6 h-6 lg:w-8 lg:h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <h3 className="mt-4 font-semibold text-center group-hover:text-orange-500 transition-colors">
              {video.title}
            </h3>
          </button>
        ))}
      </div>

      {/* Video Modal */}
      {isOpen && currentVideo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" />

          {/* Modal Content */}
          <div
            className="relative w-full max-w-5xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors flex items-center gap-2"
              aria-label="Close video"
            >
              <span className="text-sm">Close</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video Title */}
            <div className="absolute -top-12 left-0 text-white font-semibold">
              {currentVideo.title}
            </div>

            {/* Video Iframe */}
            <iframe
              src={`${currentVideo.embedUrl}?autoplay=1&rel=0`}
              title={currentVideo.title}
              className="w-full h-full rounded-2xl bg-black"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}

