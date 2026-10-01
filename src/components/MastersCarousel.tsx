"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import type { MasterItem } from "@/lib/content";
import { MasterCard } from "./MasterCard";

export function MastersCarousel({ items }: { items: MasterItem[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(items.length > 1);

  const updateEnds = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateEnds();
    el.addEventListener("scroll", updateEnds, { passive: true });
    const observer = new ResizeObserver(updateEnds);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", updateEnds);
      observer.disconnect();
    };
  }, [updateEnds, items.length]);

  const frameRef = useRef(0);

  function scrollByCard(direction: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const styles = getComputedStyle(el);
    const gap = parseFloat(styles.columnGap || styles.gap) || 0;
    const step = (card?.offsetWidth || 320) + gap;
    const max = el.scrollWidth - el.clientWidth;
    const target = Math.max(0, Math.min(max, el.scrollLeft + direction * step));

    cancelAnimationFrame(frameRef.current);
    if (reduceMotion) {
      el.scrollTo({ left: target, behavior: "auto" });
      return;
    }

    const start = el.scrollLeft;
    const change = target - start;
    const duration = 420;
    const started = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / duration);
      const eased = 1 - (1 - progress) ** 3;
      el.scrollLeft = start + change * eased;
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
  }

  return (
    <div className="mt-14 min-w-0">
      <div className="mb-6 hidden justify-end gap-3 md:flex">
        <CarouselButton
          label="Предыдущие мастера"
          disabled={!canPrev}
          onClick={() => scrollByCard(-1)}
        >
          <ChevronLeft size={18} strokeWidth={1.5} />
        </CarouselButton>
        <CarouselButton
          label="Следующие мастера"
          disabled={!canNext}
          onClick={() => scrollByCard(1)}
        >
          <ChevronRight size={18} strokeWidth={1.5} />
        </CarouselButton>
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-8 overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] lg:gap-10 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((master, i) => (
          <div
            key={`${master.name}-${i}`}
            data-card
            className="w-[min(82vw,320px)] shrink-0 snap-start"
          >
            <MasterCard master={master} index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}

function CarouselButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-line-hover disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}
