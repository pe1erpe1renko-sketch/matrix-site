/**
 * КАРТА ПОЗИЦИЙ
 * =============
 * Единственный источник правды о том, из чего состоит разбор.
 * Отсюда берут данные: экран результата, пейволл, PDF, генерация текстов.
 *
 * Каждый раздел (section) состоит из слотов (slot).
 * Слот — это одна позиция матрицы, для которой нужен свой текст.
 *
 * path — адрес числа внутри результата calculateMatrix().
 * Например 'core.SE' → matrix.core.SE, 'chakras.rows.4.physics' → 5-я строка.
 *
 * КЛЮЧ ТЕКСТА в базе: `${slot.id}_${аркан}`  →  'money_channel_main_20'
 */

/**
 * СФЕРЫ И ВОПРОСЫ
 * ===============
 * Разбор устроен не как 25 длинных статей, а как набор сфер, внутри
 * каждой — от шести до десяти коротких вопросов. Человек нажимает на
 * вопрос и получает ответ именно на него.
 *
 * Смысл дробления: длинный текст читают один раз и закрывают. Список
 * вопросов хочется прокликать целиком, потому что каждый следующий
 * заголовок звучит как «это про меня».
 *
 * ДОСТУП: у каждой сферы есть access по умолчанию, но отдельные вопросы
 * могут быть помечены free: true — они открыты всем. В каждой сфере
 * открыт хотя бы один вопрос, чтобы человек попробовал везде.
 *
 * ПУТИ МОГУТ ПОВТОРЯТЬСЯ. Это не ошибка: один и тот же Аркан в позиции
 * «денежный канал» и в позиции «что мешает сближаться» читается
 * по-разному. Текст привязан к паре «вопрос + число», а не к числу.
 *
 * ИДЕНТИФИКАТОРЫ НЕ ПЕРЕИМЕНОВЫВАТЬ. На пяти из них висят эталонные
 * тексты из seedTexts.js: character_day, comfort_core, money_channel_main,
 * relation_line, purpose_personal.
 */

export const SECTIONS = [
  // ─────────────────────────────────────────────
  {
    id: 'personality',
    title: 'Личность',
    lead: 'Кто вы на самом деле и каким вас видят снаружи.',
    access: 'paid',
    slots: [
      { id: 'character_day',   label: 'Каким вас видят с первого взгляда', path: 'core.W', free: true },
      { id: 'core_soul',       label: 'Ваш центральный аркан: ядро души',  path: 'core.C', free: true },
      { id: 'comfort_core',    label: 'Что даёт вам опору',                path: 'core.C' },
      { id: 'person_strength', label: 'Сильные стороны',                   path: 'core.N' },
      { id: 'person_shadow',   label: 'Ваша теневая сторона',              path: 'diagonals.SW.mid' },
      { id: 'person_pressure', label: 'Как вы ведёте себя под давлением',  path: 'core.S' },
      { id: 'person_talk',     label: 'Как с вами лучше разговаривать',    path: 'chakras.rows.2.emotions' },
      { id: 'person_hide',     label: 'Что вы прячете от других',          path: 'chakras.rows.1.emotions' },
      { id: 'person_grow',     label: 'Зона роста',                        path: 'axes.vertical.startInner' },
    ],
  },

  // ─────────────────────────────────────────────
  {
    id: 'purpose',
    title: 'Предназначение',
    lead: 'Зачем вы здесь и куда ведёт ваш путь.',
    access: 'paid',
    slots: [
      { id: 'purpose_personal',  label: 'Поиск себя',                      path: 'purpose.personal.result', free: true },
      { id: 'purpose_social',    label: 'Реализация в социуме',            path: 'purpose.social.result' },
      { id: 'purpose_spiritual', label: 'Духовная задача',                 path: 'purpose.spiritual.result' },
      { id: 'purpose_planetary', label: 'Планетарное предназначение',      path: 'purpose.planetary.result' },
      { id: 'purpose_before40',  label: 'Предназначение до 40 лет',        path: 'core.E' },
      { id: 'purpose_after40',   label: 'Предназначение после 40 лет',     path: 'core.S' },
      { id: 'purpose_talents',   label: 'Таланты, которые надо раскрыть',  path: 'core.N' },
      { id: 'purpose_vector',    label: 'Куда двигаться дальше',           path: 'purpose.personal.earth' },
    ],
  },

  // ─────────────────────────────────────────────
  {
    id: 'money',
    title: 'Деньги',
    lead: 'Где ваш поток усиливается, а где теряется.',
    access: 'paid',
    slots: [
      { id: 'money_channel_main', label: 'Ваш денежный канал',             path: 'core.SE', free: true },
      { id: 'money_channel_way',  label: 'Как раскрыть канал',             path: 'diagonals.SE.mid' },
      { id: 'money_block',        label: 'Что перекрывает деньги',         path: 'diagonals.SE.outer' },
      { id: 'money_balance',      label: 'Баланс «даю — получаю»',         path: 'chakras.rows.4.emotions' },
      { id: 'money_status',       label: 'Отношения со статусом',          path: 'chakras.rows.4.physics' },
      { id: 'money_growth',       label: 'Путь к росту дохода',            path: 'purpose.social.result' },
      { id: 'money_profession',   label: 'Деньги через профессию',         path: 'core.N' },
      { id: 'money_partners',     label: 'Партнёрства и сотрудничество',   path: 'core.SW' },
      { id: 'money_move',         label: 'Переезд, смена города и страны', path: 'axes.horizontal.endMid' },
      { id: 'money_rod',          label: 'Денежная программа рода',        path: 'ancestral.male.result' },
    ],
  },

  // ─────────────────────────────────────────────
  {
    id: 'relations',
    title: 'Отношения',
    lead: 'Ваш сценарий в любви и то, что его держит.',
    access: 'paid',
    slots: [
      { id: 'relation_line',    label: 'Ваш сценарий в любви',            path: 'core.SW', free: true },
      { id: 'relation_partner', label: 'Какой партнёр вам подходит',      path: 'core.NE' },
      { id: 'relation_way',     label: 'Путь к гармонии',                 path: 'diagonals.SW.mid' },
      { id: 'relation_block',   label: 'Барьер близости',                 path: 'diagonals.SW.outer' },
      { id: 'relation_repeat',  label: 'Что повторяется из раза в раз',   path: 'core.S' },
      { id: 'relation_karma',   label: 'Кармические узлы в отношениях',   path: 'chakras.rows.3.energy' },
      { id: 'relation_heart',   label: 'Состояние сердечного центра',     path: 'chakras.rows.3.emotions' },
      { id: 'relation_attract', label: 'Чем вы притягиваете',             path: 'core.W' },
      { id: 'relation_fear',    label: 'Чего вы боитесь в близости',      path: 'diagonals.NE.mid' },
      { id: 'sex_energy',       label: 'Сексуальность и притяжение',      path: 'chakras.rows.5.energy' },
    ],
  },

  // ─────────────────────────────────────────────
  {
    id: 'karma',
    title: 'Карма',
    lead: 'Глубинные задачи, которые приходят раз за разом.',
    access: 'paid',
    slots: [
      { id: 'karma_main',    label: 'Главная кармическая задача',        path: 'core.S', free: true },
      { id: 'karma_debt',    label: 'Кармический долг',                  path: 'axes.vertical.endOuter' },
      { id: 'karma_tail',    label: 'Что тянется из прошлого',           path: 'diagonals.NE.outer' },
      { id: 'karma_repeat',  label: 'Повторяющиеся события',             path: 'axes.vertical.startOuter' },
      { id: 'karma_before40', label: 'Задача до 40 лет',                 path: 'core.E' },
      { id: 'karma_lesson',  label: 'Урок, который вы обходите',         path: 'diagonals.NW.mid' },
      { id: 'karma_fear',    label: 'Тени и страхи по арканам',          path: 'chakras.rows.1.energy' },
      { id: 'karma_weak',    label: 'Слабые точки энергии',              path: 'chakras.rows.2.energy' },
    ],
  },

  // ─────────────────────────────────────────────
  {
    id: 'ancestry',
    title: 'Род',
    lead: 'Что передано вам по обеим линиям и что с этим делать.',
    access: 'paid',
    slots: [
      { id: 'male_result',   label: 'Итог мужской линии',                path: 'ancestral.male.result', free: true },
      { id: 'male_first',    label: 'Первая программа по отцу',          path: 'ancestral.male.first' },
      { id: 'male_second',   label: 'Вторая программа по отцу',          path: 'ancestral.male.second' },
      { id: 'female_result', label: 'Итог женской линии',                path: 'ancestral.female.result' },
      { id: 'female_first',  label: 'Первая программа по матери',        path: 'ancestral.female.first' },
      { id: 'female_second', label: 'Вторая программа по матери',        path: 'ancestral.female.second' },
      { id: 'rod_gift',      label: 'Дары рода: на что опереться',       path: 'core.NW' },
      { id: 'rod_task',      label: 'Что стоит остановить на себе',      path: 'core.NE' },
      { id: 'rod_arcana',    label: 'Родовой аркан',                     path: 'purpose.social.result' },
    ],
  },

  // ─────────────────────────────────────────────
  {
    id: 'resource',
    title: 'Ресурс и энергия',
    lead: 'Что вас наполняет и куда утекают силы.',
    access: 'paid',
    slots: [
      { id: 'energy_source',  label: 'Что вас наполняет',                path: 'chakras.rows.3.physics', free: true },
      { id: 'energy_leak',    label: 'Куда утекает энергия',             path: 'chakras.total.energy' },
      { id: 'energy_burnout', label: 'Что вызывает выгорание',           path: 'chakras.rows.2.energy' },
      { id: 'energy_restore', label: 'Как восстанавливаться',            path: 'chakras.rows.6.physics' },
      { id: 'energy_hygiene', label: 'Энергетическая гигиена',           path: 'chakras.rows.1.energy' },
      { id: 'rest_joy',       label: 'Источник радости',                 path: 'chakras.rows.5.physics' },
      { id: 'energy_weak',    label: 'Слабое звено',                     path: 'chakras.rows.4.energy' },
      { id: 'energy_total',   label: 'Общий эмоциональный фон',          path: 'chakras.total.emotions' },
    ],
  },

  // ─────────────────────────────────────────────
  {
    id: 'health',
    title: 'Здоровье',
    lead: 'Зоны внимания в теле и в состоянии. Не диагноз.',
    access: 'paid',
    slots: [
      { id: 'health_physics',  label: 'Итог: физика',                    path: 'chakras.total.physics', free: true },
      { id: 'health_energy',   label: 'Итог: энергия',                   path: 'chakras.total.energy' },
      { id: 'health_emotions', label: 'Итог: эмоции',                    path: 'chakras.total.emotions' },
      { id: 'body_base',       label: 'Муладхара: тело и материя',       path: 'chakras.rows.6.energy' },
      { id: 'health_stress',   label: 'Как тело реагирует на стресс',    path: 'chakras.rows.4.energy' },
      { id: 'health_attention', label: 'Зоны внимания',                  path: 'chakras.rows.5.emotions' },
      { id: 'health_mind',     label: 'Ум и тревога',                    path: 'chakras.rows.0.emotions' },
    ],
  },

  // ─────────────────────────────────────────────
  {
    id: 'family',
    title: 'Дети и родители',
    lead: 'Что происходит в связи поколений.',
    access: 'paid',
    slots: [
      { id: 'parents_link',    label: 'Связь с родителями',              path: 'chakras.rows.5.physics', free: true },
      { id: 'parents_task',    label: 'Что осталось непрожитым',         path: 'core.S' },
      { id: 'children_energy', label: 'Какую энергию вы передаёте детям', path: 'chakras.rows.5.emotions' },
      { id: 'children_role',   label: 'Ваша роль как родителя',          path: 'core.C' },
      { id: 'children_talent', label: 'На что обратить внимание в ребёнке', path: 'core.N' },
      { id: 'family_mother',   label: 'Отношения с матерью',             path: 'ancestral.female.first' },
      { id: 'family_father',   label: 'Отношения с отцом',               path: 'ancestral.male.first' },
    ],
  },

  // ─────────────────────────────────────────────
  {
    id: 'work',
    title: 'Профессия и реализация',
    lead: 'Где ваша энергия раскрывается в деле.',
    access: 'paid',
    slots: [
      { id: 'profession_talent', label: 'Профессиональный талант',       path: 'core.N', free: true },
      { id: 'profession_social', label: 'Реализация в социуме',          path: 'purpose.social.result' },
      { id: 'work_style',        label: 'Ваш стиль работы',              path: 'core.C' },
      { id: 'work_env',          label: 'В какой среде вы раскрываетесь', path: 'axes.horizontal.startMid' },
      { id: 'work_block',        label: 'Что мешает в карьере',          path: 'diagonals.NW.outer' },
      { id: 'brand_face',        label: 'Как вас видят коллеги',         path: 'core.W' },
      { id: 'brand_talent',      label: 'На чём строить личный бренд',   path: 'axes.horizontal.startOuter' },
      { id: 'work_lead',         label: 'Вы руководитель или исполнитель', path: 'core.E' },
    ],
  },

  // ─────────────────────────────────────────────
  {
    id: 'year',
    title: 'Личный год',
    lead: 'Какая энергия ведёт вас ближайшие двенадцать месяцев.',
    access: 'paid',
    yearly: true,
    slots: [
      { id: 'year_arcana',  label: 'Ваш аркан года',                     path: 'today.yearArcana', free: true },
      { id: 'year_focus',   label: 'На чём сосредоточиться',             path: 'today.yearArcana' },
      { id: 'year_risk',    label: 'Чего избегать в этом году',          path: 'today.yearArcana' },
      { id: 'year_money',   label: 'Деньги в этом году',                 path: 'core.SE' },
      { id: 'year_love',    label: 'Отношения в этом году',              path: 'core.SW' },
    ],
  },

  // ─────────────────────────────────────────────
  {
    id: 'forecast',
    title: 'Прогноз',
    lead: 'Ваша энергия на сегодня и на текущий отрезок жизни.',
    access: 'free',
    slots: [
      { id: 'day_energy',  label: 'Аркан дня',                           path: 'today.dayArcana', daily: true },
      { id: 'year_energy', label: 'Энергия периода жизни',               path: 'today.arcana' },
      { id: 'period_next', label: 'Что принесёт следующий период',       path: 'today.nextArcana' },
    ],
  },
];


// ═══════════════════════════════════════════════════════════
// СЛУЖЕБНОЕ
// ═══════════════════════════════════════════════════════════

/** Достаёт число из результата матрицы по строковому пути. */
export function resolvePath(matrix, path) {
  const value = path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), matrix);
  if (typeof value !== 'number') {
    throw new Error(`Путь "${path}" не даёт число. Проверьте карту позиций.`);
  }
  return value;
}

/** Ключ текста в базе: 'money_channel_main_20' */
export const textKey = (slotId, arcana) => `${slotId}_${arcana}`;

/**
 * Ключ текста аркана дня: 'day_10_21_2026-08-25'
 *
 * В ключе ТРИ части: аркан дня, аркан периода и дата.
 * Дата обязательна. Без неё человек через три недели получит текст,
 * который уже читал: аркан периода у него заморожен на 2,5 года, а аркан
 * дня идёт почти по кругу. С датой повторов не бывает никогда.
 *
 * Сколько это стоит: в конкретный день дата у всех одна, поэтому разных
 * сочетаний максимум 22 — по одному на каждый возможный аркан периода.
 * То есть не больше 22 генераций в сутки НА ВЕСЬ СЕРВИС, сколько бы
 * пользователей ни было. Текст пишется на числа, а не на человека;
 * имя подставляется шаблоном при выводе и генерации не требует.
 */
export const dailyTextKey = (dayArcana, periodArcana, isoDate) =>
  `day_${dayArcana}_${periodArcana}_${isoDate}`;

// ═══════════════════════════════════════════════════════════
// ТОЧКИ ОКТАГРАММЫ
// ═══════════════════════════════════════════════════════════

/**
 * Кликабельные точки на схеме. Панель точки показывает короткую подсказку
 * (2–3 предложения), а кнопка «Подробнее» ведёт в раздел разбора.
 *
 * Названия промежуточных точек осей даны по чакрам: горизонтальная ось —
 * колонка «Физика», вертикальная — «Энергия». Порядок строк тот же, что
 * в CHAKRAS: Сахасрара, Аджна, Вишудха, Анахата, Манипура, Свадхистана,
 * Муладхара. Крайние точки осей и центр совпадают с внешними точками
 * октаграммы, поэтому отдельными записями не дублируются.
 */
export const POINT_SLOTS = [
  // Внешние точки и центр
  { id: 'point_W',  label: 'Портрет личности',   path: 'core.W'  },
  { id: 'point_N',  label: 'Таланты',            path: 'core.N'  },
  { id: 'point_E',  label: 'Родовой дар',        path: 'core.E'  },
  { id: 'point_S',  label: 'Кармическая задача', path: 'core.S'  },
  { id: 'point_C',  label: 'Зона комфорта',      path: 'core.C'  },
  { id: 'point_NW', label: 'Мужская линия рода', path: 'core.NW' },
  { id: 'point_NE', label: 'Женская линия рода', path: 'core.NE' },
  { id: 'point_SE', label: 'Денежный канал',     path: 'core.SE' },
  { id: 'point_SW', label: 'Линия отношений',    path: 'core.SW' },

  // Промежуточные точки горизонтальной оси — колонка «Физика»
  { id: 'point_h_ajna',      label: 'Аджна · Физика',       path: 'axes.horizontal.startOuter' },
  { id: 'point_h_vishuddha', label: 'Вишудха · Физика',     path: 'axes.horizontal.startMid'   },
  { id: 'point_h_anahata',   label: 'Анахата · Физика',     path: 'axes.horizontal.startInner' },
  { id: 'point_h_svadhi',    label: 'Свадхистана · Физика', path: 'axes.horizontal.endMid'     },

  // Промежуточные точки вертикальной оси — колонка «Энергия»
  { id: 'point_v_ajna',      label: 'Аджна · Энергия',       path: 'axes.vertical.startOuter' },
  { id: 'point_v_vishuddha', label: 'Вишудха · Энергия',     path: 'axes.vertical.startMid'   },
  { id: 'point_v_anahata',   label: 'Анахата · Энергия',     path: 'axes.vertical.startInner' },
  { id: 'point_v_svadhi',    label: 'Свадхистана · Энергия', path: 'axes.vertical.endMid'     },

  // Родовые лучи: точка ближе к углу и середина луча
  { id: 'point_nw_outer', label: 'Мужская линия · ближняя точка', path: 'diagonals.NW.outer' },
  { id: 'point_nw_mid',   label: 'Мужская линия · середина',      path: 'diagonals.NW.mid'   },
  { id: 'point_ne_outer', label: 'Женская линия · ближняя точка', path: 'diagonals.NE.outer' },
  { id: 'point_ne_mid',   label: 'Женская линия · середина',      path: 'diagonals.NE.mid'   },
  { id: 'point_se_outer', label: 'Денежный канал · блок',         path: 'diagonals.SE.outer' },
  { id: 'point_se_mid',   label: 'Денежный канал · раскрытие',    path: 'diagonals.SE.mid'   },
  { id: 'point_sw_outer', label: 'Отношения · барьер',            path: 'diagonals.SW.outer' },
  { id: 'point_sw_mid',   label: 'Отношения · путь к гармонии',   path: 'diagonals.SW.mid'   },
];

/**
 * Ищет раздел разбора, в котором расписана эта же точка.
 * Нужна для кнопки «Подробнее» в панели точки.
 * @returns {{sectionId: string, sectionTitle: string, access: string}|null}
 */
export function findSectionForPoint(path) {
  for (const section of SECTIONS) {
    if (section.slots.some((slot) => slot.path === path)) {
      return { sectionId: section.id, sectionTitle: section.title, access: section.access };
    }
  }
  return null; // точка используется только в чакральной таблице — кнопку не показываем
}

// ═══════════════════════════════════════════════════════════
// РАЗДЕЛЫ ДЛЯ ПАРНЫХ РАСЧЁТОВ
// ═══════════════════════════════════════════════════════════

/**
 * Совместимость и бизнес-совместимость считаются по одной матрице пары
 * (calculatePair), но читаются по-разному: одна про близость, вторая про
 * деньги и роли. Поэтому наборы слотов разные, а пути к числам — общие.
 */
export const PAIR_SECTIONS = {
  love: [
    {
      id: 'pair_meeting',
      title: 'Зачем вы встретились',
      lead: 'Общая задача пары и то, ради чего вас свело.',
      access: 'free',
      slots: [
        { id: 'pair_purpose', label: 'Задача пары',   path: 'purpose.personal.result' },
        { id: 'pair_core',    label: 'Ядро союза',    path: 'core.C' },
      ],
    },
    {
      id: 'pair_daily',
      title: 'Как пара проявляется',
      lead: 'Что видят окружающие и как вы ведёте себя вдвоём.',
      access: 'paid',
      slots: [
        { id: 'pair_face',    label: 'Лицо пары',     path: 'core.W' },
        { id: 'pair_comfort', label: 'Зона комфорта', path: 'core.C' },
      ],
    },
    {
      id: 'pair_money',
      title: 'Деньги в паре',
      lead: 'Общий финансовый поток и где он перекрывается.',
      access: 'paid',
      slots: [
        { id: 'pair_money_channel', label: 'Денежный канал пары', path: 'core.SE' },
        { id: 'pair_money_block',   label: 'Финансовый блок',     path: 'diagonals.SE.outer' },
      ],
    },
    {
      id: 'pair_friction',
      title: 'Где вы упираетесь',
      lead: 'Сценарий, который повторяется, и что его запускает.',
      access: 'paid',
      slots: [
        { id: 'pair_barrier', label: 'Барьер близости', path: 'diagonals.SW.outer' },
        { id: 'pair_way',     label: 'Путь к гармонии', path: 'diagonals.SW.mid' },
      ],
    },
    {
      id: 'pair_merge',
      title: 'Слияние и гармония',
      lead: 'Объединение родов и зрелая стадия отношений.',
      access: 'paid',
      slots: [
        { id: 'pair_merge_result',   label: 'Слияние',  path: 'purpose.social.result' },
        { id: 'pair_harmony_result', label: 'Гармония', path: 'purpose.spiritual.result' },
      ],
    },
  ],

  business: [
    {
      id: 'biz_why',
      title: 'Зачем вам общее дело',
      lead: 'Задача связки и её сильная сторона.',
      access: 'free',
      slots: [
        { id: 'biz_purpose', label: 'Задача связки', path: 'purpose.personal.result' },
        { id: 'biz_core',    label: 'Ядро связки',   path: 'core.C' },
      ],
    },
    {
      id: 'biz_roles',
      title: 'Кто за что отвечает',
      lead: 'Распределение ролей и где они пересекутся.',
      access: 'paid',
      slots: [
        { id: 'biz_driver',  label: 'Кто двигает дело', path: 'core.N' },
        { id: 'biz_anchor',  label: 'Кто удерживает',   path: 'core.E' },
      ],
    },
    {
      id: 'biz_money',
      title: 'Деньги и дележ',
      lead: 'Общая денежная зона и риски вокруг неё.',
      access: 'paid',
      slots: [
        { id: 'biz_money_channel', label: 'Денежный канал', path: 'core.SE' },
        { id: 'biz_money_risk',    label: 'Где теряете',    path: 'diagonals.SE.outer' },
      ],
    },
    {
      id: 'biz_conflict',
      title: 'Как поведёте себя в конфликте',
      lead: 'Точка трения и способ её пройти.',
      access: 'paid',
      slots: [
        { id: 'biz_friction', label: 'Точка трения', path: 'diagonals.SW.outer' },
        { id: 'biz_solution', label: 'Как проходить', path: 'diagonals.SW.mid' },
      ],
    },
    {
      id: 'biz_result',
      title: 'Результат в социуме',
      lead: 'Чего связка добьётся вместе.',
      access: 'paid',
      slots: [
        { id: 'biz_social', label: 'Реализация', path: 'purpose.social.result' },
      ],
    },
  ],
};

// ═══════════════════════════════════════════════════════════
// ТЕМАТИЧЕСКИЕ СТРАНИЦЫ
// ═══════════════════════════════════════════════════════════

/**
 * ПРАВИЛО ОПЛАТЫ: платят за дату, а не за калькулятор.
 * Один купленный разбор открывает всё, что считается по этой дате —
 * общую матрицу, финансовый вход и прогноз. Детская считается по дате
 * ребёнка, совместимость — по двум датам, поэтому это отдельные разборы
 * и они списывают отдельную единицу из лимита тарифа.
 */

/** Собственные разделы финансовой страницы — сверх общих денежных. */
export const FINANCE_EXTRA = [
  {
    id: 'fin_scenario',
    title: 'Ваш сценарий заработка',
    lead: 'Как именно к вам приходит доход и почему другие способы не работают.',
    access: 'paid',
    slots: [
      { id: 'fin_way',    label: 'Способ заработка',   path: 'core.SE' },
      { id: 'fin_effort', label: 'Чего это стоит',     path: 'diagonals.SE.mid' },
    ],
  },
  {
    id: 'fin_spending',
    title: 'Отношение к тратам',
    lead: 'Что происходит с деньгами, когда они уже у вас.',
    access: 'paid',
    slots: [
      { id: 'fin_status', label: 'Статус и владение', path: 'chakras.rows.4.physics' },
      { id: 'fin_hold',   label: 'Умение удерживать', path: 'chakras.total.physics' },
    ],
  },
  {
    id: 'fin_family',
    title: 'Финансовая программа рода',
    lead: 'Что вы унаследовали в отношении к деньгам.',
    access: 'paid',
    slots: [
      { id: 'fin_rod_male',   label: 'По линии отца',  path: 'ancestral.male.result' },
      { id: 'fin_rod_female', label: 'По линии матери', path: 'ancestral.female.result' },
    ],
  },
];

/**
 * Детская матрица. Разделы свои: общие написаны для взрослого о себе,
 * здесь тон другой — родитель читает про ребёнка.
 * Считается по дате ребёнка, поэтому это отдельный разбор.
 */
export const CHILD_SECTIONS = [
  {
    id: 'child_nature',
    title: 'С чем ребёнок родился',
    lead: 'Природные данные, которые есть до всякого воспитания.',
    access: 'free',
    slots: [
      { id: 'child_talent',  label: 'Главный талант',    path: 'core.N' },
      { id: 'child_face',    label: 'Как он проявляется', path: 'core.W' },
    ],
  },
  {
    id: 'child_approach',
    title: 'Какой подход работает',
    lead: 'Что его успокаивает и что вызывает сопротивление.',
    access: 'paid',
    slots: [
      { id: 'child_comfort', label: 'Что даёт опору',   path: 'core.C' },
      { id: 'child_resist',  label: 'Что вызывает бунт', path: 'diagonals.SW.mid' },
    ],
  },
  {
    id: 'child_task',
    title: 'Чему он пришёл научиться',
    lead: 'Задача, которая стоит перед ребёнком в этой жизни.',
    access: 'paid',
    slots: [
      { id: 'child_lesson', label: 'Главный урок', path: 'core.S' },
      { id: 'child_gift',   label: 'Дар рода',     path: 'core.E' },
    ],
  },
  {
    id: 'child_parents',
    title: 'Ваша связь с ним',
    lead: 'Что происходит между вами и где легко навредить из лучших побуждений.',
    access: 'paid',
    slots: [
      { id: 'child_link',    label: 'Тип связи',       path: 'chakras.rows.5.physics' },
      { id: 'child_mistake', label: 'Частая ошибка',   path: 'diagonals.SW.outer' },
    ],
  },
  {
    id: 'child_rod',
    title: 'Что передаётся по роду',
    lead: 'Программы, которые ребёнок принял от обеих линий.',
    access: 'paid',
    slots: [
      { id: 'child_male',   label: 'Линия отца',  path: 'ancestral.male.result' },
      { id: 'child_female', label: 'Линия матери', path: 'ancestral.female.result' },
    ],
  },
];

/** Какие сферы показывает каждая страница. Единая точка правды для UI. */
const byId = (...ids) => ids.map((id) => SECTIONS.find((s) => s.id === id)).filter(Boolean);

export const PAGE_VIEWS = {
  matrica: { title: 'Матрица судьбы', pair: false, sections: SECTIONS },
  finansy: {
    title: 'Финансы', pair: false,
    sections: [...byId('money', 'work'), ...FINANCE_EXTRA],
  },
  prognoz: {
    title: 'Прогноз', pair: false,
    sections: byId('forecast', 'year'),
  },
  detskaya:     { title: 'Детская матрица',      pair: false, sections: CHILD_SECTIONS },
  sovmestimost: { title: 'Совместимость',        pair: true,  sections: PAIR_SECTIONS.love },
  biznes:       { title: 'Бизнес-совместимость', pair: true,  sections: PAIR_SECTIONS.business },
};

/** Плоский список всех слотов — для подсчёта объёма базы и для админки. */
export const ALL_SLOTS = SECTIONS.flatMap((s) =>
  s.slots.map((slot) => ({ ...slot, sectionId: s.id, sectionTitle: s.title, access: s.access }))
);

export const FREE_SECTIONS = SECTIONS.filter((s) => s.access === 'free');
export const PAID_SECTIONS = SECTIONS.filter((s) => s.access === 'paid');

/** Раскрывает все слоты для конкретной матрицы: что показать на экране. */
export function buildSectionData(matrix, { unlocked = false } = {}) {
  return SECTIONS.map((section) => ({
    id: section.id,
    title: section.title,
    lead: section.lead,
    access: section.access,
    locked: section.access === 'paid' && !unlocked && !section.slots.some((x) => x.free),
    slots: section.slots.map((slot) => {
      const arcana = resolvePath(matrix, slot.path);
      // Ежедневные тексты кэшируются по дате, остальные — навсегда.
      const key = (section.daily || slot.daily)
        ? dailyTextKey(arcana, matrix.today.arcana, matrix.today.date)
        : textKey(slot.id, arcana);
      // Отдельный вопрос может быть открыт, даже если сфера платная.
      const locked = section.access === 'paid' && !unlocked && !slot.free;
      return { id: slot.id, label: slot.label, arcana, key, locked, free: !!slot.free };
    }),
  }));
}
