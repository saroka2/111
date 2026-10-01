"use client";

import { BookingButton } from "./BookingButton";
import { Reveal } from "./Reveal";
import { services } from "@/lib/content";
import type { ServiceItem } from "@/lib/content";

export function Services({ items }: { items: ServiceItem[] }) {
  return (
    <section
      id={services.id}
      className="bg-tone-3 px-5 py-24 sm:px-8 sm:py-28 lg:px-10 lg:py-32"
      aria-labelledby="services-title"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-16">
          <Reveal tone="slide-left">
            <h2
              id="services-title"
              className="max-w-xl font-sans text-[clamp(1.85rem,3.8vw,3rem)] font-medium leading-[1.15] tracking-[-0.02em] text-ink text-balance"
            >
              {services.title}
            </h2>
          </Reveal>
          <Reveal tone="slide-right" delay={0.1}>
            <p className="max-w-md text-[15px] leading-relaxed text-ink-soft lg:justify-self-end">
              {services.subtitle}
            </p>
          </Reveal>
        </div>

        <ul className="mt-16 border-t border-line">
          {items.map((item, i) => (
            <Reveal key={`${item.title}-${i}`} as="li" tone="fade-up" delay={0.05 * i} amount={0.35}>
              <article className="grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-start gap-x-3 gap-y-1 border-b border-line py-7 sm:grid-cols-[3rem_1fr_auto] sm:gap-x-6 sm:py-8 lg:grid-cols-[3.5rem_minmax(0,1.3fr)_minmax(0,1fr)_7.5rem]">
                <span className="pt-1 text-[11px] tracking-[0.18em] text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="font-sans text-lg font-medium text-ink sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
                    {item.description}
                  </p>
                  <p className="mt-2 text-xs text-muted sm:hidden">{item.duration}</p>
                </div>
                <p className="hidden pt-1 text-sm text-muted lg:block">{item.duration}</p>
                <p className="whitespace-nowrap pt-1 text-right text-sm font-medium text-ink sm:text-[15px]">
                  {item.price}
                </p>
              </article>
            </Reveal>
          ))}
        </ul>

        <Reveal tone="scale" className="mt-12 flex justify-center">
          <BookingButton variant="outline">{services.cta}</BookingButton>
        </Reveal>
      </div>
    </section>
  );
}
