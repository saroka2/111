"use client";

import Image from "next/image";
import { Reveal } from "./Reveal";
import { CONTACTS, location, site } from "@/lib/content";

function FramePhoto({
  src,
  sizes,
  pad = "p-10",
  priority = false,
}: {
  src: string | null;
  sizes: string;
  pad?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt="Интерьер салона ВТОРНИК"
        fill
        sizes={sizes}
        className="object-cover"
        priority={priority}
      />
    );
  }

  return (
    <Image
      src="/hand.png"
      alt=""
      fill
      sizes={sizes}
      className={`object-contain opacity-35 grayscale ${pad}`}
    />
  );
}

function PhotoFrame({
  src,
  className,
  sizes,
  priority,
}: {
  src: string | null;
  className: string;
  sizes: string;
  priority?: boolean;
}) {
  if (!src) return null;

  return (
    <div
      className={`relative overflow-hidden rounded-[1.1rem] bg-tone-3 sm:rounded-[1.25rem] ${className}`}
    >
      <FramePhoto src={src} sizes={sizes} priority={priority} />
    </div>
  );
}

export function Location({
  photos = [],
  address = CONTACTS.address,
  addressNote = CONTACTS.addressNote,
}: {
  photos?: string[];
  address?: string;
  addressNote?: string;
}) {
  const [p0, p1, p2, p3, p4, p5] = [
    photos[0] ?? null,
    photos[1] ?? null,
    photos[2] ?? null,
    photos[3] ?? null,
    photos[4] ?? null,
    photos[5] ?? null,
  ];

  const copy = (
    <div className="min-w-0">
      <p className="text-[13px] font-medium uppercase tracking-[0.22em] text-ink">
        {site.name}
      </p>
      <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">
        {location.text}
      </p>
      <p className="mt-4 text-[13px] text-muted sm:whitespace-nowrap">
        {address.includes(CONTACTS.city) ? address : `${CONTACTS.city}, ${address}`}
        {addressNote ? (
          <span className="text-[12px]"> ({addressNote})</span>
        ) : null}
      </p>
    </div>
  );

  return (
    <section
      id={location.id}
      className="bg-bg px-5 py-16 sm:px-8 sm:py-24 lg:px-10 lg:py-28"
      aria-labelledby="location-title"
    >
      <div className="mx-auto max-w-[1280px]">
        <Reveal tone="blur" className="max-w-4xl">
          <h2
            id="location-title"
            className="font-display text-[clamp(1.25rem,5.2vw,2.4rem)] font-normal uppercase leading-[1.25] tracking-[0.06em] text-ink text-balance"
          >
            {location.title}
          </h2>
        </Reveal>

        {/* Mobile / tablet */}
        <div className="mt-8 space-y-3 lg:hidden">
          <Reveal tone="fade-up" delay={0.05}>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <PhotoFrame
                src={p0}
                className="col-span-2 aspect-[16/10] sm:aspect-[2/1]"
                sizes="100vw"
                priority
              />
              <PhotoFrame src={p1} className="aspect-[3/4]" sizes="50vw" />
              <PhotoFrame src={p2} className="aspect-[3/4]" sizes="50vw" />
            </div>
          </Reveal>

          {/* Текст между двумя одинаковыми вертикальными фото */}
          <Reveal tone="fade-up" delay={0.1}>
            {p3 || p4 ? (
              <div className="grid grid-cols-[1fr_1.35fr_1fr] items-start gap-2.5 sm:gap-3">
                {p3 ? (
                  <PhotoFrame src={p3} className="aspect-[3/4]" sizes="30vw" />
                ) : (
                  <div />
                )}
                <div className="flex flex-col justify-center self-center py-1">
                  {copy}
                </div>
                {p4 ? (
                  <PhotoFrame src={p4} className="aspect-[3/4]" sizes="30vw" />
                ) : (
                  <div />
                )}
              </div>
            ) : (
              <div className="py-1">{copy}</div>
            )}
          </Reveal>

        </div>

        {/* Desktop: верхний ряд — одинаковые кадры; текст — между двумя фото одного размера */}
        <div className="mt-12 hidden space-y-5 lg:block">
          <Reveal tone="fade-up" delay={0.06}>
            <div className="grid grid-cols-3 items-start gap-5">
              <PhotoFrame src={p0} className="aspect-[3/4]" sizes="30vw" priority />
              <PhotoFrame src={p1} className="aspect-[3/4]" sizes="30vw" />
              <PhotoFrame src={p2} className="aspect-[3/4]" sizes="30vw" />
            </div>
          </Reveal>

          <Reveal tone="fade-up" delay={0.12}>
            <div className="grid grid-cols-[1fr_1.35fr_1fr] items-center gap-5">
              {/* Слева от текста — тот же размер, что фото справа */}
              <PhotoFrame
                src={p3 ?? p5}
                className="aspect-[3/4]"
                sizes="28vw"
              />
              <div className="px-2">{copy}</div>
              <PhotoFrame src={p4} className="aspect-[3/4]" sizes="28vw" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
