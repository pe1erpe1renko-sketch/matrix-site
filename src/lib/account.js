/**
 * АККАУНТ — ЗАГЛУШКА ДО НАСТОЯЩЕЙ АВТОРИЗАЦИИ
 * ===========================================
 * Кто вошёл, как его зовут, какой у него ID и куда слать чек.
 *
 * ID АККАУНТА: буква M, дефис и шесть СЛУЧАЙНЫХ цифр — M-483726.
 * Не порядковый номер регистрации: по порядковому видно, сколько у сервиса
 * пользователей, и это лишняя информация наружу. Выдаётся один раз при
 * создании аккаунта любым способом входа и больше никогда не меняется:
 * его называют в поддержке и он же стоит в реферальной ссылке.
 *
 * ЗАМЕНА НА БЭКЕНД (задача 5, auth.js): signIn/signOut заменить на вызовы
 * провайдера, ID выдавать на сервере. Компоненты работают через useAccount()
 * и об источнике данных не знают.
 */

import { createStore } from './devStore.js';

const SOCIALS = ['Telegram', 'MAX', 'Яндекс', 'VK'];

const guestState = {
  signedIn: false,
  id: null,
  name: '',
  email: '',
  receiptEmail: '',
  socials: {},                      // { Telegram: true, ... } — что привязано
  referral: { invited: 0, earned: 0, paid: 0 },
};

const store = createStore('matrix.dev.account', guestState);

/** M-483726. Шесть случайных цифр, не порядковый номер. */
function newAccountId() {
  const digits = String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0');
  return `M-${digits}`;
}

export const useAccount = () => store.useStore();
export const getAccount = () => store.get();
export const SOCIAL_NAMES = SOCIALS;

/**
 * Вход или регистрация. ID выдаётся ОДИН РАЗ: если человек уже заходил
 * в этом браузере, у него остаётся прежний номер.
 *
 * @param {object} p
 * @param {string} [p.via]   — 'Telegram' | 'MAX' | 'Яндекс' | 'VK' | 'email'
 * @param {string} [p.email]
 * @param {string} [p.name]
 */
export function signIn({ via = 'email', email = '', name = '' } = {}) {
  const prev = store.get();
  const displayName = name || prev.name || (via === 'email' ? guessName(email) : via);
  store.set({
    ...prev,
    signedIn: true,
    id: prev.id || newAccountId(),
    name: displayName,
    email: email || prev.email,
    receiptEmail: prev.receiptEmail || email || prev.email,
    socials: via === 'email' ? prev.socials : { ...prev.socials, [via]: true },
  });
}

/** Выход. ID и привязки остаются: человек вернётся тем же аккаунтом. */
export function signOut() {
  store.set({ ...store.get(), signedIn: false });
}

/** Удаление аккаунта — стирает всё, включая ID. */
export function deleteAccount() {
  store.set(guestState);
}

export function updateProfile(patch) {
  store.set({ ...store.get(), ...patch });
}

export function toggleSocial(name) {
  const prev = store.get();
  const socials = { ...prev.socials };
  if (socials[name]) delete socials[name];
  else socials[name] = true;
  store.set({ ...prev, socials });
}

/** 'petr@example.com' → 'Petr'. Только чтобы не звать человека пустотой. */
function guessName(email) {
  const local = String(email).split('@')[0] || 'Гость';
  return local.charAt(0).toUpperCase() + local.slice(1);
}

/** Реферальная ссылка строится из ID — отдельный код заводить незачем. */
export const referralLink = (id) => `matrix.ru/?ref=${id || 'M-000000'}`;
