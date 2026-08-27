/**
 * ДАТА В АДРЕСЕ СТРАНИЦЫ
 * ======================
 * Главное преимущество проекта: у каждого расчёта постоянный адрес вида
 * /matrica/13-07-1998. Поисковики такие страницы индексируют, а ссылку
 * можно переслать — человек увидит готовый расчёт, а не пустую форму.
 *
 * В адресе дата человекочитаемая: ДД-ММ-ГГГГ.
 * Движок расчёта (matrixEngine.calculateMatrix) ждёт ISO: ГГГГ-ММ-ДД.
 * Здесь один перевод туда-обратно, чтобы страницы не изобретали свой.
 */

const pad = (n) => String(n).padStart(2, "0");

/** '13-07-1998' → '1998-07-13'. Мусор и несуществующие даты → null. */
export function urlDateToISO(urlDate) {
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(String(urlDate || ""));
  if (!match) return null;

  const [, d, m, y] = match.map(Number);
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;

  // 31 февраля отсекаем здесь, а не в движке: страница должна показать
  // «неверная дата», а не упасть с ошибкой.
  const probe = new Date(Date.UTC(y, m - 1, d));
  if (probe.getUTCFullYear() !== y || probe.getUTCMonth() !== m - 1 || probe.getUTCDate() !== d) {
    return null;
  }
  return `${y}-${pad(m)}-${pad(d)}`;
}

/** '1998-07-13' → '13-07-1998' — обратный перевод, для сборки ссылок. */
export function isoToUrlDate(iso) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ""));
  if (!match) return null;
  const [, y, m, d] = match;
  return `${d}-${m}-${y}`;
}

/** Три поля формы (день, месяц, год) → кусок адреса '13-07-1998'. */
export function partsToUrlDate({ d, m, y }) {
  if (!d || !m || !y) return null;
  return `${pad(Number(d))}-${pad(Number(m))}-${String(y)}`;
}

/** Как показывать дату в тексте: '13-07-1998' → '13.07.1998'. */
export const urlDateToHuman = (urlDate) => String(urlDate || "").replace(/-/g, ".");
