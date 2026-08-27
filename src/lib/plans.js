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
 * Сколько разборов разрешает тариф — то же поле matrices.
 * Что считается одним разбором и как он открывает несколько страниц,
 * описано в src/lib/access.js: платят за дату, а не за калькулятор.
 */
export const planLabel = (plan) => PLAN_LIMITS[plan]?.label ?? PLAN_LIMITS[DEFAULT_PLAN].label;
