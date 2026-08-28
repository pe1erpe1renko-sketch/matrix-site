/**
 * ЧЕРНОВИК ОФОРМЛЕНИЯ
 * ===================
 * Почта, промокод и сертификат живут отдельно от страницы, потому что
 * со страницы оформления есть две ссылки назад: «выбрать другой тариф»
 * и «к разбору». Если ввод пропадает при переходе, получается тот же
 * тупик, что был раньше, только на шаг позже — человек уходит смотреть
 * тарифы и возвращается к пустой форме.
 *
 * Сессия, а не localStorage: черновик покупки не должен всплывать
 * через неделю в другой вкладке.
 */

import { useSyncExternalStore } from 'react';

const KEY = 'matrix.checkout';
const listeners = new Set();

let cache = read();

function read() {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveDraft(patch) {
  cache = { ...cache, ...patch };
  try { sessionStorage.setItem(KEY, JSON.stringify(cache)); } catch { /* приватное окно */ }
  listeners.forEach((fn) => fn());
}

/** После успешной оплаты черновик больше не нужен. */
export function clearDraft() {
  cache = {};
  try { sessionStorage.removeItem(KEY); } catch { /* приватное окно */ }
  listeners.forEach((fn) => fn());
}

export function useDraft() {
  return useSyncExternalStore(
    (fn) => { listeners.add(fn); return () => listeners.delete(fn); },
    () => cache,
    () => cache
  );
}
