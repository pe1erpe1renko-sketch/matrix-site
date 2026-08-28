/**
 * ФОНОВЫЙ ЗВУК
 * ============
 * ПО УМОЛЧАНИЮ ВЫКЛЮЧЕН, и включать сам он не должен: браузеры блокируют
 * автозапуск со звуком, а на телефоне в транспорте это просто раздражает.
 * Включает только человек, нажав кнопку.
 *
 * Выбор запоминается: включил один раз — при следующих заходах играет сразу.
 * Это уже разрешено браузерами, потому что жест был.
 *
 * КУДА ПОЛОЖИТЬ ТРЕК: файл public/ambient.mp3. При сборке всё из public/
 * попадает в корень сайта, поэтому путь остаётся /ambient.mp3.
 * Пока файла нет, кнопка неактивна и подсказывает, что трек не подключён.
 */

import { createStore } from './devStore.js';

/** Путь к треку. Файл кладётся в public/ambient.mp3. */
export const TRACK_URL = '/ambient.mp3';

/** Тихо: фон не должен спорить с содержимым страницы. */
export const VOLUME = 0.15;

/** Сколько секунд значок зовёт нажать себя после загрузки. */
export const HINT_SECONDS = 6;

const store = createStore('matrix.sound', { enabled: false });

export const useSound = () => store.useStore();
export const setSoundEnabled = (enabled) => store.set({ enabled: Boolean(enabled) });
export const toggleSound = () => store.set({ enabled: !store.get().enabled });
