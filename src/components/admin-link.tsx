"use client";

import Link from "next/link";
import { useIsAdmin } from "@/hooks/use-is-admin";

interface AdminLinkProps {
  className?: string;
  variant?: "text" | "button";
}

export function AdminLink({ className, variant = "text" }: AdminLinkProps) {
  const { isAdmin, isLoading } = useIsAdmin();

  if (isLoading || !isAdmin) return null;

  if (variant === "button") {
    return (
      <Link
        href="/admin"
        className={className || "px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-orange-600 rounded-full hover:opacity-90 transition-opacity"}
      >
        ⚙️ Admin
      </Link>
    );
  }

  return (
    <Link
      href="/admin"
      className={className || "text-sm text-amber-400 hover:text-amber-300 transition-colors font-medium"}
    >
      ⚙️ Admin
    </Link>
  );
}

