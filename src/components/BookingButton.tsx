"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "solid" | "outline" | "solid-light" | "outline-light";

const variants: Record<Variant, string> = {
  solid:
    "bg-ink-strong text-bg hover:bg-ink border border-ink-strong",
  outline:
    "bg-transparent text-ink border border-ink/25 hover:border-ink",
  "solid-light":
    "bg-on-dark text-dark hover:bg-bg border border-on-dark",
  "outline-light":
    "bg-transparent text-on-dark border border-on-dark/35 hover:border-on-dark",
};

type BookingButtonProps = {
  className?: string;
  children?: ReactNode;
  variant?: Variant;
  href?: string;
} & Omit<ComponentPropsWithoutRef<"a">, "href">;

export function BookingButton({
  className = "",
  children = "Онлайн-запись",
  variant = "solid",
  href = "#booking",
  ...props
}: BookingButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center justify-center rounded-full px-7 py-3 text-[12px] tracking-[0.04em] transition-colors duration-300 ${variants[variant]} ${className}`}
      aria-label={typeof children === "string" ? `${children} (демо-заглушка)` : "Онлайн-запись (демо-заглушка)"}
      {...props}
    >
      {children}
    </Link>
  );
}
