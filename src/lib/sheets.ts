import type {
  AdminItem,
  MasterItem,
  OfferItem,
  ServiceItem,
  SiteInfo,
} from "./content";
import { CONTACTS, DEFAULT_INFO } from "./content";

export type SheetData = {
  updated: string;
  services: ServiceItem[];
  masters: MasterItem[];
  offers: OfferItem[];
  admins: AdminItem[];
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
  let cleaned = value;
  try {
    const parsed = new URL(value);
    if (parsed.hostname === "drive.google.com") {
      id = parsed.pathname.match(FILE_ID)?.[1] ?? parsed.search.match(OPEN_ID)?.[1];
    }
    // Pinimg: убираем служебные query (?nii=t и т.п.)
    if (parsed.hostname.includes("pinimg.com")) {
      parsed.search = "";
      cleaned = parsed.toString();
    }
  } catch {
    return null;
  }

  if (id) return `https://lh3.googleusercontent.com/d/${id}=w1200`;
  if (/^https?:\/\//i.test(cleaned)) return cleaned;
  return null;
}

function text(value: unknown): string {
  if (value == null) return "";
  return String(value).trim();
}

function asList(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

/** Нормализация к 11 цифрам вида 7XXXXXXXXXX. */
export function normalizeRuPhoneDigits(phone: string): string | null {
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("8")) {
    digits = `7${digits.slice(1)}`;
  }
  if (digits.length === 10) digits = `7${digits}`;
  if (digits.length === 11 && digits.startsWith("7")) return digits;
  return null;
}

/** Российский мобильный: 11 цифр, начинается с 7 (8… тоже ок). */
export function isValidRuPhone(phone: string): boolean {
  return Boolean(normalizeRuPhoneDigits(phone));
}

function toTel(phone: string): string {
  const digits = normalizeRuPhoneDigits(phone);
  if (digits) return `tel:+${digits}`;
  return CONTACTS.phoneHref;
}

function httpUrl(value: string): string | null {
  const raw = value.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol === "http:" || url.protocol === "https:") return url.toString();
  } catch {
    return null;
  }
  return null;
}

const KNOWN_SERVICE_GROUPS = new Set(["Волосы", "Ногти", "Брови и ресницы"]);

/** Похоже на тестовый мусор в «описание», а не на текст для сайта. */
function looksLikeJunkDescription(value: string) {
  const v = value.trim();
  if (!v) return true;
  if (v.length <= 12 && /^[\d\s]+$/.test(v)) return true;
  if (v.length <= 40 && /^(ывп|йцу|asdf|test|тест)/i.test(v)) return true;
  if (/ывп{2,}/i.test(v)) return true;
  return false;
}

/** Если в «группа» случайно попало длинное описание — чиним. */
function healServiceFields(title: string, groupRaw: string, descriptionRaw: string) {
  let group = groupRaw;
  let description = descriptionRaw;

  const groupLooksLikeText =
    group.length > 28 ||
    /[.,!?]/.test(group) ||
    (group.split(/\s+/).length >= 5 && !KNOWN_SERVICE_GROUPS.has(group));

  if (groupLooksLikeText && !KNOWN_SERVICE_GROUPS.has(group)) {
    // длинный текст из «группа» — это описание; мусор в «описание» игнорируем
    if (!description || looksLikeJunkDescription(description)) {
      description = group;
    }
    group = "";
  }

  if (!KNOWN_SERVICE_GROUPS.has(group)) {
    group = inferServiceGroup(title) || group || "Волосы";
  }

  return { group, description };
}

function inferServiceGroup(title: string): string {
  const t = title.toLowerCase();
  if (/маник|педик|ногт/.test(t)) return "Ногти";
  if (/бров|ресниц/.test(t)) return "Брови и ресницы";
  if (/стриж|окраш|уход|волос|колор|мелир/.test(t)) return "Волосы";
  return "";
}

/** Пока в таблице нет «группа» — раскладываем по роли. */
function inferMasterGroup(role: string): string {
  const r = role.toLowerCase();
  if (/nail|ногт|маник|педик/.test(r)) return "Ногтевой сервис";
  if (/бров|ресниц/.test(r)) return "Брови и ресницы";
  if (/визаж|makeup|макияж/.test(r)) return "Визаж";
  if (/космет/.test(r)) return "Косметология";
  if (/стилист|колор|цвет|форм|парик/.test(r)) return "Парикмахерский зал";
  return "Мастера";
}

function normalize(raw: unknown): SheetData | null {
  if (!raw || typeof raw !== "object") return null;
  const body = raw as Record<string, unknown>;

  const services = asList(body.services)
    .map((row) => {
      const item = row as Record<string, unknown>;
      const order = Number(item.order);
      const title = text(item.title);
      const healed = healServiceFields(
        title,
        text(item.group),
        text(item.description),
      );
      return {
        order: Number.isFinite(order) ? order : 0,
        title,
        description: healed.description,
        duration: text(item.duration),
        price: text(item.price),
        group: healed.group,
      };
    })
    .filter((item) => item.title)
    .sort((a, b) => a.order - b.order)
    .map(({ title, description, duration, price, group }) => ({
      title,
      description,
      duration,
      price,
      group,
    }));

  const masters = asList(body.masters)
    .map((row) => {
      const item = row as Record<string, unknown>;
      const order = Number(item.order);
      const role = text(item.role);
      const groupRaw = text(item.group);
      return {
        order: Number.isFinite(order) ? order : 0,
        name: text(item.name),
        role,
        group: groupRaw && groupRaw !== "Мастера" ? groupRaw : inferMasterGroup(role),
        description: text(item.description),
        photo: normalizeImageUrl(text(item.photo)),
        bookingUrl: httpUrl(text(item.bookingUrl) || text(item.booking_url)),
      };
    })
    .filter((item) => item.name)
    .sort((a, b) => a.order - b.order)
    .map(({ name, role, group, description, photo, bookingUrl }) => ({
      name,
      role,
      group,
      description,
      photo,
      bookingUrl,
    }));

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

  const admins = asList(body.admins)
    .map((row) => {
      const item = row as Record<string, unknown>;
      const order = Number(item.order);
      return {
        order: Number.isFinite(order) ? order : 0,
        name: text(item.name),
        photo: normalizeImageUrl(text(item.photo)),
        description: text(item.description),
      };
    })
    .filter((item) => item.name)
    .sort((a, b) => a.order - b.order)
    .map(({ name, photo, description }) => ({ name, photo, description }));

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
    .slice(0, 6)
    .map((item) => item.photo as string);

  return {
    updated: text(body.updated),
    services,
    masters,
    offers,
    admins,
    salon,
    info: resolveInfo(body.info),
  };
}

function socialLabel(href: string, raw: string): string {
  const cleaned = raw.replace(href, "").replace(/[|–—]+/g, " ").trim();
  if (cleaned) return cleaned;
  try {
    const host = new URL(href).hostname.replace(/^www\./, "");
    if (host.includes("t.me") || host.includes("telegram")) return "Telegram";
    if (host.includes("instagram")) return "Instagram*";
    if (host.includes("wa.me") || host.includes("whatsapp")) return "WhatsApp*";
    if (host === "max.ru" || host.endsWith(".max.ru")) return "Max";
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
    addressNote: DEFAULT_INFO.addressNote,
    phone: DEFAULT_INFO.phone,
    phoneHref: DEFAULT_INFO.phoneHref,
    email: DEFAULT_INFO.email,
    telegram: DEFAULT_INFO.telegram,
    max: DEFAULT_INFO.max,
    whatsapp: DEFAULT_INFO.whatsapp,
    hoursText: DEFAULT_INFO.hoursText,
    hours: DEFAULT_INFO.hours.map((row) => ({ ...row })),
    socials: DEFAULT_INFO.socials.map((row) => ({ ...row })),
    messengers: DEFAULT_INFO.messengers.map((row) => ({ ...row })),
  };
  if (!raw || typeof raw !== "object") return info;

  const item = raw as Record<string, unknown>;
  const address = text(item.address);
  const addressNote = text(item.addressNote) || text(item.address_note);
  const email = text(item.email);
  const phone = text(item.phone);
  const telegram = text(item.telegram);
  const hoursText = text(item.hoursText) || text(item.hours_text);

  if (address) info.address = address;
  if (addressNote) info.addressNote = addressNote;
  if (email) info.email = email;
  if (hoursText) info.hoursText = hoursText;

  if (phone && isValidRuPhone(phone)) {
    info.phone = phone.includes("(") || phone.includes(" ")
      ? phone
      : formatPhoneDisplay(phone);
    info.phoneHref = toTel(phone);
  }

  const tg = httpUrl(telegram);
  if (tg) info.telegram = tg;

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

  // Соцсети — как в таблице (Telegram / VK / Instagram*), без фильтров.
  const socialCells = asList(item.socials);
  if (socialCells.length > 0) {
    info.socials = parseSocials(socialCells);
    const tgSocial = info.socials.find((s) =>
      /telegram|t\.me/i.test(`${s.label} ${s.href}`),
    );
    const tgFromSocials = tgSocial ? httpUrl(tgSocial.href) : "";
    if (tgFromSocials) info.telegram = tgFromSocials;
  } else if (tg) {
    const hasTg = info.socials.some((s) =>
      /telegram|t\.me/i.test(`${s.label} ${s.href}`),
    );
    if (!hasTg) info.socials = [{ label: "Telegram", href: tg }, ...info.socials];
    else {
      info.socials = info.socials.map((s) =>
        /telegram|t\.me/i.test(`${s.label} ${s.href}`) ? { ...s, href: tg } : s,
      );
    }
  }

  // Месенджеры — колонка «Месенджеры» для кнопки «Написать»
  const messengerCells = asList(item.messengers);
  if (messengerCells.length > 0) {
    info.messengers = parseSocials(messengerCells);
    for (const m of info.messengers) {
      const href = httpUrl(m.href) || "";
      const hay = `${m.label} ${m.href}`;
      if (/telegram|t\.me/i.test(hay) && href) info.telegram = href;
      if (/\bmax\b|макс/i.test(hay) && href) info.max = href;
      if (/whatsapp|wa\.me/i.test(hay) && href) info.whatsapp = href;
    }
  }

  return info;
}

function formatPhoneDisplay(phone: string): string {
  const digits = normalizeRuPhoneDigits(phone);
  if (digits) {
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  }
  return phone;
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
