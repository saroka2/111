export const site = {
  name: "ВТОРНИК",
  tagline: "салон красоты",
  title: "ВТОРНИК — бьюти-пространство",
  description:
    "Бьюти-пространство ВТОРНИК в Екатеринбурге — спокойная атмосфера, внимание к деталям и забота о себе.",
  bookingLabel: "Онлайн-запись",
  bookingHref: "#booking",
} as const;

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
  subtitle:
    "Тихий свет, бережный уход и внимание к деталям — чтобы ты могла просто быть собой.",
  primaryCta: "Записаться",
  secondaryCta: "Смотреть услуги",
  secondaryHref: "#services",
  meta: "Екатеринбург · ул. Володарского, 4",
  phone: "+7 (900) 000-00-00",
  phoneHref: "tel:+79000000000",
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

export type ServiceItem = {
  title: string;
  description: string;
  duration: string;
  price: string;
};

export const DEFAULT_SERVICES: ServiceItem[] = [
    {
      title: "Стрижка",
      description: "Форма, которая держится и подчёркивает черты лица.",
      price: "от 3 500 ₽",
      duration: "1 ч — 1 ч 30 м",
    },
    {
      title: "Окрашивание",
      description: "Мягкие оттенки, сложный цвет и бережная техника.",
      price: "от 7 500 ₽",
      duration: "от 2 ч",
    },
    {
      title: "Уход",
      description: "Восстановление, блеск и ритуалы для волос и кожи головы.",
      price: "от 4 200 ₽",
      duration: "45 м — 1 ч 15 м",
    },
    {
      title: "Маникюр",
      description: "Аккуратная форма, покрытие и уход за руками.",
      price: "от 2 800 ₽",
      duration: "1 ч — 1 ч 30 м",
    },
    {
      title: "Педикюр",
      description: "Чистый уход и аккуратное покрытие без лишней суеты.",
      price: "от 3 200 ₽",
      duration: "1 ч 15 м",
    },
    {
      title: "Брови и ресницы",
      description: "Форма, окрашивание и лёгкий акцент на взгляд.",
      price: "от 1 800 ₽",
      duration: "40 м — 1 ч",
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
  photo: string | null;
};

export const DEFAULT_MASTERS: MasterItem[] = [
  { name: "Марина", role: "Топ-стилист · цвет", photo: null },
  { name: "Анна", role: "Стилист · форма", photo: null },
  { name: "Елена", role: "Nail-мастер", photo: null },
];

export const masters = {
  id: "masters",
  title: "Руки, которым доверяют форму",
  subtitle: "Мастера, которые аккуратно воплощают запрос.",
  items: DEFAULT_MASTERS,
} as const;

export const location = {
  id: "location",
  title:
    "Мы создали пространство, где каждый визит — тихий праздник без повода",
  text: "Интерьер с мягким светом и вниманием к деталям. Команда, которая слышит запрос. И да — здесь есть хороший кофе.",
  address: "Екатеринбург, ул. Володарского, 4",
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
  secondaryHref: "mailto:hello@vtornik.studio",
} as const;

export type HourRow = { days: string; time: string };
export type SocialLink = { label: string; href: string };

export type SiteInfo = {
  address: string;
  phone: string;
  phoneHref: string;
  email: string;
  hours: HourRow[];
  socials: SocialLink[];
};

export const contacts = {
  id: "contacts",
  address: "Екатеринбург, ул. Володарского, 4",
  phone: "+7 (900) 000-00-00",
  phoneHref: "tel:+79000000000",
  email: "hello@vtornik.studio",
  hours: [
    { days: "Вт — Пт", time: "11:00 — 20:00" },
    { days: "Сб — Вс", time: "12:00 — 19:00" },
    { days: "Пн", time: "выходной" },
  ] satisfies HourRow[],
  socials: [
    { label: "Telegram", href: "#" },
    { label: "Instagram*", href: "#" },
    { label: "VK", href: "#" },
  ] satisfies SocialLink[],
  note: "*Meta признана экстремистской организацией на территории РФ",
} as const;

export const DEFAULT_INFO: SiteInfo = {
  address: contacts.address,
  phone: contacts.phone,
  phoneHref: contacts.phoneHref,
  email: contacts.email,
  hours: contacts.hours.map((row) => ({ ...row })),
  socials: contacts.socials.map((row) => ({ ...row })),
};

export const footer = {
  copy: "© ВТОРНИК, 2026",
  legal: "Демо-версия лендинга",
  made: "made with care",
} as const;
