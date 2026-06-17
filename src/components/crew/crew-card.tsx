import Image from "next/image";

interface CrewCardProps {
  name: string;
  role: string;
  bio: string | null;
  certifications: string[] | null;
  imageUrl: string | null;
  /** CSS object-position focal point, e.g. "50% 30%". */
  imageFocalPoint?: string;
}

export function CrewCard({
  name,
  role,
  bio,
  certifications,
  imageUrl,
  imageFocalPoint = "50% 50%",
}: CrewCardProps) {
  return (
    <article className="card-hover group flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] shadow-sm light-card">
      {/* Portrait with name/role overlaid on a scrim */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--theme-bg-secondary)]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            style={{ objectPosition: imageFocalPoint }}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-6xl opacity-30">
            👨‍✈️
          </div>
        )}

        {/* Bottom scrim for legible overlay text */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"
        />

        {/* Name + role */}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <h3 className="text-xl font-bold leading-tight tracking-tight text-white drop-shadow-sm lg:text-2xl">
            {name}
          </h3>
          <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.14em] text-orange-300">
            {role}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 sm:p-5">
        {bio && (
          <p className="text-sm leading-relaxed text-[var(--theme-text-secondary)]">
            {bio}
          </p>
        )}

        {certifications && certifications.length > 0 && (
          <div className="mt-auto border-t border-[var(--theme-border)] pt-3">
            <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[var(--theme-text-muted)]">
              Qualifications
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {certifications.map((cert) => (
                <li key={cert}>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--theme-border)] bg-[var(--theme-surface)] px-3 py-1.5 text-xs font-medium text-[var(--theme-text-secondary)]">
                    <svg
                      className="h-3.5 w-3.5 shrink-0 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {cert}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}

/** Face focal points per crew member (keyed by display name). */
export const crewImageFocalPoints: Record<string, string> = {
  "Gareth Bew": "70% 38%",
  "Jay Profe": "46% 30%",
  "Wayne Laufs": "50% 12%",
};
