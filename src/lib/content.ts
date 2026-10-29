export const site = {
  name: "ВТОРНИК",
  tagline: "салон красоты",
  title: "ВТОРНИК — бьюти-пространство",
  description:
    "Бьюти-пространство ВТОРНИК в Екатеринбурге — спокойная атмосфера, внимание к деталям и забота о себе.",
  bookingLabel: "Онлайн-запись",
  bookingHref: "#booking",
} as const;

/** Единый источник телефона, адреса и мессенджера. */
export const CONTACTS = {
  city: "Екатеринбург",
  address: "ул. Володарского, 4",
  addressNote: "2 минуты от Площади 1905 года",
  phone: "+7 (992) 001-67-96",
  phoneHref: "tel:+79920016796",
  telegram: "https://t.me/vtorniiiikymBOT",
  /** Ссылка Max — подставьте из таблицы / соцсетей, если есть. */
  max: "",
  /** WhatsApp по умолчанию из телефона салона. */
  whatsapp: "https://wa.me/79920016796",
  hoursText: "ежедневно 9:00–21:00",
  email: "hello@vtornik.studio",
} as const;

export const META_NOTE =
  "*Meta признана экстремистской организацией на территории РФ";

export type WriteChannel = {
  id: string;
  label: string;
  href: string;
  /** Пометка Meta (*) и дисклеймер */
  metaMarked?: boolean;
};

function messengerId(label: string, href: string, index: number): string {
  const hay = `${label} ${href}`.toLowerCase();
  if (/\bmax\b|макс/.test(hay)) return "max";
  if (/telegram|t\.me/.test(hay)) return "telegram";
  if (/whatsapp|wa\.me/.test(hay)) return "whatsapp";
  return `messenger-${index}`;
}

function isMetaMessenger(label: string, href: string): boolean {
  if (label.includes("*")) return true;
  return /whatsapp|instagram|wa\.me|meta/i.test(`${label} ${href}`);
}

/** Каналы для кнопки «Написать» — в первую очередь из колонки «Месенджеры». */
export function getWriteChannels(info?: {
  telegram?: string;
  max?: string;
  whatsapp?: string;
  phone?: string;
  socials?: { label: string; href: string }[];
  messengers?: { label: string; href: string }[];
}): WriteChannel[] {
  const fromSheet = (info?.messengers ?? []).filter(
    (m) => m.label?.trim() || m.href?.trim(),
  );

  if (fromSheet.length > 0) {
    return fromSheet.map((m, i) => {
      const label = m.label?.trim() || "Мессенджер";
      const href = m.href?.trim() && m.href !== "#" ? m.href.trim() : "";
      return {
        id: messengerId(label, href, i),
        label,
        href,
        metaMarked: isMetaMessenger(label, href),
      };
    });
  }

  // Fallback, если колонка ещё не пришла из Apps Script
  const socials = info?.socials ?? [];
  const findSocial = (re: RegExp) =>
    socials.find((s) => re.test(`${s.label} ${s.href}`))?.href?.trim() || "";

  const telegram =
    info?.telegram?.trim() ||
    findSocial(/telegram|t\.me/i) ||
    CONTACTS.telegram;

  const max =
    info?.max?.trim() ||
    findSocial(/\bmax\b|макс/i) ||
    CONTACTS.max;

  let whatsapp =
    info?.whatsapp?.trim() ||
    findSocial(/whatsapp|wa\.me|api\.whatsapp/i) ||
    CONTACTS.whatsapp;

  if (!whatsapp || whatsapp === "#") {
    const digits = (info?.phone || CONTACTS.phone).replace(/\D/g, "");
    const normalized =
      digits.length === 11 && digits.startsWith("8")
        ? `7${digits.slice(1)}`
        : digits.length === 10
          ? `7${digits}`
          : digits;
    if (normalized.length === 11 && normalized.startsWith("7")) {
      whatsapp = `https://wa.me/${normalized}`;
    }
  }

  return [
    { id: "max", label: "Max", href: max && max !== "#" ? max : "" },
    {
      id: "telegram",
      label: "Telegram",
      href: telegram && telegram !== "#" ? telegram : CONTACTS.telegram,
    },
    {
      id: "whatsapp",
      label: "WhatsApp*",
      href: whatsapp && whatsapp !== "#" ? whatsapp : CONTACTS.whatsapp,
      metaMarked: true,
    },
  ];
}

/** Адрес со скобочной пометкой. */
export function formatAddress(
  address: string = CONTACTS.address,
  note: string = CONTACTS.addressNote,
  { withCity = false }: { withCity?: boolean } = {},
) {
  const base = withCity ? `${CONTACTS.city}, ${address}` : address;
  return note ? `${base} (${note})` : base;
}

export const nav = [
  { label: "Услуги", href: "#services" },
  { label: "Интересные предложения", href: "#offers" },
  { label: "О нас", href: "#about" },
  { label: "Мастера", href: "#masters" },
  { label: "Отзывы", href: "#reviews" },
  { label: "Контакты", href: "#contacts" },
] as const;

export type OfferItem = {
  title: string;
  description: string;
  price: string;
  photo: string | null;
};

export const DEFAULT_OFFERS: OfferItem[] = [
  { title: "Стрижка и уход", description: "", price: "5 900 ₽", photo: null },
  { title: "Окрашивание", description: "", price: "6 500 ₽", photo: null },
  { title: "Маникюр и педикюр", description: "", price: "5 200 ₽", photo: null },
];

export const offers = {
  id: "offers",
  title: "Интересные предложения",
  subtitle: "Специальные форматы и цены — их можно взять уже сейчас.",
  items: DEFAULT_OFFERS,
} as const;

export const hero = {
  line1: "Пространство,",
  line2Italic: "где важна",
  line3: "только ты",
  slogan: "Лучший день для себя — вторник, но мы принимаем в любой",
  subtitle:
    "Тихий свет, бережный уход и внимание к деталям — чтобы ты могла просто быть собой.",
  primaryCta: "Записаться",
  secondaryCta: "Смотреть услуги",
  secondaryHref: "#services",
  meta: formatAddress(CONTACTS.address, CONTACTS.addressNote, { withCity: true }),
  phone: CONTACTS.phone,
  phoneHref: CONTACTS.phoneHref,
} as const;

export const marquee = [
  "Стрижка",
  "Окрашивание",
  "Уход",
  "Маникюр",
  "Педикюр",
  "Брови",
  "Self care",
] as const;

export const SERVICE_GROUP_ORDER = [
  "Волосы",
  "Ногти",
  "Брови и ресницы",
] as const;

export type ServiceGroup = (typeof SERVICE_GROUP_ORDER)[number] | string;

export type ServiceItem = {
  title: string;
  description: string;
  duration: string;
  price: string;
  group: string;
};

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    title: "Стрижка",
    description: "Форма, которая держится и подчёркивает черты лица.",
    price: "от 3 500 ₽",
    duration: "1 ч — 1 ч 30 м",
    group: "Волосы",
  },
  {
    title: "Окрашивание",
    description: "Мягкие оттенки, сложный цвет и бережная техника.",
    price: "от 7 500 ₽",
    duration: "от 2 ч",
    group: "Волосы",
  },
  {
    title: "Уход",
    description: "Восстановление, блеск и ритуалы для волос и кожи головы.",
    price: "от 4 200 ₽",
    duration: "45 м — 1 ч 15 м",
    group: "Волосы",
  },
  {
    title: "Маникюр",
    description: "Аккуратная форма, покрытие и уход за руками.",
    price: "от 2 800 ₽",
    duration: "1 ч — 1 ч 30 м",
    group: "Ногти",
  },
  {
    title: "Педикюр",
    description: "Чистый уход и аккуратное покрытие без лишней суеты.",
    price: "от 3 200 ₽",
    duration: "1 ч 15 м",
    group: "Ногти",
  },
  {
    title: "Брови и ресницы",
    description: "Форма, окрашивание и лёгкий акцент на взгляд.",
    price: "от 1 800 ₽",
    duration: "40 м — 1 ч",
    group: "Брови и ресницы",
  },
];

export const services = {
  id: "services",
  title: "Каждый визит — как маленький ритуал",
  subtitle:
    "Подбираем формат под тебя: от быстрой формы до полного преображения. Цены-ориентиры — точные скажем при записи.",
  cta: "Полный прайс",
  items: DEFAULT_SERVICES,
} as const;

export const about = {
  id: "about",
  title: "Красота — это ритуал, а не спешка",
  lead: "ВТОРНИК — пространство, где время замедляется.",
  text: [
    "Мы создаём атмосферу, в которой можно выдохнуть: без спешки, без лишнего шума — только ты и бережный сервис.",
    "Каждая деталь собрана так, чтобы ощущение заботы оставалось с тобой и после визита.",
  ],
  points: [
    { title: "Внимание", text: "Слышим запрос и не торопим процесс" },
    { title: "Тишина", text: "Спокойный ритм и приватность" },
    { title: "Форма", text: "Результат, который живёт между визитами" },
  ],
} as const;

export type MasterItem = {
  name: string;
  role: string;
  group: string;
  description: string;
  photo: string | null;
  bookingUrl: string | null;
};

export const DEFAULT_MASTERS: MasterItem[] = [
  {
    name: "Марина",
    role: "Топ-стилист · цвет",
    group: "Парикмахерский зал",
    description: "Сложный цвет и аккуратная форма — без спешки и шаблонов.",
    photo: null,
    bookingUrl: null,
  },
  {
    name: "Анна",
    role: "Стилист · форма",
    group: "Парикмахерский зал",
    description: "Стрижки, которые держатся и подчёркивают черты лица.",
    photo: null,
    bookingUrl: null,
  },
  {
    name: "Елена",
    role: "Nail-мастер",
    group: "Ногтевой сервис",
    description: "Чистый маникюр и педикюр с вниманием к деталям.",
    photo: null,
    bookingUrl: null,
  },
  {
    name: "Ольга",
    role: "Бровист",
    group: "Брови и ресницы",
    description: "Форма, окрашивание и мягкий акцент на взгляд.",
    photo: null,
    bookingUrl: null,
  },
  {
    name: "Катя",
    role: "Визажист",
    group: "Визаж",
    description: "Естественный и вечерний макияж под ваш образ.",
    photo: null,
    bookingUrl: null,
  },
  {
    name: "Дарья",
    role: "Косметолог",
    group: "Косметология",
    description: "Бережный уход за кожей и спокойный ритуал восстановления.",
    photo: null,
    bookingUrl: null,
  },
];

export const masters = {
  id: "masters",
  title: "Руки, которым доверяют форму",
  subtitle: "Мастера, которые аккуратно воплощают запрос.",
  items: DEFAULT_MASTERS,
} as const;

export type AdminItem = {
  name: string;
  photo: string | null;
  description: string;
};

export const DEFAULT_ADMINS: AdminItem[] = [
  {
    name: "Ирина",
    photo: null,
    description: "Встретит, подскажет и поможет с записью.",
  },
  {
    name: "Алина",
    photo: null,
    description: "Ответит на вопросы и сориентирует по услугам.",
  },
];

export const admins = {
  id: "admins",
  title: "Наши администраторы",
  subtitle: "Наши администраторы — встретят и всё расскажут",
  items: DEFAULT_ADMINS,
} as const;

export const location = {
  id: "location",
  title:
    "Мы создали пространство, где каждый визит — тихий праздник без повода",
  text: "Интерьер с мягким светом и вниманием к деталям. Команда, которая слышит запрос. И да — здесь есть хороший кофе.",
  address: formatAddress(CONTACTS.address, CONTACTS.addressNote, { withCity: true }),
  imageAlt: "Фасад салона ВТОРНИК на улице Володарского",
} as const;

export const reviews = {
  id: "reviews",
  title: "Слова, которые мы бережём",
  items: [
    {
      name: "Ирина",
      date: "март 2026",
      text: "Тихо, красиво и очень внимательно. Ушла с ощущением, что обо мне действительно позаботились.",
    },
    {
      name: "Дарья",
      date: "февраль 2026",
      text: "Люблю атмосферу: много воздуха, мягкий свет и безупречный результат. Возвращаюсь снова.",
    },
    {
      name: "София",
      date: "январь 2026",
      text: "Запись прошла спокойно, мастер услышал запрос с первого раза. Рекомендую.",
    },
  ],
} as const;

export const cta = {
  id: "booking",
  titleBefore: "Лучший день для себя —",
  titleAccent: "вторник",
  titleAfter: "Но мы принимаем в любой.",
  primary: "Онлайн-запись",
  secondary: "Написать нам",
  secondaryHref: CONTACTS.telegram,
} as const;

export type HourRow = { days: string; time: string };
export type SocialLink = { label: string; href: string };

export type SiteInfo = {
  address: string;
  addressNote: string;
  phone: string;
  phoneHref: string;
  email: string;
  telegram: string;
  max: string;
  whatsapp: string;
  hoursText: string;
  hours: HourRow[];
  socials: SocialLink[];
  /** Колонка «Месенджеры» из Основной инфы */
  messengers: SocialLink[];
};

export const contacts = {
  id: "contacts",
  address: CONTACTS.address,
  addressNote: CONTACTS.addressNote,
  phone: CONTACTS.phone,
  phoneHref: CONTACTS.phoneHref,
  email: CONTACTS.email,
  telegram: CONTACTS.telegram,
  hoursText: CONTACTS.hoursText,
  hours: [{ days: "Ежедневно", time: "9:00 — 21:00" }] satisfies HourRow[],
  socials: [
    { label: "Telegram", href: CONTACTS.telegram },
    { label: "VK", href: "#" },
    { label: "Instagram*", href: "#" },
  ] satisfies SocialLink[],
  note: META_NOTE,
} as const;

export const DEFAULT_INFO: SiteInfo = {
  address: CONTACTS.address,
  addressNote: CONTACTS.addressNote,
  phone: CONTACTS.phone,
  phoneHref: CONTACTS.phoneHref,
  email: CONTACTS.email,
  telegram: CONTACTS.telegram,
  max: CONTACTS.max,
  whatsapp: CONTACTS.whatsapp,
  hoursText: CONTACTS.hoursText,
  hours: contacts.hours.map((row) => ({ ...row })),
  socials: contacts.socials.map((row) => ({ ...row })),
  messengers: [
    { label: "Max", href: CONTACTS.max || "" },
    { label: "Telegram", href: CONTACTS.telegram },
    { label: "WhatsApp*", href: CONTACTS.whatsapp },
  ],
};

export const footer = {
  copy: "© ВТОРНИК, 2026",
  legal: "Демо-версия лендинга",
  made: "made with care",
} as const;
