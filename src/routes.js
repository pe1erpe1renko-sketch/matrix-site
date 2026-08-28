/**
 * КАРТА САЙТА
 * ===========
 * Один список на всё: карусель типов в форме, меню слева, маршруты.
 * Добавили тип разбора в CALC_TYPES — он сам появился в карусели и в адресах.
 *
 * ТИПЫ РАЗБОРА живут в lib/contentPositions.js: тип — это не отдельный
 * расчёт, а фильтр вопросов. Здесь только то, что нужно интерфейсу:
 * короткая надпись на вкладке и порядок.
 *
 * Адреса менять нельзя: на них завязана поисковая выдача и пересылаемые
 * ссылки. Старый /finansy остаётся навсегда — он переадресуется на /dengi.
 *
 * pairs — расчёт по ДВУМ датам, значит и адрес результата состоит из двух:
 * /sovmestimost/13-07-1998/09-04-1992
 */

import { CALC_TYPES, FORECAST_VIEW } from "./lib/contentPositions.js";

/**
 * Короткая надпись на вкладке карусели. Полное название длинное и
 * в строку не помещается, а карусель должна листаться, а не переноситься.
 */
const SHORT = {
  matrica: "Матрица",
  sovmestimost: "Совместимость",
  dengi: "Деньги",
  "mama-rebenok": "Мама и ребёнок",
  detskaya: "Детская",
  karma: "Карма",
  zdorovie: "Здоровье",
  rod: "Род",
  prednaznachenie: "Предназначение",
  biznes: "Бизнес",
  prognoz: "Прогноз",
};

const toNav = (type) => ({
  id: type.slug,
  path: `/${type.slug}`,
  label: type.title,
  short: SHORT[type.slug] || type.title,
  pairs: Boolean(type.pair),
  note: type.note || null,
});

/**
 * Карусель в форме расчёта: десять типов в порядке CALC_TYPES — он
 * выстроен по спросу — и прогноз последним. Прогноз не тип разбора,
 * но считается по дате и должен открываться из той же формы, иначе
 * пункт меню «Прогноз» вёл бы на форму без выбранной вкладки.
 */
export const CALC_NAV = [...CALC_TYPES.map(toNav), toNav(FORECAST_VIEW)];

/**
 * МЕНЮ СЛЕВА
 * Десять типов разбора в столбец не помещаются, поэтому видны первые
 * пять — порядок CALC_TYPES выстроен по спросу, — а остальные пять
 * раскрываются кнопкой «Ещё разборы». Прятать их совсем нельзя:
 * человек не найдёт карму и здоровье, если не догадается про карусель.
 */
export const MENU_NAV = CALC_TYPES.slice(0, 5).map(toNav);

/** Спрятанная половина списка. Раскрывается кнопкой и запоминается. */
export const MENU_MORE = CALC_TYPES.slice(5).map(toNav);

/**
 * Нижняя группа меню. Прогноз стоит здесь, а не среди разборов:
 * это не разбор, а ежедневный возврат.
 */
export const ACCOUNT_NAV = [
  { id: "chat",    path: "/chat",    label: "ИИ-наставник" },
  { id: "prognoz", path: "/prognoz", label: "Прогноз" },
  { id: "tarify",  path: "/tarify",  label: "Тарифы и оплата" },
  { id: "profil",  path: "/profil",  label: "Профиль" },
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
