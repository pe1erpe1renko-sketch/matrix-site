/**
 * ТОЧКИ ПЕРЕЛОМА
 * ==============
 * Проект свёрстан ВСТРОЕННЫМИ стилями — так требует CLAUDE.md, раздел 8:
 * активные состояния задаются инлайном, иначе их перебивает таблица стилей.
 * Медиазапросом встроенный стиль не перекрыть, поэтому ширину экрана
 * компоненты спрашивают здесь и сами выбирают вариант стиля.
 *
 *   до 640      — телефон
 *   641–1024    — планшет
 *   больше      — десктоп
 *
 * Основной трафик проекта придёт с телефонов, поэтому телефон здесь
 * не «упрощённый десктоп», а равноправный режим.
 */

import { useSyncExternalStore } from 'react';

export const PHONE_MAX = 640;
export const TABLET_MAX = 1024;

const QUERIES = {
  phone: `(max-width: ${PHONE_MAX}px)`,
  tablet: `(min-width: ${PHONE_MAX + 1}px) and (max-width: ${TABLET_MAX}px)`,
  coarse: '(pointer: coarse)',
  calm: '(prefers-reduced-motion: reduce)',
};

/** Сервер и старые браузеры без matchMedia: считаем, что это десктоп. */
const noMatchMedia = typeof window === 'undefined' || !window.matchMedia;

function makeQueryStore(query) {
  const subscribe = (fn) => {
    if (noMatchMedia) return () => {};
    const mql = window.matchMedia(query);
    // addEventListener появился не везде одновременно с matchMedia
    if (mql.addEventListener) {
      mql.addEventListener('change', fn);
      return () => mql.removeEventListener('change', fn);
    }
    mql.addListener(fn);
    return () => mql.removeListener(fn);
  };
  const get = () => (noMatchMedia ? false : window.matchMedia(query).matches);
  return { subscribe, get };
}

const stores = Object.fromEntries(
  Object.entries(QUERIES).map(([key, query]) => [key, makeQueryStore(query)])
);

const useQuery = (key) =>
  useSyncExternalStore(stores[key].subscribe, stores[key].get, () => false);

/** 'phone' | 'tablet' | 'desktop' */
export function useBreakpoint() {
  const phone = useQuery('phone');
  const tablet = useQuery('tablet');
  return phone ? 'phone' : tablet ? 'tablet' : 'desktop';
}

export const useIsPhone = () => useQuery('phone');

/**
 * Узкая рабочая область: телефон или планшет. На планшете меню, даже
 * свёрнутое, забирает место, поэтому блоки из двух колонок там тоже
 * складываются в одну.
 */
export function useIsNarrow() {
  const phone = useQuery('phone');
  const tablet = useQuery('tablet');
  return phone || tablet;
}

/**
 * Тач-устройство. Кастомный курсор и параллакс за мышью там не работают
 * и только тратят батарею, поэтому выключаются полностью.
 */
export const useIsTouch = () => useQuery('coarse');

/**
 * Человек попросил систему не анимировать. Медиазапрос сюда вынесен потому,
 * что встроенный стиль правилом из таблицы не отменить: движение приходится
 * гасить в самом компоненте.
 */
export const useReducedMotion = () => useQuery('calm');

/** Выбор значения по текущей ширине: pick(bp, { phone: 12, desktop: 24 }). */
export const pick = (bp, variants) =>
  bp in variants ? variants[bp] : variants.desktop !== undefined ? variants.desktop : variants.default;

/**
 * Строка, которая прокручивается вбок и НЕ переносится:
 * вкладки калькуляторов, слои октаграммы, вкладки кабинета.
 * Класс hScroll прячет полосу прокрутки — см. globalCss.js.
 */
export const hScrollRow = {
  display: 'flex',
  flexWrap: 'nowrap',
  overflowX: 'auto',
  overflowY: 'hidden',
  WebkitOverflowScrolling: 'touch',
  scrollbarWidth: 'none',
};

/** Минимальная высота кликабельного элемента на тач-экране. */
export const TAP = 44;
