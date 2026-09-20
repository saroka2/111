"use client";

import Image, { type ImageProps } from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

type RevealImageProps = Omit<ImageProps, "alt"> & {
  alt: string;
  wrapClassName?: string;
  delay?: number;
};

export function RevealImage({
  wrapClassName = "",
  className = "",
  delay = 0,
  alt,
  ...imageProps
}: RevealImageProps) {
  const [ready, setReady] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    setReady(true);
  }, []);

  const animate = ready && !reduce;
  const isFill = imageProps.fill === true;

  return (
    <motion.div
      className={`overflow-hidden ${isFill ? "relative" : ""} ${wrapClassName}`}
      initial={animate ? { opacity: 0, scale: 1.04, y: 32 } : false}
      whileInView={animate ? { opacity: 1, scale: 1, y: 0 } : undefined}
      viewport={{ once: false, amount: 0.25, margin: "0px 0px -8% 0px" }}
      transition={{
        duration: 1.05,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
    >
      <motion.div
        className={isFill ? "absolute inset-0" : "h-full w-full"}
        initial={animate ? { scale: 1.1 } : false}
        whileInView={animate ? { scale: 1 } : undefined}
        viewport={{ once: false, amount: 0.25, margin: "0px 0px -8% 0px" }}
        transition={{
          duration: 1.4,
          ease: [0.22, 1, 0.36, 1],
          delay,
        }}
      >
        <Image alt={alt} className={className} {...imageProps} />
      </motion.div>
    </motion.div>
  );
}
