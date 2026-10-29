"use client";

import { BookingButton } from "./BookingButton";
import { Reveal } from "./Reveal";
import { WriteButton } from "./WriteButton";
import { cta, type WriteChannel } from "@/lib/content";

export function Cta({
  writeChannels,
}: {
  writeChannels?: WriteChannel[];
}) {
  return (
    <section
      id={cta.id}
      className="bg-dark px-5 py-24 text-on-dark sm:px-8 sm:py-28 lg:px-10 lg:py-32"
      aria-labelledby="cta-title"
    >
      <div className="mx-auto max-w-[820px] text-center">
        <Reveal tone="blur">
          <h2
            id="cta-title"
            className="font-sans text-[clamp(1.9rem,4.2vw,3.4rem)] font-medium leading-[1.15] tracking-[-0.02em] text-balance"
          >
            {cta.titleBefore}{" "}
            <span className="font-display italic font-normal">{cta.titleAccent}</span>
            <span className="mt-2 block text-[0.85em] font-normal text-on-dark-soft">
              {cta.titleAfter}
            </span>
          </h2>
        </Reveal>
        <Reveal
          tone="fade-up"
          delay={0.15}
          className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center"
        >
          <BookingButton variant="solid-light" className="w-full sm:w-auto">
            {cta.primary}
          </BookingButton>
          <WriteButton
            channels={writeChannels}
            showIcon={false}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-on-dark/35 bg-transparent px-7 py-3 text-[12px] tracking-[0.04em] text-on-dark transition-colors duration-300 hover:border-on-dark sm:w-auto"
          >
            {cta.secondary}
          </WriteButton>
        </Reveal>
      </div>
    </section>
  );
}
