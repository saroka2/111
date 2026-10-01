import type { MasterItem } from "@/lib/content";
import { MasterCard } from "./MasterCard";
import { Reveal } from "./Reveal";

export function MastersGrid({ items }: { items: MasterItem[] }) {
  return (
    <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
      {items.map((master, i) => (
        <Reveal
          key={`${master.name}-${i}`}
          as="li"
          tone={i % 2 === 0 ? "fade-up" : "scale"}
          delay={0.1 * i}
        >
          <MasterCard master={master} index={i} />
        </Reveal>
      ))}
    </ul>
  );
}
