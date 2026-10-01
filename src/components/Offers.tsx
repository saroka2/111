"use client";

import { Reveal } from "./Reveal";
import { RevealImage } from "./RevealImage";
import { offers } from "@/lib/content";
import type { OfferItem } from "@/lib/content";

export function Offers({ items }: { items: OfferItem[] }) {
  return (
    <section
      id={offers.id}
      className="bg-bg px-5 py-24 sm:px-8 sm:py-28 lg:px-10 lg:py-32"
      aria-labelledby="offers-title"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-16">
          <Reveal tone="slide-left">
            <h2
              id="offers-title"
              className="max-w-xl font-sans text-[clamp(1.85rem,3.8vw,3rem)] font-medium leading-[1.15] tracking-[-0.02em] text-ink text-balance"
            >
              {offers.title}
            </h2>
          </Reveal>
          <Reveal tone="slide-right" delay={0.1}>
            <p className="max-w-md text-[15px] leading-relaxed text-ink-soft lg:justify-self-end">
              {offers.subtitle}
            </p>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-10">
          {items.map((item, i) => (
            <Reveal key={`${item.title}-${i}`} as="li" tone="fade-up" delay={0.08 * i}>
              <article>
                {item.photo ? (
                  <RevealImage
                    src={item.photo}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    wrapClassName="relative mb-5 aspect-[3/4] overflow-hidden rounded-[1.25rem] bg-tone-3"
                    className="object-cover"
                    delay={0.04 * i}
                  />
                ) : (
                  <RevealImage
                    src="/hand.png"
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    wrapClassName="relative mb-5 aspect-[3/4] overflow-hidden rounded-[1.25rem] bg-tone-3"
                    className="object-contain p-10 opacity-40 grayscale"
                    delay={0.04 * i}
                  />
                )}
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-sans text-lg font-medium text-ink sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="shrink-0 text-[15px] font-medium text-ink">{item.price}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
