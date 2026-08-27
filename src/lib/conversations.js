/**
 * РАЗГОВОРЫ С НАСТАВНИКОМ
 * =======================
 * Каждый разговор хранится отдельно, чтобы к нему можно было вернуться.
 * Название формируется автоматически по первому вопросу человека:
 * просить придумать заголовок — лишний шаг, который никто не делает.
 *
 * В списке истории видно: название, начало последнего ответа, о ком шла
 * речь и дата. «Новый разговор» всегда начинает пустой.
 *
 * ЗАМЕНА НА БЭКЕНД (задача 5, chat.js): заменить хранилище на таблицу,
 * структура записи остаётся.
 */

import { createStore, randomId } from './devStore.js';

const store = createStore('matrix.dev.chats', { list: [], activeId: null });

export const useConversations = () => store.useStore();

/** Название из первого вопроса: первая фраза, максимум 52 знака. */
export function titleFromQuestion(question) {
  const clean = String(question).replace(/\s+/g, ' ').trim();
  const firstSentence = clean.split(/[.?!]/)[0] || clean;
  const short = firstSentence.length > 52 ? `${firstSentence.slice(0, 52).trimEnd()}…` : firstSentence;
  return short || 'Разговор без названия';
}

/** Начать пустой разговор: он появится в истории после первого вопроса. */
export function startConversation() {
  store.set({ ...store.get(), activeId: null });
}

export function openConversation(id) {
  store.set({ ...store.get(), activeId: id });
}

/**
 * Записать пару «вопрос — ответ». Если разговора ещё нет, он создаётся
 * здесь же и получает название по первому вопросу.
 */
export function appendExchange({ question, answer, personId, personName }) {
  const state = store.get();
  const now = new Date().toISOString();
  const exchange = [
    { role: 'me', text: question, at: now },
    { role: 'bot', text: answer, at: now },
  ];

  if (!state.activeId) {
    const conversation = {
      id: randomId(),
      title: titleFromQuestion(question),
      personId,
      personName,
      messages: exchange,
      updatedAt: now,
    };
    store.set({ list: [conversation, ...state.list], activeId: conversation.id });
    return conversation.id;
  }

  store.set({
    ...state,
    list: state.list.map((c) => (c.id === state.activeId
      ? { ...c, messages: [...c.messages, ...exchange], updatedAt: now, personId, personName }
      : c)),
  });
  return state.activeId;
}

export function removeConversation(id) {
  const state = store.get();
  store.set({
    list: state.list.filter((c) => c.id !== id),
    activeId: state.activeId === id ? null : state.activeId,
  });
}

export function clearConversations() {
  store.set({ list: [], activeId: null });
}

/** Сколько вопросов задано сегодня — счётчик лимита тарифа. */
export function messagesToday(list, isoDate) {
  return list.reduce((total, conversation) => total + conversation.messages
    .filter((m) => m.role === 'me' && String(m.at).slice(0, 10) === isoDate).length, 0);
}
