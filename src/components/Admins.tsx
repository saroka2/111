"use client";

import Image from "next/image";
import { useState } from "react";
import { admins } from "@/lib/content";
import type { AdminItem, MasterItem } from "@/lib/content";
import { BrandStar } from "./BrandStar";
import { MasterModal } from "./MasterModal";
import { Reveal } from "./Reveal";

function toMaster(admin: AdminItem): MasterItem {
  return {
    name: admin.name,
    photo: admin.photo,
    description: admin.description,
    role: "Администратор",
    group: "Администраторы",
    bookingUrl: null,
  };
}

export function Admins({ items }: { items: AdminItem[] }) {
  const [selected, setSelected] = useState<MasterItem | null>(null);

  if (!items.length) return null;

  return (
    <>
      <section
        id={admins.id}
        className="border-t border-line bg-bg px-5 py-16 sm:px-8 sm:py-20 lg:px-10"
        aria-labelledby="admins-title"
      >
        <div className="mx-auto max-w-[1280px]">
          <Reveal tone="fade-up" className="mx-auto max-w-xl text-center">
            <h2
              id="admins-title"
              className="font-display text-[clamp(1.35rem,2.8vw,1.9rem)] italic font-normal text-ink"
            >
              {admins.title}{" "}
              <BrandStar size="0.58em" variant={4} />
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">
              {admins.subtitle}
            </p>
          </Reveal>

          <ul className="mt-10 flex flex-wrap items-start justify-center gap-x-8 gap-y-8 sm:gap-x-12">
            {items.map((admin, i) => (
              <Reveal
                key={`${admin.name}-${i}`}
                as="li"
                tone="fade-up"
                delay={0.06 * i}
                className="flex w-[7.5rem] flex-col items-center text-center sm:w-[8.5rem]"
              >
                <button
                  type="button"
                  onClick={() => setSelected(toMaster(admin))}
                  className="group flex w-full flex-col items-center text-center outline-none"
                >
                  <span className="relative mb-3 block size-[7rem] overflow-hidden rounded-full bg-tone-3 ring-1 ring-line transition-[ring-color,transform] duration-300 group-hover:ring-line-hover group-focus-visible:ring-2 group-focus-visible:ring-ink sm:size-[8rem]">
                    {admin.photo ? (
                      <Image
                        src={admin.photo}
                        alt={admin.name}
                        fill
                        sizes="(max-width: 640px) 112px, 128px"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <Image
                        src="/hand.png"
                        alt=""
                        fill
                        sizes="(max-width: 640px) 112px, 128px"
                        className="object-contain p-6 opacity-35 grayscale"
                      />
                    )}
                  </span>
                  <span className="font-sans text-[14px] font-medium text-ink">
                    {admin.name}
                  </span>
                </button>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <MasterModal master={selected} onClose={() => setSelected(null)} />
    </>
  );
}
