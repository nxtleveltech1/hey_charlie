"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "./theme-toggle";

const navLinks = [
  { href: "#experiences", label: "Experiences" },
  { href: "#packages", label: "Packages" },
  { href: "#destinations", label: "Destinations" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <nav className="fixed top-0 w-full border-b border-[var(--theme-border)] backdrop-blur-2xl bg-[var(--theme-nav-bg)] z-50 transition-colors duration-300 lg:hidden">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo2.png"
                alt="Hey Charlie Charters"
                width={45}
                height={45}
                className="rounded-lg"
              />
              <div>
                <span 
                  className="text-lg font-bold italic bg-gradient-to-r from-cyan-300 via-sky-400 to-cyan-300 bg-clip-text text-transparent"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Hey Charlie
                </span>
                <span className="block text-[10px] font-semibold italic tracking-wider bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                  CHARTERS
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg bg-[var(--theme-surface)] border border-[var(--theme-border)]"
                aria-label="Toggle menu"
              >
                <span 
                  className={`w-5 h-0.5 bg-current transition-all duration-300 ${
                    isOpen ? "rotate-45 translate-y-2" : ""
                  }`} 
                />
                <span 
                  className={`w-5 h-0.5 bg-current transition-all duration-300 ${
                    isOpen ? "opacity-0" : ""
                  }`} 
                />
                <span 
                  className={`w-5 h-0.5 bg-current transition-all duration-300 ${
                    isOpen ? "-rotate-45 -translate-y-2" : ""
                  }`} 
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-72 bg-[var(--theme-bg)] border-l border-[var(--theme-border)] z-50 lg:hidden transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 pt-20 h-full flex flex-col">
          <nav className="space-y-1 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-xl text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] hover:bg-[var(--theme-surface)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-6 border-t border-[var(--theme-border)] space-y-4">
            <SignedOut>
              <Link
                href="/sign-in"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-4 py-3 rounded-xl border border-[var(--theme-border)] hover:bg-[var(--theme-surface)] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="#packages"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium"
              >
                Book Now
              </Link>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[var(--theme-surface)]">
                <span className="text-sm">My Account</span>
                <UserButton afterSignOutUrl="/" />
              </div>
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium"
              >
                My Bookings
              </Link>
            </SignedIn>
          </div>
        </div>
      </div>
    </>
  );
}

