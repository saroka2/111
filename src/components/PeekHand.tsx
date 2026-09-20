"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

/* ——— Настройки «руки-шпиона» (крути здесь) ——— */

/** Ширина на десктопе (px) */
const WIDTH_DESKTOP = 128;
/** Ширина на мобильных через CSS max — см. className */
const WIDTH_MOBILE_CLASS = "w-[88px] sm:w-[128px]";

/** Насколько спрятана (отрицательный % высоты): −70…−85 */
const HIDDEN_Y = -78;
/** Насколько выглядывает при скролле вниз (%): ~0 = почти наполовину из‑за края */
const PEEK_Y = -8;

/** Порог скорости скролла (px/s), ниже — считаем «стоит» */
const VELOCITY_DEADZONE = 80;
/** Макс. доп. поворот «недоумения» (±deg), поверх базовых 180° */
const TILT_MAX = 4;
/** Скорость, при которой наклон достигает максимума */
const TILT_AT_VELOCITY = 1200;

/** Spring: жёсткость 100–140, затухание 18–24 */
const SPRING = { stiffness: 120, damping: 20, mass: 0.9 };

export function PeekHand() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  const targetY = useMotionValue(HIDDEN_Y);
  const targetTilt = useMotionValue(0);

  const ySpring = useSpring(targetY, SPRING);
  const tiltSpring = useSpring(targetTilt, SPRING);

  const y = useTransform(ySpring, (v) => `${v}%`);
  const rotate = useTransform(tiltSpring, (v) => 180 + v);

  useMotionValueEvent(scrollVelocity, "change", (velocity) => {
    if (reduceMotion) return;

    const abs = Math.abs(velocity);
    const tilt =
      Math.sign(velocity) *
      Math.min(TILT_MAX, (abs / TILT_AT_VELOCITY) * TILT_MAX);

    if (velocity > VELOCITY_DEADZONE) {
      // Скролл вниз — выглядывает
      targetY.set(PEEK_Y);
      targetTilt.set(tilt);
    } else if (velocity < -VELOCITY_DEADZONE) {
      // Скролл вверх — прячется
      targetY.set(HIDDEN_Y);
      targetTilt.set(tilt);
    } else {
      // Стоит — прячется, наклон гаснет
      targetY.set(HIDDEN_Y);
      targetTilt.set(0);
    }
  });

  // Статичный вариант при reduced motion: слегка выглядывает, без анимации
  if (reduceMotion) {
    return (
      <div
        className={`pointer-events-none fixed top-0 right-[4%] z-30 select-none sm:right-[8%] ${WIDTH_MOBILE_CLASS}`}
        style={{ transform: `translateY(${PEEK_Y}%) rotate(180deg)` }}
        aria-hidden
      >
        <Image
          src="/hand-dark.png"
          alt=""
          width={WIDTH_DESKTOP}
          height={Math.round(WIDTH_DESKTOP * (1136 / 928))}
          className="h-auto w-full"
          priority={false}
        />
      </div>
    );
  }

  return (
    <motion.div
      className={`pointer-events-none fixed top-0 right-[4%] z-30 select-none sm:right-[8%] ${WIDTH_MOBILE_CLASS}`}
      style={{ y, rotate }}
      aria-hidden
    >
      <Image
        src="/hand-dark.png"
        alt=""
        width={WIDTH_DESKTOP}
        height={Math.round(WIDTH_DESKTOP * (1136 / 928))}
        className="h-auto w-full"
        priority={false}
      />
    </motion.div>
  );
}
