"use client";

import { useState, useEffect } from "react";
import { useFocusTrap } from "@/hooks/use-focus-trap";

interface VideoModalProps {
  embedUrl: string;
  title: string;
  thumbnail?: string;
}

export function VideoModal({ embedUrl, title, thumbnail }: VideoModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useFocusTrap(isOpen, () => setIsOpen(false));

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group relative h-full w-full"
        aria-label={`Play video: ${title}`}
      >
        {thumbnail && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${thumbnail})` }}
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/50 bg-white/20 backdrop-blur-sm transition-transform group-hover:scale-110 lg:h-20 lg:w-20">
            <svg
              className="ml-1 h-6 w-6 text-white lg:h-8 lg:w-8"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" aria-hidden="true" />

          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Video: ${title}`}
            className="relative aspect-video w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute -top-14 right-0 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Close video"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <iframe
              src={`${embedUrl}?autoplay=1`}
              title={title}
              className="h-full w-full rounded-2xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}
