import { contacts, footer, nav, site, type SiteInfo } from "@/lib/content";

export function Footer({ info }: { info: SiteInfo }) {
  return (
    <footer id={contacts.id} className="border-t border-line bg-bg px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
      <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[1.2fr_1fr_1fr] lg:gap-16">
        <div>
          <p className="text-[13px] font-medium uppercase tracking-logo text-ink pr-[0.38em]">
            {site.name}
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
            {site.tagline} ✦ пространство, где важна только ты.
          </p>
        </div>

        <div>
          <p className="mb-4 text-[11px] uppercase tracking-[0.18em] text-muted">
            Навигация
          </p>
          <ul className="space-y-2.5">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-flex min-h-11 items-center text-sm text-ink-soft transition-colors hover:text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-[11px] uppercase tracking-[0.18em] text-muted">
            Контакты
          </p>
          <ul className="space-y-2.5 text-sm text-ink-soft">
            <li>{info.address}</li>
            <li>
              <a href={info.phoneHref} className="inline-flex min-h-11 items-center transition-colors hover:text-ink">
                {info.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${info.email}`}
                className="inline-flex min-h-11 items-center transition-colors hover:text-ink"
              >
                {info.email}
              </a>
            </li>
          </ul>
          <ul className="mt-5 space-y-1.5 text-sm text-ink-soft">
            {info.hours.map((row) => (
              <li key={row.days} className="flex justify-between gap-4 max-w-[220px]">
                <span>{row.days}</span>
                <span className="text-ink">{row.time}</span>
              </li>
            ))}
          </ul>
          <ul className="mt-5 flex flex-wrap gap-4">
            {info.socials.map((s) => (
              <li key={`${s.label}-${s.href}`}>
                <a
                  href={s.href}
                  className="inline-flex min-h-11 items-center text-sm text-ink underline-offset-4 hover:underline"
                  {...(s.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          {info.socials.some((s) => s.label.includes("*")) ? (
            <p className="mt-3 max-w-xs text-[11px] leading-relaxed text-muted">
              {contacts.note}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-[1280px] flex-col gap-2 border-t border-line pt-6 text-[11px] text-muted sm:flex-row sm:justify-between">
        <p>{footer.copy}</p>
        <p>
          {footer.legal} · {footer.made}
        </p>
      </div>
    </footer>
  );
}
