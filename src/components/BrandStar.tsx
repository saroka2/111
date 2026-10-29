import { Fragment, type ReactNode } from "react";

/** Набор рукописных звёзд — чистый силуэт без фона */
export const BRAND_STAR_VARIANTS = [
  "/stars/star-1.png",
  "/stars/star-2.png",
  "/stars/star-3.png",
  "/stars/star-4.png",
  "/stars/star-5.png",
  "/stars/star-6.png",
] as const;

const ROTATIONS = [0, -18, 12, -8, 22, -14] as const;

type BrandStarProps = {
  className?: string;
  size?: string;
  variant?: number;
};

/**
 * Фирменная звезда без фона: PNG с альфой + mask,
 * чтобы не было «квадратика» вокруг.
 */
export function BrandStar({
  className = "",
  size = "0.62em",
  variant = 0,
}: BrandStarProps) {
  const i =
    ((variant % BRAND_STAR_VARIANTS.length) + BRAND_STAR_VARIANTS.length) %
    BRAND_STAR_VARIANTS.length;
  const src = BRAND_STAR_VARIANTS[i];
  const rotate = ROTATIONS[i];

  return (
    <span
      aria-hidden
      className={`relative inline-block shrink-0 align-[-0.12em] ${className}`}
      style={{
        width: size,
        height: size,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-contain select-none"
        style={{ background: "transparent" }}
      />
    </span>
  );
}

export function withBrandStars(text: string, starSize = "0.62em"): ReactNode {
  const parts = text.split("*");
  if (parts.length === 1) return text;

  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 ? (
        <BrandStar size={starSize} variant={i} />
      ) : null}
    </Fragment>
  ));
}
