"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { BookingButton } from "./BookingButton";
import { Reveal } from "./Reveal";
import { CONTACTS, formatAddress, hero } from "@/lib/content";

export function Hero({
  phone = CONTACTS.phone,
  phoneHref = CONTACTS.phoneHref,
  address = CONTACTS.address,
  addressNote = CONTACTS.addressNote,
}: {
  phone?: string;
  phoneHref?: string;
  address?: string;
  addressNote?: string;
}) {
  const [ready, setReady] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    setReady(true);
  }, []);

  const animate = ready && !reduce;
  const viewport = { once: false, amount: 0.35, margin: "0px 0px -10% 0px" } as const;
  const addressLine = formatAddress(address, addressNote, { withCity: true });

  return (
    <section
      id="top"
      className="relative flex flex-1 flex-col overflow-hidden bg-bg"
      aria-labelledby="hero-title"
    >
      <div className="mx-auto grid w-full max-w-[1280px] flex-1 items-center gap-8 px-5 pb-6 pt-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:px-10 lg:pb-8 lg:pt-10">
        <div className="relative z-10 max-w-xl">
          <motion.h1
            id="hero-title"
            className="text-balance text-ink"
            initial={animate ? { opacity: 0, y: 36 } : false}
            whileInView={animate ? { opacity: 1, y: 0 } : undefined}
            viewport={viewport}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="block font-sans text-[clamp(2rem,8.4vw,4.4rem)] font-medium leading-[1.05] tracking-[-0.03em]">
              {hero.line1}
            </span>
            <motion.span
              className="mt-1 block font-display text-[clamp(2.15rem,8.8vw,4.8rem)] italic font-normal leading-[1.05]"
              initial={animate ? { opacity: 0, y: 20, filter: "blur(6px)" } : false}
              whileInView={animate ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
              viewport={viewport}
              transition={{ duration: 1, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              {hero.line2Italic}
            </motion.span>
            <motion.span
              className="mt-1 block font-sans text-[clamp(2rem,8.4vw,4.4rem)] font-semibold uppercase leading-[1.05] tracking-[-0.03em]"
              initial={animate ? { opacity: 0, y: 24 } : false}
              whileInView={animate ? { opacity: 1, y: 0 } : undefined}
              viewport={viewport}
              transition={{ duration: 0.9, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            >
              {hero.line3}
            </motion.span>
          </motion.h1>

          <Reveal tone="fade-up" delay={0.18} className="mt-5 max-w-lg">
            <p className="font-display text-[clamp(1.15rem,2.8vw,1.55rem)] italic leading-snug text-ink">
              {hero.slogan}
            </p>
          </Reveal>

          <Reveal tone="fade-up" delay={0.24} className="mt-6 max-w-md">
            <p className="text-[15px] leading-relaxed text-ink-soft">{hero.subtitle}</p>
          </Reveal>

          <Reveal tone="fade-up" delay={0.3} className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <BookingButton className="w-full sm:w-auto">{hero.primaryCta}</BookingButton>
            <BookingButton href={hero.secondaryHref} variant="outline" className="w-full sm:w-auto">
              {hero.secondaryCta}
            </BookingButton>
          </Reveal>

          <Reveal
            tone="fade"
            delay={0.36}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-5 text-[12px] text-muted"
          >
            <span>
              {address}
              {addressNote ? (
                <span className="text-[11px] text-muted"> ({addressNote})</span>
              ) : null}
              <span className="sr-only">. {addressLine}</span>
            </span>
            <a href={phoneHref} className="inline-flex min-h-11 items-center transition-colors hover:text-ink">
              {phone}
            </a>
          </Reveal>
        </div>

        <motion.div
          className="relative mx-auto flex aspect-square w-full max-w-[260px] items-center justify-center sm:max-w-[400px] lg:max-w-[460px]"
          initial={animate ? { opacity: 0, scale: 0.9, x: 12 } : false}
          whileInView={animate ? { opacity: 1, scale: 1, x: 0 } : undefined}
          viewport={viewport}
          transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
        >
          <div className="absolute inset-[6%] rounded-full border border-line" aria-hidden />
          <div className="absolute inset-[14%] rounded-full bg-tone-3/70" aria-hidden />
          <Image
            src="/hand.png"
            alt="Фирменная иллюстрация ВТОРНИК"
            width={928}
            height={1136}
            priority
            className="relative z-10 h-[78%] w-auto object-contain"
          />
        </motion.div>
      </div>
    </section>
  );
}
