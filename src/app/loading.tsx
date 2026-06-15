export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-5 bg-navy px-6 text-center"
    >
      <span
        aria-hidden="true"
        className="h-12 w-12 rounded-full border-[3px] border-cream/15 border-t-amber animate-spin motion-reduce:animate-none"
      />
      <span className="font-display text-h3 text-cream">Hey Charlie Charters</span>
      <span className="text-eyebrow text-cream-dim">Loading</span>
    </div>
  );
}
