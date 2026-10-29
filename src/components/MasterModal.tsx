"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { MasterItem } from "@/lib/content";
import { BookingButton } from "./BookingButton";

type MasterModalProps = {
  master: MasterItem | null;
  onClose: () => void;
};

export function MasterModal({ master, onClose }: MasterModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!master) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [master, onClose]);

  if (!master || !mounted) return null;

  const bookLabel = `Записаться · ${master.name}`;
  const hasBookingUrl = Boolean(master.bookingUrl);
  const description = master.description?.trim() || "";

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-ink-strong/55 px-3 py-3 backdrop-blur-[3px] sm:items-center sm:px-6 sm:py-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="master-modal-title"
        className="relative z-[10000] flex h-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-md flex-col overflow-hidden rounded-[1.5rem] border border-line bg-bg shadow-[0_24px_80px_rgba(26,26,26,0.28)] sm:max-h-[calc(100dvh-2rem)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Фото сверху — фиксированная высота, как у мастеров */}
        <div className="relative h-[min(42dvh,340px)] w-full shrink-0 overflow-hidden bg-tone-3">
          {master.photo ? (
            <Image
              src={master.photo}
              alt={master.name}
              fill
              sizes="(max-width: 448px) 100vw, 448px"
              className="object-contain"
              priority
            />
          ) : (
            <Image
              src="/hand.png"
              alt=""
              fill
              sizes="(max-width: 448px) 100vw, 448px"
              className="object-contain p-12 opacity-35 grayscale"
            />
          )}
          <button
            type="button"
            aria-label="Закрыть"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-line/80 bg-bg/90 text-ink backdrop-blur-sm transition-colors hover:border-line-hover"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Растёт с текстом; скролл только когда карточка упёрлась в max-height */}
        <div className="min-h-0 flex-shrink overflow-x-hidden overflow-y-auto px-6 pt-6 sm:px-7 sm:pt-7">
          <p className="break-words text-[11px] uppercase tracking-[0.18em] text-muted">
            {master.group}
          </p>
          <h3
            id="master-modal-title"
            className="mt-2 break-words font-sans text-2xl font-medium text-ink"
          >
            {master.name}
          </h3>
          <p className="mt-1 break-words text-sm text-ink-soft">{master.role}</p>
          {description ? (
            <p className="mt-4 max-w-full whitespace-pre-wrap break-words pb-2 text-[15px] leading-relaxed text-ink-soft [overflow-wrap:anywhere]">
              {description}
            </p>
          ) : null}
        </div>

        <div className="shrink-0 border-t border-line bg-bg px-6 py-4 sm:px-7 sm:py-5">
          {hasBookingUrl ? (
            <a
              href={master.bookingUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-ink-strong bg-ink-strong px-7 py-3 text-[12px] tracking-[0.04em] text-bg transition-colors duration-300 hover:bg-ink"
            >
              {bookLabel}
            </a>
          ) : (
            <BookingButton className="w-full" href="#booking" onClick={onClose}>
              {bookLabel}
            </BookingButton>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
