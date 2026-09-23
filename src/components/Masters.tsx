"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Reveal } from "./Reveal";
import { RevealImage } from "./RevealImage";
import { masters } from "@/lib/content";

/* В чёрном баре → выглянула у блока → снова в бар */
const PEEK_Y = "0%";
const HIDDEN_Y = "-100%";
const SPRING = { stiffness: 120, damping: 24, mass: 0.8 };

export function Masters() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // От появления стыка снизу до ухода секции вверх
    offset: ["start 0.9", "end start"],
  });

  // Скрыта → выглядывает у «Руки, которым…» → прячется обратно в бар
  const yRaw = useTransform(
    scrollYProgress,
    [0, 0.2, 0.42, 0.72, 1],
    [HIDDEN_Y, PEEK_Y, PEEK_Y, HIDDEN_Y, HIDDEN_Y],
  );
  const y = useSpring(yRaw, SPRING);

  return (
    <section
      ref={sectionRef}
      id={masters.id}
      className="relative z-0 overflow-visible bg-stripes px-5 pb-24 pt-8 sm:px-8 sm:pb-28 sm:pt-10 lg:px-10 lg:pb-32 lg:pt-12"
      aria-labelledby="masters-title"
    >
      <motion.div
        className="pointer-events-none absolute left-4 top-0 -z-10 w-[min(38vw,200px)] max-w-none select-none sm:left-10 sm:w-[min(32vw,260px)] lg:left-16 lg:w-[280px]"
        style={reduceMotion ? { y: HIDDEN_Y } : { y }}
        aria-hidden
      >
        <Image
          src="/hand-peek.png"
          alt=""
          width={553}
          height={771}
          className="h-auto w-full"
          priority={false}
        />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-[1280px]">
        <Reveal tone="blur" className="max-w-xl sm:ml-auto sm:text-right">
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
