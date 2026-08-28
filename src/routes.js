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
 * Меню слева. Одиннадцать пунктов туда не помещаются, поэтому в меню
 * шесть главных, а остальные открываются из карусели и из блока
 * «кого посмотрим дальше» в конце разбора.
 */
const MENU_IDS = ["matrica", "sovmestimost", "dengi", "detskaya", "prognoz", "rod"];

export const MENU_NAV = MENU_IDS.map((id) => CALC_NAV.find((c) => c.id === id)).filter(Boolean);

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
