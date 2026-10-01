import type { MasterItem } from "@/lib/content";
import { RevealImage } from "./RevealImage";

const frame =
  "relative mb-5 aspect-[3/4] overflow-hidden rounded-[1.25rem] bg-bg/80";

export function MasterCard({ master, index }: { master: MasterItem; index: number }) {
  return (
    <article>
      {master.photo ? (
        <RevealImage
          src={master.photo}
          alt={master.name}
          fill
          sizes="(max-width: 768px) 82vw, 320px"
          wrapClassName={frame}
          className="object-cover"
          delay={0.05 * index}
        />
      ) : (
        <RevealImage
          src="/hand.png"
          alt=""
          fill
          sizes="(max-width: 768px) 82vw, 320px"
          wrapClassName={frame}
          className="object-contain p-10 opacity-40 grayscale"
          delay={0.05 * index}
        />
      )}
      <span className="sr-only">Портрет</span>
      <h3 className="font-sans text-xl font-medium text-ink">{master.name}</h3>
      <p className="mt-1 text-sm text-ink-soft">{master.role}</p>
    </article>
  );
}
