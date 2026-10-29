"use client";

import { Reveal } from "./Reveal";
import { RevealImage } from "./RevealImage";
import { offers } from "@/lib/content";
import type { OfferItem } from "@/lib/content";

export function Offers({ items }: { items: OfferItem[] }) {
  return (
    <section
      id={offers.id}
      className="bg-bg px-5 py-16 sm:px-8 sm:py-28 lg:px-10 lg:py-32"
      aria-labelledby="offers-title"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="grid gap-3 sm:gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-16">
          <Reveal tone="slide-left">
            <h2
              id="offers-title"
              className="max-w-xl font-sans text-[clamp(1.55rem,5vw,3rem)] font-medium leading-[1.15] tracking-[-0.02em] text-ink text-balance"
            >
              {offers.title}
            </h2>
          </Reveal>
          <Reveal tone="slide-right" delay={0.1}>
            <p className="max-w-md text-[14px] leading-relaxed text-ink-soft sm:text-[15px] lg:justify-self-end">
              {offers.subtitle}
            </p>
          </Reveal>
        </div>

        {/* Mobile: горизонтальный скролл карточек */}
        <div className="relative -mx-5 mt-8 sm:hidden">
          <ul
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label={offers.title}
          >
            {items.map((item, i) => (
              <li
                key={`${item.title}-${i}`}
                className="w-[min(72vw,17.5rem)] shrink-0 snap-start"
              >
                <OfferCard item={item} index={i} compact />
              </li>
            ))}
          </ul>
        </div>

        {/* Tablet / desktop: сетка */}
        <ul className="mt-14 hidden gap-8 sm:grid sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-10">
          {items.map((item, i) => (
            <Reveal key={`${item.title}-${i}`} as="li" tone="fade-up" delay={0.08 * i}>
              <OfferCard item={item} index={i} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function OfferCard({
  item,
  index,
  compact = false,
}: {
  item: OfferItem;
  index: number;
  compact?: boolean;
}) {
  return (
    <article>
      {item.photo ? (
        <RevealImage
          src={item.photo}
          alt={item.title}
          fill
          sizes={compact ? "72vw" : "(max-width: 1024px) 50vw, 33vw"}
          wrapClassName={
            compact
              ? "relative mb-3 aspect-[4/5] overflow-hidden rounded-[1.1rem] bg-tone-3"
              : "relative mb-5 aspect-[3/4] overflow-hidden rounded-[1.25rem] bg-tone-3"
          }
          className="object-cover"
          delay={0.04 * index}
        />
      ) : (
        <RevealImage
          src="/hand.png"
          alt=""
          fill
          sizes={compact ? "72vw" : "(max-width: 1024px) 50vw, 33vw"}
          wrapClassName={
            compact
              ? "relative mb-3 aspect-[4/5] overflow-hidden rounded-[1.1rem] bg-tone-3"
              : "relative mb-5 aspect-[3/4] overflow-hidden rounded-[1.25rem] bg-tone-3"
          }
          className="object-contain p-8 opacity-40 grayscale sm:p-10"
          delay={0.04 * index}
        />
      )}
      <div className="flex items-baseline justify-between gap-3">
        <h3
          className={
            compact
              ? "font-sans text-[15px] font-medium leading-snug text-ink"
              : "font-sans text-lg font-medium text-ink sm:text-xl"
          }
        >
          {item.title}
        </h3>
        <p
          className={
            compact
              ? "shrink-0 text-[13px] font-medium text-ink"
              : "shrink-0 text-[15px] font-medium text-ink"
          }
        >
          {item.price}
        </p>
      </div>
      {item.description ? (
        <p
          className={
            compact
              ? "mt-1.5 line-clamp-2 text-[12px] leading-snug text-ink-soft"
              : "mt-2 line-clamp-2 text-[13px] leading-relaxed text-ink-soft sm:text-[14px]"
          }
        >
          {item.description}
        </p>
      ) : null}
    </article>
  );
}
