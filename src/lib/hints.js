import { useSyncExternalStore } from 'react';
import { createStore } from './devStore.js';
import { ARCANA_NAMES } from './prompts.js';

/**
 * ОБЛАЧКО-ПОДСКАЗКА
 * =================
 * Одна мысль по матрице человека и переход к следующему шагу. Показывается
 * только там, где расчёт уже есть, — в кабинете, чате и на тарифах
 * подсказкам делать нечего, там человек занят делом.
 *
 * ПРАВИЛО МОЛЧАНИЯ. Подсказка не перебивает чтение: первая появляется
 * не раньше чем через 90 секунд и только когда человек остановился —
 * не прокручивал страницу десять секунд. Следующая не раньше чем через
 * пять минут и только если человек за это время что-то делал. Больше
 * трёх за день не показываем.
 *
 * ЧИСЛА берутся из уже посчитанной матрицы на этой же странице. Если
 * числа нет — подсказка молча пропускается: «аркан undefined» на экране
 * хуже, чем отсутствие подсказки.
 *
 * ОДНА ПОДСКАЗКА — ОДИН РАЗ НАВСЕГДА. Показанная попадает в список
 * увиденных в браузере и больше не возвращается, даже после перезагрузки.
 */

/* ---------- что человек делает прямо сейчас ---------- */

const SESSION_KEY = 'matrix.hints.session';

const readSession = () => {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)) || {}; } catch { return {}; }
};
const writeSession = (next) => {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(next)); } catch { /* приватное окно */ }
};

/** Человек нажал закрытый вопрос. Третий замок — повод рассказать про оплату. */
export function noteLockHit() {
  const s = readSession();
  writeSession({ ...s, locks: (s.locks || 0) + 1 });
}

export const lockHits = () => readSession().locks || 0;

/* Какая сфера раскрыта и когда раскрылась — «долго читает одну тему». */
let sphere = { id: null, at: 0 };
export const noteSphere = (id) => { sphere = { id, at: id ? Date.now() : 0 }; };
export const openSphereSeconds = () => (sphere.id ? (Date.now() - sphere.at) / 1000 : 0);

/* ---------- что показано и что выключено ---------- */

const store = createStore('matrix.hints', { off: false, seen: [], day: '', count: 0 },
  (saved, initial) => ({
    off: Boolean(saved.off),
    seen: Array.isArray(saved.seen) ? saved.seen.filter((x) => typeof x === 'string') : initial.seen,
    day: typeof saved.day === 'string' ? saved.day : initial.day,
    count: typeof saved.count === 'number' ? saved.count : 0,
  }));

const today = () => new Date().toISOString().slice(0, 10);

/** Счётчик «три за день» сам обнуляется на следующий день. */
export function hintState() {
  const s = store.get();
  return s.day === today() ? s : { ...s, day: today(), count: 0 };
}

export const useHintState = () => {
  const s = store.useStore();
  return s.day === today() ? s : { ...s, day: today(), count: 0 };
};

/** Подсказка показана: больше её не покажем никогда. */
export function markShown(id) {
  const s = hintState();
  store.set({ ...s, seen: s.seen.includes(id) ? s.seen : [...s.seen, id], count: s.count + 1 });
}

/** Переключатель в профиле, вкладка «Данные». */
export const setHintsOff = (off) => store.set({ ...hintState(), off: Boolean(off) });

/* ---------- откуда подсказка берёт числа ---------- */

let context = null;
const listeners = new Set();
const emit = () => listeners.forEach((fn) => fn());

/**
 * Страница расчёта сообщает, что на ней посчитано. Кабинет, чат и тарифы
 * не сообщают ничего — там подсказка и не появится.
 */
export function setHintContext(next) {
  context = next;
  emit();
}

export function useHintContext() {
  return useSyncExternalStore(
    (fn) => { listeners.add(fn); return () => listeners.delete(fn); },
    () => context,
    () => null
  );
}

/* ---------- сами подсказки ---------- */

/** Число по пути внутри матрицы или null, если его там нет. */
function num(matrix, path) {
  const value = String(path).split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), matrix);
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

const named = (n) => `${n} — ${ARCANA_NAMES[n]}`;

/** «1,88» → «1 год 10 месяцев»: дробные годы человеку ничего не говорят. */
function humanYears(years) {
  const months = Math.max(0, Math.round(years * 12));
  const y = Math.floor(months / 12);
  const m = months % 12;
  const parts = [];
  if (y > 0) parts.push(`${y} ${plural(y, 'год', 'года', 'лет')}`);
  if (m > 0) parts.push(`${m} ${plural(m, 'месяц', 'месяца', 'месяцев')}`);
  return parts.length ? parts.join(' ') : 'меньше месяца';
}

function plural(n, one, few, many) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

/**
 * Каждая подсказка сама собирает свой текст и сама решает, может ли она
 * быть показана: нет числа — вернула null, и её просто пропустят.
 */
export const HINTS = {
  relations: (ctx) => {
    const a = num(ctx.matrix, 'core.SW');
    if (!a) return null;
    return {
      arcana: a,
      text: `У вас на линии отношений аркан ${named(a)}. Это видно только в паре: с конкретным человеком он разворачивается совсем иначе.`,
      cta: { label: 'Проверить совместимость', to: '/sovmestimost' },
    };
  },

  money: (ctx) => {
    const a = num(ctx.matrix, 'core.SE');
    if (!a || !ctx.urlDate) return null;
    return {
      arcana: a,
      text: `Ваш денежный канал — аркан ${a}. Он показывает, через что приходит доход, но не показывает, где он перекрыт. Это соседний вопрос.`,
      cta: { label: 'Посмотреть, что мешает', to: `/dengi/${ctx.urlDate}` },
    };
  },

  day: (ctx) => {
    const a = num(ctx.matrix, 'today.dayArcana');
    const b = num(ctx.matrix, 'today.tomorrowArcana');
    if (!a || !b) return null;
    return {
      arcana: a,
      text: `Сегодня у вас аркан ${a}, завтра будет ${b}. Завтрашний придёт вечером в Telegram, если подключить.`,
      cta: { label: 'Подключить', to: '/profil' },
    };
  },

  rod: (ctx) => {
    const male = num(ctx.matrix, 'ancestral.male.result');
    const female = num(ctx.matrix, 'ancestral.female.result');
    if (!male || !female || !ctx.urlDate) return null;
    return {
      arcana: male,
      text: `Итог мужской линии — ${male}, женской — ${female}. Разница между ними и есть то, что вы разбираете всю жизнь.`,
      cta: { label: 'Открыть род', to: `/rod/${ctx.urlDate}` },
    };
  },

  period: (ctx) => {
    const a = num(ctx.matrix, 'today.arcana');
    const left = num(ctx.matrix, 'today.yearsToChange');
    if (!a || left === null || !ctx.urlDate) return null;
    return {
      arcana: a,
      text: `Вы в периоде аркана ${a}, он сменится через ${humanYears(left)}. То, что даётся тяжело сейчас, часто отпускает при смене периода.`,
      cta: { label: 'Посмотреть прогноз', to: `/prognoz/${ctx.urlDate}` },
    };
  },

  core: (ctx) => {
    const a = num(ctx.matrix, 'core.C');
    if (!a) return null;
    return {
      arcana: a,
      text: `Ядро вашей матрицы — аркан ${a}. Всё остальное строится вокруг него, включая то, что вы только что прочитали.`,
      cta: { label: 'Открыть личность', to: `${ctx.path}?section=personality` },
    };
  },

  sphere: () => ({
    arcana: null,
    text: 'Похоже, эта тема отзывается. Наставник видит всю вашу матрицу и разберёт её глубже, чем короткий ответ.',
    cta: { label: 'Спросить наставника', to: '/chat' },
  }),

  paywall: () => ({
    arcana: null,
    text: 'По вашей дате посчитаны все 92 вопроса, включая закрытые. Оплата открывает их целиком.',
    cta: { label: 'Посмотреть тарифы', to: '/tarify' },
  }),

  people: () => ({
    arcana: null,
    text: 'Матрица считается по любой дате — своей или чужой. Посмотрите, что происходит у близких.',
    cta: { label: 'Посчитать близкого', anchor: 'next-people' },
  }),

  form: () => ({
    arcana: null,
    text: 'Расчёт бесплатный, регистрация не нужна. Введите дату — ядро матрицы откроется сразу.',
  }),
};

/** Порядок «любая неиспользованная»: сначала то, что ближе к продукту. */
const POOL = ['relations', 'money', 'day', 'rod', 'period', 'people'];

/**
 * Что показать. По порядку, первое подходящее:
 *   1. человек долго читает одну сферу
 *   2. только открыл разбор впервые
 *   3. разбор не оплачен и он упёрся в третий замок
 *   4. любая неиспользованная
 */
export function pickHint(ctx, state) {
  if (!ctx) return null;
  const seen = new Set(state.seen);

  const order = ctx.kind === 'form' ? ['form'] : [
    ...(openSphereSeconds() > 45 ? ['sphere'] : []),
    ...(ctx.firstOpen ? ['core'] : []),
    ...(!ctx.unlocked && lockHits() >= 3 ? ['paywall'] : []),
    ...POOL,
  ];

  for (const id of order) {
    if (seen.has(id)) continue;
    const built = HINTS[id] && HINTS[id](ctx);
    if (built) return { id, ...built };
  }
  return null;
}
