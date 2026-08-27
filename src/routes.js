/**
 * КАРТА САЙТА
 * ===========
 * Один список на всё: меню слева, вкладки формы на главной, подвал, маршруты.
 * Добавили страницу здесь — она сама появилась во всех трёх местах.
 *
 * Адреса зафиксированы в CLAUDE.md, раздел 6. Менять их нельзя:
 * на них завязана поисковая выдача и пересылаемые ссылки.
 *
 * pairs — расчёт считается по ДВУМ датам, значит и адрес результата
 * состоит из двух дат: /sovmestimost/13-07-1998/09-04-1992
 */

/** Шесть калькуляторов. Каждый — вкладка формы на главной и пункт меню. */
export const CALC_NAV = [
  { id: "matrica",      path: "/matrica",      label: "Матрица судьбы",        pairs: false },
  { id: "finansy",      path: "/finansy",      label: "Финансы",               pairs: false },
  { id: "sovmestimost", path: "/sovmestimost", label: "Совместимость",         pairs: true  },
  { id: "biznes",       path: "/biznes",       label: "Бизнес-совместимость",  pairs: true  },
  { id: "detskaya",     path: "/detskaya",     label: "Детская",               pairs: false },
  { id: "prognoz",      path: "/prognoz",      label: "Прогноз",               pairs: false },
];

/** Нижняя группа меню — кабинет. Формы расчёта у этих страниц нет. */
export const ACCOUNT_NAV = [
  { id: "chat",   path: "/chat",   label: "ИИ-наставник" },
  { id: "tarify", path: "/tarify", label: "Тарифы и оплата" },
  { id: "profil", path: "/profil", label: "Профиль" },
];

/** Вкладка по умолчанию: её видит человек, зашедший на «/». */
export const DEFAULT_CALC = "matrica";

const CALC_BY_ID = Object.fromEntries(CALC_NAV.map((c) => [c.id, c]));

/** Описание калькулятора по его id. Неизвестный id → undefined. */
export const calcById = (id) => CALC_BY_ID[id];

/**
 * Какой пункт меню подсвечивать для текущего адреса.
 * '/matrica/13-07-1998' → 'matrica', '/' → 'matrica' (главная = первая вкладка).
 */
export function activeNavId(pathname) {
  const segment = pathname.split("/")[1] || "";
  if (!segment) return DEFAULT_CALC;
  return segment;
}
