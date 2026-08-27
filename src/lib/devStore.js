/**
 * ПРОСТОЕ ХРАНИЛИЩЕ СОСТОЯНИЯ — ЗАГЛУШКА ДО БЭКЕНДА
 * =================================================
 * Кабинету нужно помнить, кто вошёл, какие матрицы сохранены и о чём
 * шли разговоры с наставником. Пока бэкенда нет, всё это живёт
 * в localStorage браузера.
 *
 * Почему localStorage, а не память процесса: гость считает матрицы
 * без регистрации, и его расчёты должны пережить перезагрузку страницы —
 * иначе при входе переносить будет нечего.
 *
 * ЗАМЕНА НА БЭКЕНД: заменить load/save на запросы, остальной код
 * компонентов не трогается — они работают через useStore().
 */

import { useSyncExternalStore } from 'react';

export function createStore(storageKey, initial, revive) {
  const load = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return initial;
      const parsed = JSON.parse(raw);
      return revive ? revive(parsed, initial) : { ...initial, ...parsed };
    } catch {
      return initial;              // приватное окно, запрет хранилища — не повод падать
    }
  };

  let state = load();
  const listeners = new Set();

  const set = (next) => {
    state = typeof next === 'function' ? next(state) : next;
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      /* не сохранилось — работаем в памяти до перезагрузки */
    }
    listeners.forEach((fn) => fn());
  };

  const get = () => state;
  const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
  const useStore = () => useSyncExternalStore(subscribe, get, get);

  return { get, set, subscribe, useStore };
}

/** Случайный код из букв и цифр — для ссылок телеграм-бота. */
export function randomCode(length = 6) {
  const alphabet = 'abcdefghijkmnpqrstuvwxyz23456789';   // без похожих l/1 и o/0
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

/** Короткий идентификатор записи. */
export const randomId = () => randomCode(10);
