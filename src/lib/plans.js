/**
 * ТАРИФЫ И ЛИМИТЫ
 * ===============
 * Таблица зафиксирована в CLAUDE.md, раздел 4. Все ограничения берутся
 * отсюда: зашитых чисел в компонентах быть не должно.
 *
 * Логика цен (чтобы никто не «оптимизировал» её случайно):
 * разовый разбор и первая подписка почти равны намеренно — 100 ₽ разницы
 * против второй матрицы, аркана дня, наставника и архива. Скачок между
 * 590 и 990 покупает прогнозы близким в Telegram.
 *
 * Архив прогнозов остаётся после отмены подписки: отдать накопленное
 * дешевле, чем потерять человека.
 */

import { SECTIONS, FREE_SECTIONS } from './contentPositions.js';

export const PLAN_LIMITS = {
  free:      { matrices: 0, messages: 0,  telegram: 0, archive: false, pdf: false, label: 'Бесплатно' },
  once:      { matrices: 1, messages: 0,  telegram: 0, archive: false, pdf: true,  label: 'Разовый разбор' },
  path:      { matrices: 2, messages: 5,  telegram: 1, archive: true,  pdf: true,  label: 'Свой путь' },
  circle:    { matrices: 5, messages: 20, telegram: 3, archive: true,  pdf: true,  label: 'Близкий круг' },
  unlimited: { matrices: Infinity, messages: Infinity, telegram: 7, archive: true, pdf: true, label: 'Без границ' },
};

/** Порядок от младшего к старшему — для переключателей и сравнений. */
export const PLAN_ORDER = ['free', 'once', 'path', 'circle', 'unlimited'];

/** Тариф по умолчанию: человек без входа. */
export const DEFAULT_PLAN = 'free';

/**
 * Открыты ли все 25 разделов.
 *
 * По таблице тарифов разделы открывает любая оплата, включая разовую:
 * бесплатно — 4 из 25, на всех остальных — все 25. Признак взят
 * из наличия матриц в тарифе, а не из списка названий: добавится
 * новый платный тариф — правило сработает само.
 */
export const sectionsUnlocked = (plan) => (PLAN_LIMITS[plan]?.matrices ?? 0) > 0;

/** Сколько разделов видно на тарифе: 4 из 25 или 25 из 25. */
export const sectionsOpen = (plan) =>
  sectionsUnlocked(plan) ? SECTIONS.length : FREE_SECTIONS.length;

export const SECTIONS_TOTAL = SECTIONS.length;

/** Название тарифа для показа. Неизвестный тариф не должен ронять экран. */
export const planLabel = (plan) => PLAN_LIMITS[plan]?.label ?? PLAN_LIMITS[DEFAULT_PLAN].label;
