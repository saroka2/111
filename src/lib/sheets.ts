import type { MasterItem, OfferItem, ServiceItem, SiteInfo } from "./content";
import { DEFAULT_INFO } from "./content";

export type SheetData = {
  updated: string;
  services: ServiceItem[];
  masters: MasterItem[];
  offers: OfferItem[];
  salon: string[];
  info: SiteInfo;
};

const FILE_ID = /\/file\/d\/([^/?#]+)/;
const OPEN_ID = /[?&]id=([^&#]+)/;

/** Google Drive «по ссылке» → прямая картинка. Остальные http(s) не трогаем. */
export function normalizeImageUrl(url: string): string | null {
  const value = url.trim();
  if (!value) return null;

  let id: string | undefined;
  try {
    const parsed = new URL(value);
    if (parsed.hostname === "drive.google.com") {
      id = parsed.pathname.match(FILE_ID)?.[1] ?? parsed.search.match(OPEN_ID)?.[1];
    }
  } catch {
    return null;
  }

  if (id) return `https://lh3.googleusercontent.com/d/${id}=w1200`;
  if (/^https?:\/\//i.test(value)) return value;
  return null;
}

function text(value: unknown): string {
  if (value == null) return "";
  return String(value).trim();
}

function asList(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function normalize(raw: unknown): SheetData | null {
  if (!raw || typeof raw !== "object") return null;
  const body = raw as Record<string, unknown>;

  const services = asList(body.services)
    .map((row) => {
      const item = row as Record<string, unknown>;
      const order = Number(item.order);
      return {
        order: Number.isFinite(order) ? order : 0,
        title: text(item.title),
        description: text(item.description),
        duration: text(item.duration),
        price: text(item.price),
      };
    })
    .filter((item) => item.title)
    .sort((a, b) => a.order - b.order)
    .map(({ title, description, duration, price }) => ({
      title,
      description,
      duration,
      price,
    }));

  const masters = asList(body.masters)
    .map((row) => {
      const item = row as Record<string, unknown>;
      const order = Number(item.order);
      return {
        order: Number.isFinite(order) ? order : 0,
        name: text(item.name),
        role: text(item.role),
        photo: normalizeImageUrl(text(item.photo)),
      };
    })
    .filter((item) => item.name)
    .sort((a, b) => a.order - b.order)
    .map(({ name, role, photo }) => ({ name, role, photo }));

  const offers = asList(body.offers)
    .map((row) => {
      const item = row as Record<string, unknown>;
      const order = Number(item.order);
      return {
        order: Number.isFinite(order) ? order : 0,
        title: text(item.title),
        description: text(item.description),
        price: text(item.price),
        photo: normalizeImageUrl(text(item.photo)),
      };
    })
    .filter((item) => item.title)
    .sort((a, b) => a.order - b.order)
    .map(({ title, description, price, photo }) => ({
      title,
      description,
      price,
      photo,
    }));

  const salon = asList(body.salon)
    .map((row) => {
      const item = row as Record<string, unknown>;
      const order = Number(item.order);
      return {
        order: Number.isFinite(order) ? order : 0,
        photo: normalizeImageUrl(text(item.photo)),
      };
    })
    .filter((item) => item.photo)
    .sort((a, b) => a.order - b.order)
    .slice(0, 3)
    .map((item) => item.photo as string);

  return {
    updated: text(body.updated),
    services,
    masters,
    offers,
    salon,
    info: resolveInfo(body.info),
  };
}

function toTel(phone: string): string {
  const compact = phone.replace(/[^\d+]/g, "");
  return compact ? `tel:${compact}` : DEFAULT_INFO.phoneHref;
}

function socialLabel(href: string, raw: string): string {
  const cleaned = raw.replace(href, "").replace(/[|–—]+/g, " ").trim();
  if (cleaned) return cleaned;
  try {
    const host = new URL(href).hostname.replace(/^www\./, "");
    if (host.includes("t.me") || host.includes("telegram")) return "Telegram";
    if (host.includes("instagram")) return "Instagram*";
    if (host === "vk.com" || host === "vk.ru" || host.endsWith(".vk.com")) return "VK";
    return host;
  } catch {
    return raw.trim();
  }
}

function socialFromText(value: string): { label: string; href: string } {
  const url = value.match(/https?:\/\/\S+/i)?.[0]?.replace(/[),.;]+$/, "") ?? "";
  return { label: socialLabel(url, value), href: url || "#" };
}

function parseSocials(cells: unknown[]): SiteInfo["socials"] {
  const links: SiteInfo["socials"] = [];
  for (const cell of cells) {
    if (cell && typeof cell === "object") {
      const item = cell as Record<string, unknown>;
      const href = text(item.href);
      const label = text(item.label) || (href ? socialLabel(href, href) : "");
      if (label) links.push({ label, href: href || "#" });
      continue;
    }

    const value = text(cell);
    if (!value) continue;
    const urls = value.match(/https?:\/\/\S+/gi) ?? [];
    if (urls.length > 1) {
      for (const url of urls) links.push(socialFromText(url));
      continue;
    }
    if (urls.length === 0 && /[,;\n]/.test(value)) {
      for (const piece of value.split(/[,;\n]+/)) {
        const bit = piece.trim();
        if (bit) links.push(socialFromText(bit));
      }
      continue;
    }
    links.push(socialFromText(value));
  }
  return links.filter((item) => item.label);
}

function resolveInfo(raw: unknown): SiteInfo {
  const info: SiteInfo = {
    address: DEFAULT_INFO.address,
    phone: DEFAULT_INFO.phone,
    phoneHref: DEFAULT_INFO.phoneHref,
    email: DEFAULT_INFO.email,
    hours: DEFAULT_INFO.hours.map((row) => ({ ...row })),
    socials: DEFAULT_INFO.socials.map((row) => ({ ...row })),
  };
  if (!raw || typeof raw !== "object") return info;

  const item = raw as Record<string, unknown>;
  const address = text(item.address);
  const email = text(item.email);
  const phone = text(item.phone);
  if (address) info.address = address;
  if (email) info.email = email;
  if (phone) {
    info.phone = phone;
    info.phoneHref = toTel(phone);
  }

  const hours = asList(item.hours)
    .map((row) => {
      const entry = row as Record<string, unknown>;
      return { days: text(entry.days), time: text(entry.time) };
    })
    .filter((row) => row.days);
  if (hours.some((row) => row.time)) {
    info.hours = hours.map((row) => ({
      days: row.days,
      time: row.time || "выходной",
    }));
  }

  const socialCells = asList(item.socials);
  if (socialCells.length > 0) info.socials = parseSocials(socialCells);

  return info;
}

export async function getSheetData(): Promise<SheetData | null> {
  const url = process.env.GOOGLE_SHEETS_URL?.trim();
  if (!url) return null;

  try {
    const response = await fetch(url, { next: { revalidate: 60 } });
    if (!response.ok) return null;
    return normalize(await response.json());
  } catch {
    return null;
  }
}
