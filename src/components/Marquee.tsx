import { marquee } from "@/lib/content";

export function Marquee() {
  const items = [...marquee, ...marquee, ...marquee, ...marquee];

  return (
    <div
      className="max-w-full overflow-hidden border-t border-line bg-tone-3 py-4"
      aria-hidden
    >
      <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap px-4">
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-8 text-[11px] uppercase tracking-[0.28em] text-ink-soft"
          >
            {item}
            <span className="text-[14px] leading-none text-muted">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
