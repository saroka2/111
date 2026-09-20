"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { BookingButton } from "./BookingButton";
import { nav, site } from "@/lib/content";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? "border-b border-line/80 bg-bg/85 backdrop-blur-md"
          : "bg-bg/50 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-[1280px] items-center justify-between px-5 sm:px-8 lg:px-10">
        <a
          href="#top"
          className="inline-flex min-h-11 items-center font-sans text-[12px] font-medium uppercase tracking-logo text-ink pr-[0.38em] sm:text-[13px]"
        >
          {site.name}
        </a>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex"
          aria-label="Основная навигация"
        >
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center text-[12px] text-ink-soft transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <BookingButton className="!px-6 text-[12px]">
              {site.bookingLabel}
            </BookingButton>
          </div>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-line-hover lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`overflow-hidden border-t border-line/70 bg-bg/95 backdrop-blur-md transition-[max-height,opacity] duration-500 lg:hidden ${
          open ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-5 py-6 sm:px-8" aria-label="Мобильная навигация">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center text-[14px] text-ink-soft transition-colors hover:text-ink"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="pt-4 sm:hidden">
            <BookingButton className="w-full" onClick={() => setOpen(false)}>
              {site.bookingLabel}
            </BookingButton>
          </div>
        </nav>
      </div>
    </header>
  );
}
