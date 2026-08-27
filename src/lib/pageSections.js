/**
 * РАЗДЕЛЫ СТРАНИЦЫ
 * ================
 * То же, что buildSectionData() из contentPositions.js, но для любого
 * набора разделов, а не только для общей матрицы.
 *
 * Отдельный файл, потому что contentPositions.js — карта позиций, её
 * переносят как есть и не правят. Правила здесь ровно те же:
 * число берётся по пути, ключ текста — из слота и аркана, ежедневные
 * разделы кэшируются по дате.
 */

import { resolvePath, textKey, dailyTextKey, PAGE_VIEWS } from './contentPositions.js';

/**
 * @param {object} matrix — результат calculateMatrix() или calculatePair()
 * @param {Array}  sections — набор разделов, обычно PAGE_VIEWS[id].sections
 * @param {boolean} unlocked — открыт ли платный разбор по этим датам
 */
export function buildViewSections(matrix, sections, { unlocked = false } = {}) {
  return sections.map((section) => ({
    id: section.id,
    title: section.title,
    lead: section.lead,
    access: section.access,
    locked: section.access === 'paid' && !unlocked,
    slots: section.slots.map((slot) => {
      const arcana = resolvePath(matrix, slot.path);
      // Ежедневные разделы кэшируются по дате, обычные — навсегда.
      // У матрицы пары своей даты рождения нет и блока today тоже,
      // поэтому ежедневных разделов в парных наборах не бывает.
      const key = section.daily && matrix.today
        ? dailyTextKey(arcana, matrix.today.arcana, matrix.today.date)
        : textKey(slot.id, arcana);
      return { id: slot.id, label: slot.label, arcana, key };
    }),
  }));
}

/** Описание страницы по её id из адреса. Неизвестный id → undefined. */
export const pageView = (id) => PAGE_VIEWS[id];

/** Сколько разделов открыто на странице при текущем доступе. */
export const openCount = (sections, unlocked) =>
  unlocked ? sections.length : sections.filter((s) => s.access === 'free').length;
