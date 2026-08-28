/**
 * ДОСТУП К РАЗБОРАМ — ВРЕМЕННАЯ МОДЕЛЬ ДЛЯ МАКЕТА
 * ==============================================
 * ПРАВИЛО: платят за дату, а не за калькулятор.
 *
 * Один купленный разбор открывает всё, что считается по этому набору дат.
 * Купили разбор по 13.07.1998 — открылись и /matrica/13-07-1998,
 * и /finansy/13-07-1998, и /prognoz/13-07-1998: числа там одни и те же,
 * меняется только угол чтения.
 *
 * Другой набор дат — другой разбор, отдельная единица лимита:
 *   детская по дате ребёнка         → своя дата, свой разбор
 *   совместимость и бизнес по паре  → набор из двух дат, свой разбор
 * При этом совместимость и бизнес по ОДНОЙ И ТОЙ ЖЕ паре дат — один разбор:
 * платят за дату, а не за калькулятор, и второй раз брать деньги не за что.
 *
 * Сколько разборов можно держать открытыми — берётся из PLAN_LIMITS.reports.
 *
 * ЭТО ЗАГЛУШКА. Настоящие покупки придут с бэкенда (задача 5, payment.js).
 * Здесь состояние живёт в sessionStorage, чтобы на предпросмотре можно было
 * пощёлкать доступы между страницами и увидеть правило в действии.
 */

import { PLAN_LIMITS, DEFAULT_PLAN } from './plans.js';
import { createStore } from './devStore.js';

/**
 * Ключ разбора — набор дат, отсортированный.
 * Сортировка обязательна: пара «А и Б» и пара «Б и А» — один разбор,
 * матрица пары от перестановки не меняется.
 */
export function reportKey(isoDates) {
  return [...isoDates].filter(Boolean).sort().join('+');
}

const store = createStore(
  'matrix.dev.access',
  { plan: DEFAULT_PLAN, reports: [] },
  (saved, initial) => ({
    plan: PLAN_LIMITS[saved.plan] ? saved.plan : initial.plan,
    reports: Array.isArray(saved.reports) ? saved.reports.filter((r) => typeof r === 'string') : [],
  })
);

const commit = store.set;

/** Сколько разборов разрешено тарифом. Infinity на «Без границ». */
export const reportLimit = (plan) => PLAN_LIMITS[plan]?.reports ?? 0;

/**
 * Смена тарифа. Если новый тариф разрешает меньше разборов, лишние
 * закрываются — иначе «Бесплатно» показывал бы оплаченное.
 * Закрываем последние открытые: первые куплены раньше.
 */
export function setPlan(plan) {
  if (!PLAN_LIMITS[plan]) return;
  const state = store.get();
  const limit = reportLimit(plan);
  const reports = Number.isFinite(limit) ? state.reports.slice(0, limit) : state.reports;
  commit({ plan, reports });
}

/** Открыть разбор. Вернёт false, если лимит тарифа исчерпан. */
export function unlockReport(key) {
  const state = store.get();
  if (!key || state.reports.includes(key)) return true;
  if (state.reports.length >= reportLimit(state.plan)) return false;
  commit({ ...state, reports: [...state.reports, key] });
  return true;
}

/** Закрыть разбор — освободить единицу лимита. */
export function lockReport(key) {
  const state = store.get();
  commit({ ...state, reports: state.reports.filter((r) => r !== key) });
}

/**
 * Открыт ли разбор по этому набору дат.
 * На бесплатном тарифе лимит нулевой, поэтому открытых разборов не бывает.
 */
export function isReportUnlocked(key) {
  return Boolean(key) && store.get().reports.includes(key);
}

/** Состояние доступов для компонентов. */
export function useAccess(key) {
  const current = store.useStore();
  const limit = reportLimit(current.plan);
  return {
    plan: current.plan,
    reports: current.reports,
    limit,
    unlocked: Boolean(key) && current.reports.includes(key),
    canUnlockMore: current.reports.length < limit,
  };
}
