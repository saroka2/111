"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

export type RevealTone =
  | "fade-up"
  | "fade"
  | "fade-down"
  | "slide-left"
  | "slide-right"
  | "scale"
  | "blur";

const tones: Record<RevealTone, Variants> = {
  "fade-up": {
    hidden: { opacity: 0, y: 36 },
    visible: { opacity: 1, y: 0 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "fade-down": {
    hidden: { opacity: 0, y: -28 },
    visible: { opacity: 1, y: 0 },
  },
  "slide-left": {
    hidden: { opacity: 0, x: -16 },
    visible: { opacity: 1, x: 0 },
  },
  "slide-right": {
    hidden: { opacity: 0, x: 16 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
  },
  blur: {
    hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  tone?: RevealTone;
  duration?: number;
  amount?: number;
  as?: "div" | "section" | "article" | "li" | "header" | "footer" | "p" | "h2" | "h3" | "ul";
};

export function Reveal({
  children,
  className,
  delay = 0,
  tone = "fade-up",
  duration = 0.8,
  amount = 0.22,
  as = "div",
}: RevealProps) {
  const [ready, setReady] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    setReady(true);
  }, []);

  const MotionTag = motion[as];
  const animate = ready && !reduce;

  return (
    <MotionTag
      className={className}
      initial={animate ? "hidden" : false}
      whileInView={animate ? "visible" : undefined}
      viewport={{ once: false, amount, margin: "0px 0px -8% 0px" }}
      variants={tones[tone]}
      transition={{
        duration,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
    >
      {children}
    </MotionTag>
  );
}
