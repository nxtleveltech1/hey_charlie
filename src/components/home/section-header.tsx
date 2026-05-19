interface SectionHeaderProps {
  id?: string;
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: "center" | "left";
  /** Tighter spacing for nested panels (contact, about) */
  compact?: boolean;
  /** Extra-tight spacing for compact bands (offers, how-it-works) */
  dense?: boolean;
  className?: string;
}

export function SectionHeader({
  id,
  eyebrow,
  title,
  subtitle,
  align = "center",
  compact = false,
  dense = false,
  className = "",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left lg:mx-0";
  const spacingClass = dense
    ? "mb-0"
    : compact
      ? "mb-4 lg:mb-5"
      : "mb-5 lg:mb-6";

  return (
    <div className={`${spacingClass} max-w-2xl lg:max-w-3xl ${alignClass} ${className}`.trim()}>
      {eyebrow && (
        <p className={`section-eyebrow mb-2 ${align === "center" ? "mx-auto" : ""}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" aria-hidden="true" />
          {eyebrow}
        </p>
      )}
      <h2
        id={id}
        className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-2 lg:mb-2.5 text-balance"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm lg:text-base text-[var(--theme-text-muted)] leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
