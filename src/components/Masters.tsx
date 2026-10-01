"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { masters } from "@/lib/content";
import type { ReactNode } from "react";

/* 0 — рука на месте, -1 — целиком в чёрном баре */
const SHIFT = [0, 0.2, 0.42, 0.72, 1];
const SHIFT_Y = [-1, 0, 0, -1, -1];
const SPRING = { stiffness: 120, damping: 24, mass: 0.8 };

function MastersHeading({
  id,
  tone,
}: {
  id?: string;
  tone: "ink" | "white";
}) {
  const title = tone === "ink" ? "text-ink" : "text-white";
  const subtitle = tone === "ink" ? "text-ink-soft" : "text-white";

  return (
    <div className="max-w-xl sm:ml-auto sm:text-right">
      <h2
        id={id}
        className={`font-sans text-[clamp(1.85rem,3.8vw,3rem)] font-medium leading-[1.15] tracking-[-0.02em] text-balance ${title}`}
      >
        {masters.title}
      </h2>
      <p className={`mt-4 text-[15px] ${subtitle}`}>{masters.subtitle}</p>
    </div>
  );
}

export function Masters({ children }: { children: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const handRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const handHeight = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.9", "end start"],
  });

  const shift = useTransform(scrollYProgress, SHIFT, SHIFT_Y);
  const yRaw = useTransform(() => {
    const height = handHeight.get();
    if (reduceMotion) return -height;
    return shift.get() * height;
  });
  const y = useSpring(yRaw, SPRING);
  const handY = useTransform(y, (value) => `${value}px`);

  useLayoutEffect(() => {
    const el = handRef.current;
    if (!el) return;
    const measure = () => handHeight.set(el.offsetHeight || 0);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [handHeight]);

  return (
    <section
      ref={sectionRef}
      id={masters.id}
      className="relative isolate z-0 overflow-visible bg-stripes px-5 pb-24 pt-8 sm:px-8 sm:pb-28 sm:pt-10 lg:px-10 lg:pb-32 lg:pt-12"
      aria-labelledby="masters-title"
    >
      <div className="relative z-10 mx-auto max-w-[1280px]">
        <MastersHeading id="masters-title" tone="ink" />
      </div>

      <motion.div
        ref={handRef}
        className="pointer-events-none absolute left-4 top-0 z-20 w-[min(38vw,200px)] max-w-none select-none sm:left-10 sm:w-[min(32vw,260px)] lg:left-16 lg:w-[280px]"
        style={{ y }}
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

      <motion.div
        className="masters-hand-mask pointer-events-none absolute inset-0 z-30"
        style={{ ["--hand-y" as string]: handY }}
        aria-hidden
      >
        <div className="mx-auto max-w-[1280px] px-5 pt-8 sm:px-8 sm:pt-10 lg:px-10 lg:pt-12">
          <MastersHeading tone="white" />
        </div>
      </motion.div>

      <div className="relative z-40 mx-auto min-w-0 max-w-[1280px]">{children}</div>
    </section>
  );
}
