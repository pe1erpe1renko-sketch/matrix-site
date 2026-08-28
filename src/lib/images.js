import { createStore } from './devStore.js';
import { PLAN_LIMITS, BOLT_COST } from './plans.js';
import { calculateMatrix, calculatePair } from './matrixEngine.js';
import { ARCANA_NAMES } from './prompts.js';

/**
 * AI-ОБРАЗЫ
 * =========
 * Картинка-талисман по матрице человека: его иллюстрация аркана,
 * подписанная его именем. Её ставят на заставку телефона и отправляют
 * близким — это единственная механика, которая приводит новых людей
 * без затрат на рекламу.
 *
 * НЕЙРОСЕТЬ ПРИ НАЖАТИИ НЕ ВЫЗЫВАЕТСЯ. Образ собирается из готовых
 * материалов: иллюстрация аркана из public/arcana плюс оформление,
 * нарисованное кодом. Поэтому он появляется мгновенно и ничего не стоит.
 * Сцена генерации на две секунды — это оформление ожидания, а не работа.
 *
 * ЧИСЛО У КАЖДОЙ ТЕМЫ СВОЁ и берётся из уже посчитанной матрицы
 * по пути из карты позиций. Пары и подарок считают отдельную матрицу
 * по введённым датам.
 */

/* ---------- семь тем ---------- */

export const IMAGE_THEMES = [
  {
    id: 'resource', name: 'Ресурс и сила', accent: '#6BBF8A',
    from: 'Ядро матрицы', path: 'core.C',
    about: 'Образ тихой уверенности. Возвращает в состояние «я справлюсь», когда сил нет.',
    text: 'Когда вы устали, перегорели или чувствуете, что нет опоры, — этот образ возвращает в состояние тихой уверенности. Спокойствие, устойчивость, ощущение «я справлюсь».',
    hint: 'Посмотрите на него 10–15 секунд и отметьте, где в теле стало спокойнее.',
  },
  {
    id: 'money', name: 'Энергия денег', accent: '#E4BE72',
    from: 'Денежный канал', path: 'core.SE',
    about: 'Образ вашего денежного потока: про право получать и про то, что режет деньги на входе.',
    text: 'Помогает почувствовать изобилие, уверенность и право получать, а ещё мягко подсвечивает то, что чаще всего режет деньги на входе.',
    hint: 'Смотрите на образ 15 секунд и сформулируйте одну мысль — «я разрешаю себе получать».',
  },
  {
    id: 'love', name: 'Образ любви', accent: '#E68AB0',
    from: 'Линия отношений', path: 'core.SW',
    about: 'Про тепло, близость и состояние «меня выбирают».',
    text: 'Про тепло, близость и состояние «меня выбирают». Он нужен, когда хочется любви без качелей, нежности без тревоги и отношений, где вам спокойно быть собой.',
    hint: 'Возвращайтесь к нему, когда хочется тепла без тревоги.',
  },
  {
    id: 'power', name: 'Женская сила', accent: '#B79CE8',
    from: 'Сексуальная энергия', path: 'chakras.rows.5.energy',
    about: 'Образ притягательности и мягкой силы — без суеты и доказательств.',
    text: 'Про ощущение «я ценна», мягкую силу, взгляд, осанку — состояние, в котором к вам тянутся без суеты и доказательств.',
    hint: 'Сохраните и возвращайтесь, когда хочется чувствовать себя желанной.',
  },
  {
    id: 'shadow', name: 'Ваша тень', accent: '#8E7CC3',
    from: 'Теневая точка', path: 'diagonals.SW.mid',
    about: 'Это не про плохое. Это про скрытую силу, которую вы сдерживаете.',
    text: 'Это не про плохое. Это про скрытую силу. Тень — там, где вы себя сдерживаете, боитесь проявиться или слишком стараетесь быть удобной. Образ показывает, какая мощь в вас спрятана.',
    hint: 'Посмотрите — где на картинке вы настоящая, без роли и маски?',
  },
  {
    id: 'pair', name: 'Совместимость', accent: '#E68AB0',
    from: 'Ядро матрицы пары', kind: 'pair',
    about: 'Как выглядит ваша энергия вместе: притяжение, баланс и напряжение в одном образе.',
    text: 'Хотите увидеть, как выглядит ваша энергия вместе — без догадок? Притяжение, баланс, напряжение и общий стиль союза в одном образе.',
    hint: 'Посмотрите, что в этом образе про страсть, что про спокойствие, а что про урок.',
  },
  {
    id: 'gift', name: 'Подарок близкому', accent: '#4AA8E0',
    from: 'Ядро его матрицы', kind: 'gift',
    about: 'Персональный образ по матрице другого человека — по его дате рождения.',
    text: 'Тёплый и необычный подарок: персональный образ по матрице другого человека, по его дате рождения. Тот самый подарок, который хочется сохранить и пересматривать.',
    hint: 'Готово. Отправьте — и человек увидит свой образ.',
  },
];

export const themeById = (id) => IMAGE_THEMES.find((t) => t.id === id) || null;

/** Строки сцены ожидания. Работы за ними нет, и это честно: см. заголовок. */
export const LOADING_LINES = [
  'Настраиваю ваш контур…',
  'Собираю цвета вашей силы…',
  'Ещё немного — и образ проявится…',
];

/* ---------- какое число берёт тема ---------- */

function pick(matrix, path) {
  const value = String(path).split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), matrix);
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

/**
 * Аркан темы. Обычные темы читают матрицу человека, парная считает
 * матрицу пары, подарок — матрицу того, кому дарят.
 *
 * @returns {number|null} null, если чисел не хватает: тогда образ
 *          просто не собирается, а не показывает «аркан undefined».
 */
export function themeArcana(theme, { matrix, secondDate, giftDate, birthDate }) {
  if (!theme) return null;

  if (theme.kind === 'pair') {
    if (!birthDate || !secondDate) return null;
    try {
      return pick(calculatePair(birthDate, secondDate), 'core.C');
    } catch {
      return null;
    }
  }

  if (theme.kind === 'gift') {
    if (!giftDate) return null;
    try {
      return pick(calculateMatrix(giftDate), 'core.C');
    } catch {
      return null;
    }
  }

  return matrix ? pick(matrix, theme.path) : null;
}

export const arcanaName = (n) => ARCANA_NAMES[n] || '';

/* ---------- сколько стоит ---------- */

const store = createStore('matrix.images', { list: [] }, (saved, initial) => ({
  list: Array.isArray(saved.list) ? saved.list.slice(0, 60) : initial.list,
}));

export const useImages = () => store.useStore().list;
export const imagesMade = () => store.get().list;

const monthKey = (iso) => String(iso).slice(0, 7);

/** Сколько образов сделано в текущем месяце — лимит тарифа месячный. */
export function madeThisMonth(list) {
  const now = monthKey(new Date().toISOString());
  return list.filter((x) => monthKey(x.at) === now).length;
}

/**
 * Что стоит следующий образ.
 *
 * ПЕРВЫЙ ОБРАЗ БЕСПЛАТЕН ВСЕГДА И ВСЕМ — это канал привлечения,
 * а не расход: нейросеть не вызывается, картинка уже есть.
 * Дальше работает месячный лимит тарифа, а сверх него — молнии.
 */
export function imageCost(plan, list) {
  if (list.length === 0) return { free: true, reason: 'first' };
  const limit = PLAN_LIMITS[plan]?.images ?? 0;
  if (madeThisMonth(list) < limit) return { free: true, reason: 'plan' };
  return { free: false, cost: BOLT_COST.image };
}

/** Записать созданный образ. Возвращает его id — он же адрес /obraz/{id}. */
export function rememberImage(image) {
  const id = encodeImageId(image);
  const { list } = store.get();
  store.set({ list: [{ ...image, id, at: new Date().toISOString() }, ...list].slice(0, 60) });
  return id;
}

/* ---------- ссылка на образ ---------- */

/**
 * Идентификатор образа — это сам образ, упакованный в строку.
 *
 * Так ссылка работает у чужого человека без нашей базы: он открывает
 * /obraz/… и видит картинку, а не пустую страницу. Когда появится
 * бэкенд, id станет коротким кодом, а содержимое переедет в таблицу —
 * страница ObrazShare читает его через одну функцию decodeImageId.
 */
export function encodeImageId({ themeId, arcana, who, date }) {
  const packed = JSON.stringify({ t: themeId, a: arcana, w: who || '', d: date || '' });
  try {
    const bytes = new TextEncoder().encode(packed);
    let binary = '';
    bytes.forEach((b) => { binary += String.fromCharCode(b); });
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch {
    return '';
  }
}

export function decodeImageId(id) {
  try {
    const base = String(id).replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(base + '==='.slice((base.length + 3) % 4));
    const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
    const data = JSON.parse(new TextDecoder().decode(bytes));
    if (!data || typeof data.a !== 'number') return null;
    return { themeId: data.t, arcana: data.a, who: data.w, date: data.d };
  } catch {
    return null;
  }
}
