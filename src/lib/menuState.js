import { createStore } from './devStore.js';

/**
 * СОСТОЯНИЕ МЕНЮ
 * ==============
 * Раскрыт ли список «Ещё разборы». Живёт между заходами: человеку,
 * который ходит в карму и здоровье, незачем раскрывать список каждый раз.
 *
 * Ключи хранилища исторически начинаются с matrix. — они внутренние,
 * человек их не видит, а переименование стёрло бы всем сохранённое.
 */
const store = createStore('matrix.menu', { more: false }, (saved, initial) => ({
  more: typeof saved.more === 'boolean' ? saved.more : initial.more,
}));

export const useMenuOpen = () => store.useStore().more;
export const setMenuOpen = (more) => store.set({ more: Boolean(more) });
