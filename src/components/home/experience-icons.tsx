import type { ExperienceIcon } from "@/lib/home-content";

const iconClass = "h-7 w-7";

export function ExperienceIconSvg({ icon }: { icon: ExperienceIcon }) {
  switch (icon) {
    case "sunset":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    case "whale":
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2C8.5 2 6 4.5 6 8c0 1.5.5 2.8 1.3 3.8C5.5 13 4 15.5 4 18c0 2.2 1.8 4 4 4h1v-2H8c-1.1 0-2-.9-2-2 0-1.5.8-2.8 2-3.5.5-.3 1-.5 1.5-.7C10.8 12.5 12 10.4 12 8c0-1.7 1.3-3 3-3s3 1.3 3 3c0 2.4 1.2 4.5 2.5 5.8.7.2 1.3.4 1.8.7 1.2.7 2 2 2 3.5 0 1.1-.9 2-2 2h-1v2h1c2.2 0 4-1.8 4-4 0-2.5-1.5-5-3.3-6.2.8-1 1.3-2.3 1.3-3.8 0-3.5-2.5-6-6-6z" />
        </svg>
      );
    case "fishing":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.5 4.5l-10 10m0 0l3 3m-3-3l3-3m7 7l3 3m-3-3l3-3M6 18L18 6" />
        </svg>
      );
    case "beach":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 17l4-4 4 4 4-8 4 4 2-2" />
        </svg>
      );
    case "crayfish":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 12c0-4 2-6 6-6 2 0 4 1 5 3 1-2 3-3 5-3 4 0 6 2 6 6 0 3-2 5-5 6l-1 3-2-2-2 2-2-2-2 2-1-3c-3-1-5-3-5-6z" />
        </svg>
      );
    case "champagne":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3h6l-1 8H10L9 3zm3 8v10m-4 0h8M8 21h8" />
        </svg>
      );
  }
}

export function StepIcon({ icon }: { icon: "compass" | "anchor" | "sparkles" | "shield" }) {
  const cls = "h-8 w-8";
  switch (icon) {
    case "compass":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7z" />
        </svg>
      );
    case "anchor":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 22V8m0 0l-3 3m3-3l3 3M5 12H2a10 10 0 0020 0h-3" />
        </svg>
      );
    case "sparkles":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
        </svg>
      );
    case "shield":
      return (
        <svg className={cls} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
  }
}
