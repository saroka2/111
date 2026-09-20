"use client";

import { Reveal } from "./Reveal";
import { reviews } from "@/lib/content";

export function Reviews() {
  return (
    <section
      id={reviews.id}
      className="bg-bg px-5 py-24 sm:px-8 sm:py-28 lg:px-10 lg:py-32"
      aria-labelledby="reviews-title"
    >
      <div className="mx-auto max-w-[1280px]">
        <Reveal tone="slide-left">
          <h2
            id="reviews-title"
            className="max-w-xl font-sans text-[clamp(1.85rem,3.8vw,3rem)] font-medium leading-[1.15] tracking-[-0.02em] text-ink text-balance"
          >
            {reviews.title}
          </h2>
        </Reveal>

        <ul className="mt-14 grid gap-5 lg:grid-cols-3 lg:gap-6">
          {reviews.items.map((item, i) => (
            <Reveal
              key={item.name}
              as="li"
              tone="fade-up"
              delay={0.1 * i}
            >
              <blockquote className="flex h-full flex-col rounded-[1.25rem] border border-line bg-surface px-7 py-8">
                <p className="flex-1 text-[15px] leading-relaxed text-ink">
                  «{item.text}»
                </p>
                <footer className="mt-8 flex items-center justify-between border-t border-line pt-5 text-[12px]">
                  <cite className="not-italic font-medium text-ink">{item.name}</cite>
                  <span className="text-muted">{item.date}</span>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
