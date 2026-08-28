import { createStore } from './devStore.js';
import { datesFromPath } from './returnTo.js';

/**
 * НЕДАВНИЕ РАСЧЁТЫ
 * ================
 * Человек посчитал матрицу, ушёл, вернулся через день — и вводит дату
 * заново. Список последних расчётов снимает этот шаг: дата уже посчитана,
 * достаточно нажать.
 *
 * Храним АДРЕС, а не дату: у парных расчётов дат две, и по одной дате
 * ссылку не собрать. Адрес же сразу открывает то, что человек считал.
 *
 * Пять записей — столько, сколько помещается строкой и сколько человек
 * реально держит в голове. Шестая вытесняет самую старую.
 */

const LIMIT = 5;

const store = createStore('matrix.recent', { list: [] }, (saved, initial) => ({
  list: Array.isArray(saved.list)
    ? saved.list.filter((item) => item && typeof item.to === 'string').slice(0, LIMIT)
    : initial.list,
}));

/**
 * Запомнить расчёт. Повторный заход поднимает запись наверх, а не двоит.
 *
 * Одинаковые даты считаются одной записью, даже если открыты разными
 * калькуляторами: /matrica/13-07-1998 и /finansy/13-07-1998 — это один
 * и тот же человек, и три одинаковые даты в строке только путают.
 * Ссылка ведёт туда, где человек был последним.
 */
export function rememberReport(to) {
  if (!to) return;
  const label = datesFromPath(to);
  if (!label) return;                     // страница без дат — не расчёт
  const { list } = store.get();
  if (list[0] && list[0].to === to) return;
  store.set({ list: [{ to, label }, ...list.filter((item) => item.label !== label)].slice(0, LIMIT) });
}

/** Убрать одну запись — крестиком в строке «Недавние». */
export function forgetReport(to) {
  const { list } = store.get();
  store.set({ list: list.filter((item) => item.to !== to) });
}

export const useRecentReports = () => store.useStore().list;
