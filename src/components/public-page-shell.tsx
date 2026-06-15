import { MobileNav } from "@/components/mobile-nav";
import { PublicDesktopNav, type PublicNavActive } from "@/components/public-desktop-nav";
import { MobileStickyActions } from "@/components/mobile-sticky-actions";

interface PublicPageShellProps {
  active: PublicNavActive;
  showStickyActions?: boolean;
  stickyPrimaryHref?: string;
  stickySecondaryHref?: string;
  children: React.ReactNode;
}

export function PublicPageShell({
  active,
  showStickyActions = true,
  stickyPrimaryHref = "/packages",
  stickySecondaryHref = "/#contact",
  children,
}: PublicPageShellProps) {
  return (
    <main className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] mobile-bottom-safe">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 transition-colors duration-300"
          style={{
            background: `linear-gradient(to bottom, var(--theme-gradient-start), var(--theme-gradient-mid), var(--theme-gradient-start))`,
          }}
        />
        <div
          className="absolute top-20 right-20 w-[500px] h-[500px] rounded-full blur-3xl animate-float opacity-60"
          style={{ background: "var(--theme-glow-orange)" }}
        />
      </div>

      <MobileNav />
      <PublicDesktopNav active={active} />
      {showStickyActions && (
        <MobileStickyActions
          primaryHref={stickyPrimaryHref}
          secondaryHref={stickySecondaryHref}
        />
      )}

      {children}
    </main>
  );
}
