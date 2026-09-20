"use client";

import Image from "next/image";
import { Reveal } from "./Reveal";
import { about } from "@/lib/content";

export function About() {
  return (
    <section
      id={about.id}
      className="relative z-10 overflow-hidden bg-dark px-5 py-24 text-on-dark sm:px-8 sm:py-28 lg:px-10 lg:py-32"
      aria-labelledby="about-title"
    >
      <div className="mx-auto grid max-w-[1280px] items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <div>
          <Reveal tone="blur">
            <h2
              id="about-title"
              className="max-w-lg font-sans text-[clamp(1.9rem,4vw,3.1rem)] font-medium leading-[1.15] tracking-[-0.02em] text-balance"
            >
              {about.title}
            </h2>
          </Reveal>
          <Reveal tone="fade-up" delay={0.08}>
            <p className="mt-6 font-display text-2xl italic text-on-dark-soft sm:text-[1.7rem]">
              {about.lead}
            </p>
          </Reveal>
          <Reveal tone="fade-up" delay={0.14} className="mt-6 max-w-lg space-y-4 text-[15px] leading-relaxed text-on-dark-soft">
            {about.text.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Reveal>
          <ul className="mt-10 grid gap-5 sm:grid-cols-3">
            {about.points.map((point, i) => (
              <Reveal key={point.title} as="li" tone="fade-up" delay={0.1 + i * 0.08}>
                <div className="border-t border-on-dark/15 pt-4">
                  <p className="text-[12px] uppercase tracking-[0.16em] text-on-dark">
                    {point.title}
                  </p>
                  <p className="mt-2 text-sm text-on-dark-soft">{point.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal
          tone="scale"
          delay={0.12}
          className="relative mx-auto flex aspect-square w-full max-w-[280px] items-center justify-center sm:max-w-[420px]"
        >
          <div className="absolute inset-0 rounded-full border border-on-dark/20" aria-hidden />
          <div className="absolute inset-[8%] overflow-hidden rounded-full bg-tone-3" aria-hidden />
          <Image
            src="/mermaid.png"
            alt="Фирменная русалка ВТОРНИК"
            width={837}
            height={719}
            className="relative z-10 h-[72%] w-auto object-contain"
            priority={false}
          />
        </Reveal>
      </div>
    </section>
  );
}
