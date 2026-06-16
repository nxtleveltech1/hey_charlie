"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/bookings", label: "Bookings", icon: "📅" },
  { href: "/admin/packages", label: "Packages", icon: "📦" },
  { href: "/admin/package-addons", label: "Add-ons", icon: "➕" },
  { href: "/admin/crew", label: "Crew", icon: "👨‍✈️" },
  { href: "/admin/news", label: "News", icon: "📰" },
  { href: "/admin/weather-alerts", label: "Weather Alerts", icon: "🌊" },
  { href: "/admin/customers", label: "Customers", icon: "👥" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

const bottomNavItems = [
  { href: "/admin", label: "Home", icon: "📊", match: (p: string) => p === "/admin" },
  {
    href: "/admin/bookings",
    label: "Bookings",
    icon: "📅",
    match: (p: string) => p.startsWith("/admin/bookings"),
  },
  {
    href: "/admin/weather-alerts",
    label: "Alerts",
    icon: "🌊",
    match: (p: string) => p.startsWith("/admin/weather-alerts"),
  },
];

interface AdminShellProps {
  children: React.ReactNode;
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
}

function NavLink({
  href,
  label,
  icon,
  active,
  onClick,
}: {
  href: string;
  label: string;
  icon: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors",
        active
          ? "bg-amber/15 font-medium text-amber"
          : "text-[var(--theme-text-secondary)] hover:bg-[var(--theme-surface)] hover:text-[var(--theme-text)]",
      )}
    >
      <span aria-hidden="true">{icon}</span>
      {label}
    </Link>
  );
}

export function AdminShell({ children, user }: AdminShellProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useFocusTrap(drawerOpen, () => setDrawerOpen(false));

  const pageTitle =
    navItems.find(
      (item) =>
        pathname === item.href ||
        (item.href !== "/admin" && pathname.startsWith(item.href)),
    )?.label ?? "Admin";

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)]">
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 border-r border-[var(--theme-border)] bg-[var(--theme-nav-bg)] backdrop-blur-xl lg:block">
        <div className="flex h-full flex-col">
          <div className="p-6">
            <Link href="/admin" className="mb-8 flex items-center gap-3">
              <Image
                src="/logo2.png"
                alt="Hey Charlie Charters"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div>
                <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-cyan-300 bg-clip-text text-lg font-bold italic text-transparent">
                  Admin
                </span>
                <span className="block text-xs text-amber">Hey Charlie</span>
              </div>
            </Link>
            <nav className="space-y-1" aria-label="Admin navigation">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  active={
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href))
                  }
                />
              ))}
            </nav>
          </div>
          <div className="mt-auto border-t border-[var(--theme-border)] p-6">
            <div className="flex items-center gap-3">
              <UserButton afterSignOutUrl="/" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {user.firstName} {user.lastName}
                </p>
                <p className="truncate text-xs text-[var(--theme-text-muted)]">
                  {user.email}
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="mt-4 block min-h-11 rounded-xl py-2 text-center text-sm text-[var(--theme-text-muted)] transition-colors hover:bg-[var(--theme-surface)]"
            >
              ← Back to Site
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="fixed left-0 right-0 top-0 z-40 border-b border-[var(--theme-border)] bg-[var(--theme-nav-bg)] backdrop-blur-xl safe-top lg:hidden">
        <div className="flex min-h-14 items-center justify-between gap-3 px-4">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex h-11 w-11 flex-col items-center justify-center gap-1 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)]"
            aria-label="Open admin menu"
            aria-expanded={drawerOpen}
          >
            <span className="h-0.5 w-5 bg-current" />
            <span className="h-0.5 w-5 bg-current" />
            <span className="h-0.5 w-5 bg-current" />
          </button>
          <div className="min-w-0 flex-1 text-center">
            <p className="truncate text-sm font-semibold">{pageTitle}</p>
            <p className="truncate text-xs text-[var(--theme-text-muted)]">
              Hey Charlie Admin
            </p>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Mobile drawer */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation"
            className="fixed left-0 top-0 z-50 flex h-full w-[min(100vw,20rem)] flex-col border-r border-[var(--theme-border)] bg-[var(--theme-bg)] lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-[var(--theme-border)] p-4">
              <span className="font-semibold">Admin Menu</span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--theme-border)]"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto p-4" aria-label="Admin navigation">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  active={
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href))
                  }
                  onClick={() => setDrawerOpen(false)}
                />
              ))}
            </nav>
            <div className="border-t border-[var(--theme-border)] p-4">
              <Link
                href="/"
                onClick={() => setDrawerOpen(false)}
                className="block min-h-11 rounded-xl py-3 text-center text-sm text-[var(--theme-text-muted)] hover:bg-[var(--theme-surface)]"
              >
                ← Back to Site
              </Link>
            </div>
          </div>
        </>
      )}

      {/* Main content */}
      <main className="min-h-screen pb-[calc(4.5rem+env(safe-area-inset-bottom))] pt-[calc(3.5rem+env(safe-area-inset-top))] lg:ml-64 lg:pb-8 lg:pt-8">
        <div className="p-4 lg:p-8">{children}</div>
      </main>

      {/* Mobile bottom quick nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--theme-border)] bg-[var(--theme-nav-bg)] backdrop-blur-xl lg:hidden"
        aria-label="Admin quick navigation"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="grid grid-cols-4">
          {bottomNavItems.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-0.5 text-[10px] font-medium",
                  active ? "text-amber" : "text-[var(--theme-text-muted)]",
                )}
              >
                <span className="text-lg" aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex min-h-14 flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-[var(--theme-text-muted)]"
          >
            <span className="text-lg" aria-hidden="true">
              ☰
            </span>
            More
          </button>
        </div>
      </nav>
    </div>
  );
}
