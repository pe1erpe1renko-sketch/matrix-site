/**
 * СФЕРЫ И ВОПРОСЫ СТРАНИЦЫ
 * ========================
 * То же, что buildSectionData() из contentPositions.js, но для любого
 * набора сфер, а не только для полной матрицы.
 *
 * Отдельный файл, потому что contentPositions.js — карта позиций, её
 * переносят как есть и не правят. Правила здесь ровно те же:
 * число берётся по пути, ключ текста — из вопроса и аркана, ежедневные
 * тексты кэшируются по дате, а доступ считается ДЛЯ КАЖДОГО ВОПРОСА
 * отдельно: в платной сфере отдельные вопросы бывают открыты (free).
 */

import { resolvePath, textKey, dailyTextKey, calcTypeBySlug, FORECAST_VIEW } from './contentPositions.js';

/**
 * @param {object} matrix — результат calculateMatrix() или calculatePair()
 * @param {Array}  sections — набор сфер, обычно calcType.sections
 * @param {boolean} unlocked — оплачен ли разбор по этим датам
 */
export function buildViewSections(matrix, sections, { unlocked = false } = {}) {
  return sections.map((section) => {
    const slots = section.slots.map((slot) => {
      const arcana = resolvePath(matrix, slot.path);
      // Ежедневные тексты кэшируются по дате, остальные — навсегда.
      // У матрицы пары своей даты рождения нет и блока today тоже,
      // поэтому ежедневных вопросов в парных наборах не бывает.
      const key = (section.daily || slot.daily) && matrix.today
        ? dailyTextKey(arcana, matrix.today.arcana, matrix.today.date)
        : textKey(slot.id, arcana);
      // Отдельный вопрос может быть открыт, даже если сфера платная.
      const locked = section.access === 'paid' && !unlocked && !slot.free;
      return { id: slot.id, label: slot.label, arcana, key, locked, free: Boolean(slot.free) };
    });

    return {
      id: section.id,
      title: section.title,
      lead: section.lead,
      access: section.access,
      // Сфера закрыта целиком только если в ней нет ни одного открытого вопроса.
      locked: slots.every((slot) => slot.locked),
      slots,
    };
  });
}

/**
 * Описание типа разбора по адресу страницы.
 *
 * Тип разбора — это НЕ отдельный расчёт, а фильтр: какие из 92 вопросов
 * показать. Числа считаются одним движком, поэтому десять типов стоят
 * ровно столько же, сколько один.
 *
 * Прогноз лежит отдельно от десяти типов: это не разбор, а ежедневный
 * возврат, и продавать его отдельно нечего.
 */
export const pageView = (slug) =>
  (slug === FORECAST_VIEW.slug ? FORECAST_VIEW : calcTypeBySlug(slug)) || undefined;

/** Сколько ВОПРОСОВ всего на странице. */
export const questionsTotal = (sections) =>
  sections.reduce((total, section) => total + section.slots.length, 0);

/**
 * Сколько вопросов открыто при текущем доступе.
 * Считаем по вопросам, а не по сферам: в платной сфере первый вопрос
 * открыт всегда — чтобы человек попробовал везде.
 */
export const questionsOpen = (sections, unlocked) =>
  sections.reduce((total, section) => total + section.slots.filter(
    (slot) => section.access !== 'paid' || unlocked || slot.free
  ).length, 0);
