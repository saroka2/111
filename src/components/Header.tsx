"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, Menu, Phone, X } from "lucide-react";
import { BookingButton } from "./BookingButton";
import { WriteButton } from "./WriteButton";
import { CONTACTS, nav, site, type WriteChannel } from "@/lib/content";

type HeaderProps = {
  phone?: string;
  phoneHref?: string;
  hoursText?: string;
  writeChannels?: WriteChannel[];
};

export function Header({
  phone = CONTACTS.phone,
  phoneHref = CONTACTS.phoneHref,
  hoursText = CONTACTS.hoursText,
  writeChannels,
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  const mobileMenu =
    mounted &&
    createPortal(
      <div
        className={`xl:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <button
          type="button"
          tabIndex={open ? 0 : -1}
          aria-label="Закрыть меню"
          className={`fixed inset-0 z-[60] bg-ink-strong/35 backdrop-blur-[2px] transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeMenu}
        />

        <div
          id={menuId}
          role="dialog"
          aria-modal="true"
          aria-label="Мобильная навигация"
          className={`fixed inset-x-0 top-0 z-[70] max-h-[min(92dvh,640px)] overflow-y-auto border-b border-line bg-bg shadow-[0_18px_48px_rgba(26,26,26,0.12)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-3 sm:px-8">
            <a
              href="#top"
              className="inline-flex min-h-11 items-center font-sans text-[12px] font-medium uppercase tracking-logo text-ink pr-[0.38em]"
              onClick={closeMenu}
            >
              {site.name}
            </a>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-line-hover"
              aria-label="Закрыть меню"
              onClick={closeMenu}
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>

          <nav
            className="mx-auto flex max-w-[1280px] flex-col gap-0.5 px-4 pb-4 sm:px-8"
            aria-label="Мобильная навигация"
          >
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex min-h-12 items-center border-b border-line/60 text-[15px] text-ink transition-colors hover:text-ink-soft"
                onClick={closeMenu}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 py-5 sm:px-8">
            <BookingButton className="w-full" onClick={closeMenu}>
              {site.bookingLabel}
            </BookingButton>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={phoneHref}
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-line px-3 text-[12px] text-ink transition-colors hover:border-line-hover"
                onClick={closeMenu}
              >
                <Phone size={14} strokeWidth={1.5} aria-hidden />
                Позвонить
              </a>
              <WriteButton
                channels={writeChannels}
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-line px-3 text-[12px] text-ink transition-colors hover:border-line-hover"
                onOpenChange={(isOpen) => {
                  if (isOpen) closeMenu();
                }}
              />
            </div>
            <p className="text-center text-[12px] text-muted">{hoursText}</p>
          </div>
        </div>
      </div>,
      document.body,
    );

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-bg/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 py-3 sm:px-8 sm:py-4 lg:px-10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-h-11 min-w-0 flex-col justify-center gap-0.5">
            <a
              href="#top"
              className="inline-flex shrink-0 items-center font-sans text-[12px] font-medium uppercase tracking-logo text-ink pr-[0.38em] sm:text-[13px]"
              onClick={closeMenu}
            >
              {site.name}
            </a>
            <p className="text-[11px] leading-tight text-muted sm:text-[12px]">
              {hoursText}
            </p>
          </div>

          <nav
            className="absolute left-1/2 top-3 hidden -translate-x-1/2 items-center gap-7 sm:top-4 xl:flex"
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

          <div className="flex items-center gap-2 pt-0.5 sm:gap-3">
            <div className="hidden md:block">
              <BookingButton className="!px-5 text-[12px]">
                {site.bookingLabel}
              </BookingButton>
            </div>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-line-hover xl:hidden"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3 md:gap-4">
          <BookingButton className="col-span-2 !min-h-10 !px-4 !py-2.5 text-[11px] sm:col-span-1 md:hidden">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={14} strokeWidth={1.5} aria-hidden />
              {site.bookingLabel}
            </span>
          </BookingButton>

          <a
            href={phoneHref}
            className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-line px-3 text-[11px] text-ink transition-colors hover:border-line-hover sm:justify-start sm:px-4 sm:text-[12px]"
          >
            <Phone size={14} strokeWidth={1.5} aria-hidden />
            <span className="sm:hidden">Позвонить</span>
            <span className="hidden sm:inline">{phone}</span>
          </a>

          <WriteButton
            channels={writeChannels}
            className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-line px-3 text-[11px] text-ink transition-colors hover:border-line-hover sm:justify-start sm:px-4 sm:text-[12px]"
          />
        </div>
      </div>

      {mobileMenu}
    </header>
  );
}
