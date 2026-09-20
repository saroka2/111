"use client";

import Image from "next/image";
import { Reveal } from "./Reveal";
import { location, site } from "@/lib/content";

const placeholders = [
  { aspect: "aspect-[3/4]", className: "" },
  { aspect: "aspect-[4/5] lg:aspect-[3/4]", className: "" },
  { aspect: "aspect-square", className: "lg:pt-16" },
] as const;

export function Location() {
  return (
    <section
      id={location.id}
      className="bg-bg px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28"
      aria-labelledby="location-title"
    >
      <div className="mx-auto max-w-[1280px]">
        <Reveal tone="blur" className="max-w-4xl">
          <h2
            id="location-title"
            className="font-display text-[clamp(1.45rem,3vw,2.4rem)] font-normal uppercase leading-[1.25] tracking-[0.06em] text-ink text-balance"
          >
            {location.title}
          </h2>
        </Reveal>

        <div className="mt-12 grid items-start gap-4 sm:gap-5 lg:grid-cols-[1.15fr_0.95fr_0.85fr] lg:gap-6">
          <Reveal tone="fade-up" delay={0.06}>
            <div
              className={`relative ${placeholders[0].aspect} overflow-hidden rounded-[1.25rem] bg-tone-3`}
              aria-hidden
            >
              <Image
                src="/hand.png"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 38vw"
                className="object-contain p-12 opacity-35 grayscale"
              />
            </div>
          </Reveal>

          <div className="flex flex-col gap-4 sm:gap-5">
            <Reveal tone="fade-up" delay={0.1}>
              <div
                className={`relative ${placeholders[1].aspect} overflow-hidden rounded-[1.25rem] bg-tone-3`}
                aria-hidden
              >
                <Image
                  src="/hand.png"
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 30vw"
                  className="object-contain p-12 opacity-35 grayscale"
                />
              </div>
            </Reveal>

            <Reveal tone="fade-up" delay={0.16}>
              <div className="max-w-sm">
                <p className="text-[13px] font-medium uppercase tracking-[0.22em] text-ink">
                  {site.name}
                </p>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">
                  {location.text}
                </p>
                <p className="mt-4 text-[13px] text-muted">{location.address}</p>
              </div>
            </Reveal>
          </div>

          <Reveal tone="fade-up" delay={0.14} className={placeholders[2].className}>
            <div
              className={`relative ${placeholders[2].aspect} overflow-hidden rounded-[1.25rem] bg-tone-3`}
              aria-hidden
            >
              <Image
                src="/hand.png"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 28vw"
                className="object-contain p-10 opacity-35 grayscale"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
