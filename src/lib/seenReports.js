/**
 * КАКИЕ РАЗБОРЫ ЧЕЛОВЕК УЖЕ ВИДЕЛ
 * ===============================
 * Нужно ровно для одного: сцена расчёта проигрывается только при ПЕРВОМ
 * открытии матрицы. Второй заход на ту же дату должен открываться сразу —
 * иначе ожидание из приёма превращается в помеху.
 *
 * Ключ тот же, что у доступа: набор дат (src/lib/access.js).
 * Хранится в браузере: это ощущение от интерфейса, а не данные аккаунта,
 * и на бэкенд его тащить незачем.
 */

import { createStore } from './devStore.js';

const store = createStore('matrix.seenReports', { keys: [] });

/* Помним ограниченное число: список растёт с каждым новым расчётом,
   а нужен только недавний хвост. */
const LIMIT = 60;

export const wasSeen = (key) => Boolean(key) && store.get().keys.includes(key);

export function markSeen(key) {
  if (!key || wasSeen(key)) return;
  const keys = [key, ...store.get().keys].slice(0, LIMIT);
  store.set({ keys });
}
