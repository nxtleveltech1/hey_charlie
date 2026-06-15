import { MobileStickyActions } from "@/components/mobile-sticky-actions";
import { HomeMobileScrollNav } from "./home-mobile-scroll-nav";
import { HomeScrollNav } from "./home-scroll-nav";

interface HomePageShellProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function HomePageShell({ children, footer }: HomePageShellProps) {
  return (
    <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] overflow-x-clip transition-colors duration-300">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Animated ocean background */}
      <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0 transition-colors duration-300"
          style={{
            background: `linear-gradient(to bottom, var(--theme-gradient-start), var(--theme-gradient-mid), var(--theme-gradient-start))`,
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-96" style={{ opacity: "var(--theme-wave-opacity)" }}>
          <div className="animate-wave absolute bottom-0 left-0 w-[200%] h-24 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 rounded-t-full" />
          <div
            className="animate-wave absolute bottom-8 left-0 w-[200%] h-16 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 rounded-t-full"
            style={{ animationDelay: "-2s" }}
          />
        </div>
        <div
          className="absolute top-20 right-20 w-[500px] h-[500px] rounded-full blur-3xl animate-float"
          style={{ background: "var(--theme-glow-orange)" }}
        />
        <div
          className="absolute top-40 left-10 w-[400px] h-[400px] rounded-full blur-3xl animate-float-delayed"
          style={{ background: "var(--theme-glow-pink)" }}
        />
      </div>

      <header>
        <HomeMobileScrollNav />
        <HomeScrollNav />
      </header>

      <MobileStickyActions primaryHref="#packages" secondaryHref="#contact" />

      <main id="main-content" className="mobile-bottom-safe">
        {children}
      </main>

      {footer}
    </div>
  );
}
