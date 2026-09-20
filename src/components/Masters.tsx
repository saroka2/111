"use client";

import Image from "next/image";
import { Reveal } from "./Reveal";
import { RevealImage } from "./RevealImage";
import { masters } from "@/lib/content";

export function Masters() {
  return (
    <section
      id={masters.id}
      className="relative z-0 overflow-visible bg-stripes px-5 pb-24 pt-8 sm:px-8 sm:pb-28 sm:pt-10 lg:px-10 lg:pb-32 lg:pt-12"
      aria-labelledby="masters-title"
    >
      <Image
        src="/hand-peek.png"
        alt=""
        width={553}
        height={771}
        aria-hidden
        className="pointer-events-none absolute left-4 top-0 -z-10 w-[min(38vw,200px)] max-w-none -translate-y-[16%] select-none sm:left-10 sm:w-[min(32vw,260px)] lg:left-16 lg:w-[280px]"
      />

      <div className="relative z-10 mx-auto max-w-[1280px]">
        <Reveal
          tone="blur"
          className="max-w-xl sm:ml-auto sm:text-right"
        >
          <h2
            id="masters-title"
            className="font-sans text-[clamp(1.85rem,3.8vw,3rem)] font-medium leading-[1.15] tracking-[-0.02em] text-ink text-balance"
          >
            {masters.title}
          </h2>
          <p className="mt-4 text-[15px] text-ink-soft">{masters.subtitle}</p>
        </Reveal>

        <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {masters.items.map((master, i) => (
            <Reveal
              key={master.name}
              as="li"
              tone={i % 2 === 0 ? "fade-up" : "scale"}
              delay={0.1 * i}
            >
              <article>
                <RevealImage
                  src="/hand.png"
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  wrapClassName="relative mb-5 aspect-[3/4] rounded-[1.25rem] bg-bg/80"
                  className="object-contain p-10 opacity-40 grayscale"
                  delay={0.05 * i}
                />
                <span className="sr-only">Портрет</span>
                <h3 className="font-sans text-xl font-medium text-ink">{master.name}</h3>
                <p className="mt-1 text-sm text-ink-soft">{master.role}</p>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
