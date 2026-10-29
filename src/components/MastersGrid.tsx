"use client";

import Image from "next/image";
import { useContext, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { MasterItem } from "@/lib/content";
import { BrandStar } from "./BrandStar";
import { MasterModal } from "./MasterModal";
import { MastersMaskSlotContext } from "./Masters";
import { Reveal } from "./Reveal";

function groupMasters(items: MasterItem[]) {
  const order: string[] = [];
  const buckets = new Map<string, MasterItem[]>();

  for (const master of items) {
    const key = master.group?.trim() || "Мастера";
    if (!buckets.has(key)) {
      buckets.set(key, []);
      order.push(key);
    }
    buckets.get(key)!.push(master);
  }

  return order.map((group) => ({ group, items: buckets.get(group)! }));
}

function GroupTitle({
  group,
  tone,
  variant = 0,
}: {
  group: string;
  tone: "ink" | "reveal";
  variant?: number;
}) {
  const title = tone === "ink" ? "text-ink" : "masters-hand-text";

  return (
    <h3
      className={`mb-6 ml-auto w-[min(62%,22rem)] max-w-full text-right font-display text-[clamp(1.35rem,2.6vw,1.85rem)] italic font-normal sm:w-auto sm:max-w-none ${title}`}
    >
      {group}{" "}
      <BrandStar size="0.58em" variant={variant} />
    </h3>
  );
}

/** Невидимый спейсер той же высоты, что сетка кружков — чтобы заголовки в маске совпали. */
function GridSpacer({ count }: { count: number }) {
  return (
    <ul
      className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8"
      aria-hidden
    >
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="flex flex-col items-center">
          <span className="mb-3 block size-[min(42vw,148px)] sm:size-[160px] lg:size-[172px]" />
          <span className="h-[1.25rem] w-16 sm:h-[1.5rem]" />
          <span className="mt-0.5 h-[2rem] w-20" />
        </li>
      ))}
    </ul>
  );
}

export function MastersGrid({ items }: { items: MasterItem[] }) {
  const groups = useMemo(() => groupMasters(items), [items]);
  const [selected, setSelected] = useState<MasterItem | null>(null);
  const maskSlot = useContext(MastersMaskSlotContext);

  const revealLayer =
    maskSlot &&
    createPortal(
      <div className="mt-14 space-y-14" aria-hidden>
        {groups.map((section, gi) => (
          <div key={`reveal-${section.group}`}>
            <GroupTitle
              group={section.group}
              tone="reveal"
              variant={gi + 1}
            />
            <GridSpacer count={section.items.length} />
          </div>
        ))}
      </div>,
      maskSlot,
    );

  return (
    <>
      <div className="mt-14 space-y-14">
        {groups.map((section, gi) => (
          <div key={section.group}>
            <Reveal tone="fade-up">
              <GroupTitle
                group={section.group}
                tone="ink"
                variant={gi + 1}
              />
            </Reveal>

            {/* z-40 выше руки (z-20) и маски текста (z-30) — рука уходит за фото */}
            <ul className="relative z-40 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
              {section.items.map((master, i) => (
                <Reveal
                  key={`${section.group}-${master.name}-${i}`}
                  as="li"
                  tone="fade-up"
                  delay={0.05 * (i % 4)}
                >
                  <button
                    type="button"
                    onClick={() => setSelected(master)}
                    className="group relative z-40 flex w-full flex-col items-center text-center outline-none"
                  >
                    <span className="relative mb-3 block size-[min(42vw,148px)] overflow-hidden rounded-full bg-bg/80 ring-1 ring-line transition-[ring-color,transform] duration-300 group-hover:ring-line-hover group-focus-visible:ring-2 group-focus-visible:ring-ink sm:size-[160px] lg:size-[172px]">
                      {master.photo ? (
                        <Image
                          src={master.photo}
                          alt={master.name}
                          fill
                          sizes="(max-width: 640px) 42vw, (max-width: 1024px) 160px, 172px"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <Image
                          src="/hand.png"
                          alt=""
                          fill
                          sizes="(max-width: 640px) 42vw, (max-width: 1024px) 160px, 172px"
                          className="object-contain p-8 opacity-40 grayscale"
                        />
                      )}
                    </span>
                    <span className="font-sans text-[15px] font-medium text-ink sm:text-base">
                      {master.name}
                    </span>
                    <span className="mt-0.5 max-w-[11rem] text-[12px] leading-snug text-ink-soft sm:text-[13px]">
                      {master.role}
                    </span>
                  </button>
                </Reveal>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {revealLayer}
      <MasterModal master={selected} onClose={() => setSelected(null)} />
    </>
  );
}
