"use client";

import Link from "next/link";
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from "react";

import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "whatsapp"
  | "coral";

export type ButtonSize = "sm" | "md" | "lg" | "block";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold leading-none select-none " +
  "outline-none transition-colors duration-200 " +
  "focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)] " +
  "motion-safe:transition-[transform,background-color,border-color,box-shadow,color] motion-safe:hover:-translate-y-0.5 " +
  "disabled:opacity-50 disabled:pointer-events-none disabled:motion-safe:translate-y-0";

const variantClasses: Record<ButtonVariant, string> = {
  // Solid golden-hour amber, navy ink text (confident primary CTA)
  primary: "bg-amber text-ink hover:bg-amber-deep shadow-sm",
  // Theme-aware outline (cream border on dark, navy border on light)
  secondary:
    "bg-transparent border border-[color:var(--theme-border-hover)] text-[color:var(--theme-text)] " +
    "hover:bg-[var(--theme-surface-hover)] hover:border-[color:var(--theme-text)]",
  // Transparent, subtle surface fill on hover
  ghost:
    "bg-transparent text-[color:var(--theme-text)] hover:bg-[var(--theme-surface-hover)]",
  // Tasteful seafoam solid (not neon green)
  whatsapp: "bg-seafoam text-[#06231f] hover:bg-seafoam-deep shadow-sm",
  // Solid coral
  coral: "bg-coral text-[#2a0a06] hover:bg-coral-deep shadow-sm",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-[2.25rem] px-3.5 py-1.5 text-small",
  md: "min-h-[2.75rem] px-5 py-2 text-[0.95rem]",
  lg: "min-h-[3.25rem] px-8 py-2.5 text-base",
  block: "w-full min-h-[2.75rem] px-5 py-2 text-[0.95rem]",
};

export interface ButtonVariants {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

/** Resolve the compiled class string for arbitrary elements. */
export function buttonVariants({
  variant = "primary",
  size = "md",
  className,
}: ButtonVariants = {}): string {
  return cn(base, variantClasses[variant], sizeClasses[size], className);
}

export type ButtonProps = ButtonVariants & {
  children?: ReactNode;
  style?: CSSProperties;
  /** When provided, renders a link (`next/link` or external `<a>`). */
  href?: string;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  rel?: string;
} & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "className" | "children" | "style"
  >;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      className,
      children,
      href,
      target,
      rel,
      ...rest
    },
    ref,
  ) {
    const classes = buttonVariants({ variant, size, className });

    if (href) {
      const isExternal = /^https?:\/\//.test(href);
      if (isExternal) {
        return (
          <a
            ref={ref as Ref<HTMLAnchorElement>}
            href={href}
            className={classes}
            target={target}
            rel={rel}
            {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
          >
            {children}
          </a>
        );
      }

      return (
        <Link
          ref={ref as Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          target={target}
          rel={rel}
          {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={classes} {...rest}>
        {children}
      </button>
    );
  },
);
