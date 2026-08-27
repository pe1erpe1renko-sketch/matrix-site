/**
 * МОИ МАТРИЦЫ — СОХРАНЁННЫЕ ЛЮДИ
 * ==============================
 * Список людей, чьи матрицы человек держит в кабинете: имя, дата, пол,
 * тип расчёта и состояние телеграм-прогноза.
 *
 * ЧИСЛА ЗДЕСЬ НЕ ХРАНЯТСЯ. Матрица считается из даты рождения каждый раз
 * заново: дата не меняется, значит и числа не меняются. Хранить их копию —
 * значит однажды разойтись с движком.
 *
 * ГОСТЕВОЙ РЕЖИМ: гость считает матрицы без регистрации, и они попадают
 * в этот же список с пометкой guest. При входе пометка снимается —
 * расчёты переносятся в аккаунт, а не пропадают.
 *
 * ССЫЛКА НА БОТА: у каждой карточки свой код. Первый, кто нажал «Старт»
 * по ссылке, занимает её; остальным бот отвечает, что она уже используется.
 * «Отозвать» гасит старый код и выдаёт новый — старая ссылка перестаёт
 * работать сразу, иначе отозвать её было бы невозможно.
 */

import { createStore, randomCode, randomId } from './devStore.js';
import { reportKey, unlockReport, lockReport, reportLimit, isReportUnlocked } from './access.js';

const store = createStore('matrix.dev.people', { list: [] });

export const usePeople = () => store.useStore().list;
export const getPeople = () => store.get().list;

/** Ключ доступа человека — его дата рождения. Платят за дату. */
export const personKey = (person) => reportKey([person.birthDate]);

export const isPersonOpen = (person) => isReportUnlocked(personKey(person));

const newTelegram = () => ({ on: false, status: 'off', username: null, code: randomCode() });

/**
 * Добавить человека. Если тариф позволяет, разбор сразу открывается —
 * человек только что за него заплатил, заставлять его нажимать ещё раз незачем.
 */
export function addPerson({ name, birthDate, gender, kind = 'personal', self = false, guest = false }, { autoUnlock = true } = {}) {
  const person = {
    id: randomId(),
    name: String(name || '').trim(),
    birthDate,
    gender,
    kind,
    self,
    guest,
    telegram: newTelegram(),
    createdAt: new Date().toISOString(),
  };
  store.set({ list: [...store.get().list, person] });
  // Не хватило лимита — unlockReport вернёт false, карточка останется закрытой.
  if (autoUnlock) unlockReport(personKey(person));
  return person;
}

/**
 * Запомнить расчёт, который человек открыл без входа.
 * Гость считает матрицы без регистрации, и его расчёты не должны пропасть:
 * при входе они переносятся в аккаунт (claimGuestPeople).
 *
 * Разбор при этом НЕ открывается: просмотр страницы — не покупка.
 * Имя остаётся пустым — гость его не вводил, подставлять выдуманное нельзя.
 */
export function rememberGuestCalculation({ birthDate, kind = 'personal' }) {
  const list = store.get().list;
  if (list.some((p) => p.birthDate === birthDate)) return null;
  return addPerson({ name: '', birthDate, gender: '', kind, guest: true }, { autoUnlock: false });
}

/** Как звать человека в списке, если имя он так и не ввёл. */
export const personLabel = (person) => person.name || 'Без имени';

export function updatePerson(id, patch) {
  store.set({ list: store.get().list.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
}

/** Удаление освобождает единицу лимита: разбор по этой дате закрывается. */
export function removePerson(id) {
  const person = store.get().list.find((p) => p.id === id);
  if (!person) return;
  store.set({ list: store.get().list.filter((p) => p.id !== id) });
  const stillUsed = store.get().list.some((p) => p.birthDate === person.birthDate);
  if (!stillUsed) lockReport(personKey(person));
}

/**
 * Включить или выключить телеграм-прогноз.
 * Включение выдаёт ссылку, но не подключает: пока человек не нажал «Старт»
 * в боте, статус остаётся «не активирована».
 */
export function toggleTelegram(id) {
  const person = store.get().list.find((p) => p.id === id);
  if (!person) return;
  const on = !person.telegram.on;
  updatePerson(id, {
    telegram: on
      ? { on: true, status: 'waiting', username: null, code: person.telegram.code || randomCode() }
      : { on: false, status: 'off', username: null, code: person.telegram.code },
  });
}

/** «Отозвать»: старый код гаснет, выдаётся новый. Прежняя ссылка мертва. */
export function revokeTelegram(id) {
  updatePerson(id, { telegram: { on: true, status: 'waiting', username: null, code: randomCode() } });
}

/**
 * Заглушка активации — так это будет выглядеть, когда бот сообщит,
 * что по ссылке нажали «Старт». На проде вызывается вебхуком бота.
 */
export function confirmTelegram(id, username) {
  const person = store.get().list.find((p) => p.id === id);
  if (!person) return;
  updatePerson(id, { telegram: { ...person.telegram, on: true, status: 'connected', username } });
}

/** Сколько телеграм-прогнозов включено — сравнивается с PLAN_LIMITS.telegram. */
export const telegramUsed = (list) => list.filter((p) => p.telegram.on).length;

/**
 * Перенос гостевых расчётов в аккаунт при входе.
 * Переносятся ВСЕ. Открытыми остаются столько, сколько позволяет тариф,
 * остальные под замком — человек сам выберет, какие оставить открытыми.
 * Терять расчёты при входе нельзя: человек их уже сделал.
 */
export function claimGuestPeople(plan) {
  const list = store.get().list.map((p) => ({ ...p, guest: false }));
  store.set({ list });

  const limit = reportLimit(plan);
  const seen = new Set();
  list.forEach((person) => {
    const key = personKey(person);
    if (seen.has(key)) return;         // одна дата — один разбор, лимит не тратится дважды
    seen.add(key);
    if (seen.size <= limit) unlockReport(key);
  });
  return list.length;
}

/** Полная очистка — при удалении аккаунта. */
export function clearPeople() {
  store.get().list.forEach((p) => lockReport(personKey(p)));
  store.set({ list: [] });
}
