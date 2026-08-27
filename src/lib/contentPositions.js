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

export const SECTIONS = [
  // ─────────────── ОТКРЫТО БЕСПЛАТНО ───────────────
  {
    id: 'character',
    title: 'Ваш характер и сильные стороны',
    lead: 'Как вы проявляетесь в жизни и какими вас видят другие.',
    access: 'free',
    slots: [
      { id: 'character_day',   label: 'Главный талант при рождении', path: 'core.W' },
      { id: 'character_month', label: 'Внутренняя сила',             path: 'core.N' },
      { id: 'character_year',  label: 'Что передано родом',          path: 'core.E' },
    ],
  },
  {
    id: 'comfort',
    title: 'Что даёт вам внутренний комфорт',
    lead: 'Состояние, в котором вы восстанавливаетесь и приходите в ресурс.',
    access: 'free',
    slots: [
      { id: 'comfort_core', label: 'Зона комфорта', path: 'core.C' },
    ],
  },
  {
    id: 'year_forecast',
    title: 'Разбор по годам',
    lead: 'Энергия текущего и будущих периодов вашей жизни.',
    access: 'free',
    dynamic: 'timeline', // слот выбирается селектором периода
    slots: [
      { id: 'year_energy', label: 'Энергия периода', path: 'today.arcana' },
    ],
  },
  {
    id: 'day_arcana',
    title: 'Аркан дня',
    lead: 'Ваша энергия на сегодня.',
    access: 'free',
    daily: true,
    slots: [
      // ВНИМАНИЕ: именно dayArcana, а не arcana.
      // today.arcana — аркан периода жизни, он держится 2,5 года.
      // today.dayArcana — аркан на сегодня, меняется каждые сутки.
      { id: 'day_energy', label: 'Аркан дня', path: 'today.dayArcana' },
    ],
  },

  // ─────────────── ПОД ЗАМКОМ ───────────────
  {
    id: 'purpose',
    title: 'Предназначение: зачем вы здесь',
    lead: 'Четыре уровня задачи — от личной до планетарной.',
    access: 'paid',
    slots: [
      { id: 'purpose_personal',  label: 'Поиск себя',         path: 'purpose.personal.result' },
      { id: 'purpose_social',    label: 'Социализация',       path: 'purpose.social.result' },
      { id: 'purpose_spiritual', label: 'Духовная гармония',  path: 'purpose.spiritual.result' },
      { id: 'purpose_planetary', label: 'Планетарное',        path: 'purpose.planetary.result' },
    ],
  },
  {
    id: 'profession',
    title: 'Профессия и дело по душе',
    lead: 'В какой деятельности ваша энергия раскрывается лучше всего.',
    access: 'paid',
    slots: [
      { id: 'profession_talent', label: 'Профессиональный талант', path: 'core.N' },
      { id: 'profession_social', label: 'Реализация в социуме',    path: 'purpose.social.result' },
    ],
  },
  {
    id: 'money_flow',
    title: 'Через что к вам приходят деньги',
    lead: 'Ваш денежный канал и способ его открыть.',
    access: 'paid',
    slots: [
      { id: 'money_channel_main', label: 'Денежный канал',    path: 'core.SE' },
      { id: 'money_channel_way',  label: 'Как его раскрыть',  path: 'diagonals.SE.mid' },
    ],
  },
  {
    id: 'money_leak',
    title: 'Почему деньги утекают',
    lead: 'Где вы теряете ресурс и что с этим делать.',
    access: 'paid',
    slots: [
      { id: 'money_block',  label: 'Финансовый блок',       path: 'diagonals.SE.outer' },
      { id: 'money_status', label: 'Отношения со статусом', path: 'chakras.rows.4.physics' },
    ],
  },
  {
    id: 'relationships',
    title: 'Отношения: ваш сценарий в любви',
    lead: 'Как вы строите близость и что ищете в партнёре.',
    access: 'paid',
    slots: [
      { id: 'relation_line', label: 'Линия отношений',   path: 'core.SW' },
      { id: 'relation_way',  label: 'Путь к гармонии',   path: 'diagonals.SW.mid' },
    ],
  },
  {
    id: 'relation_blocks',
    title: 'Что мешает вам сближаться',
    lead: 'Внутренние барьеры, из-за которых близость даётся тяжело.',
    access: 'paid',
    slots: [
      { id: 'relation_block', label: 'Барьер близости',     path: 'diagonals.SW.outer' },
      { id: 'relation_heart', label: 'Состояние Анахаты',   path: 'chakras.rows.3.emotions' },
    ],
  },
  {
    id: 'sexuality',
    title: 'Сексуальность и притяжение',
    lead: 'Природа вашего влечения и то, как вы притягиваете.',
    access: 'paid',
    slots: [
      { id: 'sex_energy',     label: 'Сексуальная энергия', path: 'chakras.rows.5.energy' },
      { id: 'sex_attraction', label: 'Что вас притягивает', path: 'core.SW' },
    ],
  },
  {
    id: 'karma_40',
    title: 'Кармическая задача до 40 лет',
    lead: 'Что важно закрыть в первой половине жизни.',
    access: 'paid',
    slots: [
      { id: 'karma_material', label: 'Материальная задача', path: 'core.E' },
      { id: 'karma_main',     label: 'Главный урок',        path: 'core.S' },
    ],
  },
  {
    id: 'main_test',
    title: 'Главное испытание жизни',
    lead: 'Точка, через которую раскрывается ваша сила.',
    access: 'paid',
    slots: [
      { id: 'test_main', label: 'Главное испытание', path: 'core.S' },
    ],
  },
  {
    id: 'past_lives',
    title: 'Задачи прошлых воплощений',
    lead: 'Что вы принесли с собой и почему это повторяется.',
    access: 'paid',
    slots: [
      { id: 'past_debt', label: 'Кармический долг',  path: 'core.S' },
      { id: 'past_tail', label: 'Кармический хвост', path: 'diagonals.SW.outer' },
    ],
  },
  {
    id: 'male_line',
    title: 'Что тянется по мужской линии',
    lead: 'Программа рода по линии отца.',
    access: 'paid',
    slots: [
      { id: 'male_first',  label: 'Первая программа', path: 'ancestral.male.first' },
      { id: 'male_second', label: 'Вторая программа', path: 'ancestral.male.second' },
      { id: 'male_result', label: 'Итог линии',       path: 'ancestral.male.result' },
    ],
  },
  {
    id: 'female_line',
    title: 'Что тянется по женской линии',
    lead: 'Программа рода по линии матери.',
    access: 'paid',
    slots: [
      { id: 'female_first',  label: 'Первая программа', path: 'ancestral.female.first' },
      { id: 'female_second', label: 'Вторая программа', path: 'ancestral.female.second' },
      { id: 'female_result', label: 'Итог линии',       path: 'ancestral.female.result' },
    ],
  },
  {
    id: 'ancestral_gifts',
    title: 'Дары рода: на что опереться',
    lead: 'Ресурс, который род передал вам как поддержку.',
    access: 'paid',
    slots: [
      { id: 'gift_male',   label: 'Дар мужского рода', path: 'ancestral.male.result' },
      { id: 'gift_female', label: 'Дар женского рода', path: 'ancestral.female.result' },
    ],
  },
  {
    id: 'parents_karma',
    title: 'Детско-родительская карма',
    lead: 'Что осталось непрожитым в отношениях с родителями.',
    access: 'paid',
    slots: [
      { id: 'parents_link', label: 'Связь с родителями', path: 'chakras.rows.5.physics' },
      { id: 'parents_task', label: 'Задача отношений',   path: 'core.S' },
    ],
  },
  {
    id: 'children',
    title: 'Ваши дети: что важно знать',
    lead: 'Какую энергию вы передаёте детям.',
    access: 'paid',
    slots: [
      { id: 'children_energy', label: 'Энергия для детей', path: 'chakras.rows.5.emotions' },
      { id: 'children_role',   label: 'Ваша роль',         path: 'core.C' },
    ],
  },
  {
    id: 'health_map',
    title: 'Карта здоровья по чакрам',
    lead: 'Общее состояние вашего энергополя.',
    access: 'paid',
    slots: [
      { id: 'health_physics',  label: 'Итог: физика',  path: 'chakras.total.physics' },
      { id: 'health_energy',   label: 'Итог: энергия', path: 'chakras.total.energy' },
      { id: 'health_emotions', label: 'Итог: эмоции',  path: 'chakras.total.emotions' },
    ],
  },
  {
    id: 'body_zones',
    title: 'Уязвимые зоны организма',
    lead: 'На что обращать внимание в теле.',
    access: 'paid',
    slots: [
      { id: 'body_base', label: 'Муладхара: тело', path: 'chakras.rows.6.physics' },
    ],
  },
  {
    id: 'energy_leak',
    title: 'Где вы теряете энергию',
    lead: 'Каналы, через которые уходит ресурс.',
    access: 'paid',
    slots: [
      { id: 'energy_total', label: 'Общий энергопоток', path: 'chakras.total.energy' },
      { id: 'energy_weak',  label: 'Слабое звено',      path: 'chakras.rows.2.energy' },
    ],
  },
  {
    id: 'emotions',
    title: 'Эмоции и внутренние конфликты',
    lead: 'Что происходит внутри, когда снаружи всё хорошо.',
    access: 'paid',
    slots: [
      { id: 'emotion_total', label: 'Эмоциональный фон', path: 'chakras.total.emotions' },
      { id: 'emotion_mind',  label: 'Ум и тревога',      path: 'chakras.rows.1.emotions' },
    ],
  },
  {
    id: 'personal_brand',
    title: 'Как вас видят: личный бренд',
    lead: 'Впечатление, которое вы производите.',
    access: 'paid',
    slots: [
      { id: 'brand_face',   label: 'Внешнее проявление', path: 'core.W' },
      { id: 'brand_talent', label: 'Сильная сторона',    path: 'core.N' },
    ],
  },
  {
    id: 'rest',
    title: 'Ваш формат отдыха',
    lead: 'Как вы восстанавливаетесь по-настоящему.',
    access: 'paid',
    slots: [
      { id: 'rest_heart', label: 'Что наполняет', path: 'chakras.rows.3.physics' },
      { id: 'rest_joy',   label: 'Источник радости', path: 'chakras.rows.5.physics' },
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

/**
 * Прогноз. Три уровня на одном экране: день, месяц, период жизни.
 * Считается по той же дате, что и общая матрица, — отдельной оплаты нет.
 * Календарь месяца строится в компоненте вызовом dayArcana() на каждый
 * день, отдельного слота под него не нужно.
 */
export const FORECAST_SECTIONS = [
  {
    id: 'forecast_day',
    title: 'Аркан дня',
    lead: 'Ваша энергия на сегодня и на завтра.',
    access: 'free',
    daily: true,
    slots: [
      { id: 'day_energy', label: 'Сегодня', path: 'today.dayArcana' },
    ],
  },
  {
    id: 'forecast_period',
    title: 'Период жизни',
    lead: 'Какая энергия ведёт вас сейчас и когда сменится.',
    access: 'free',
    slots: [
      { id: 'year_energy', label: 'Энергия периода', path: 'today.arcana' },
    ],
  },
  {
    id: 'forecast_ahead',
    title: 'Что дальше',
    lead: 'Энергия следующего отрезка и как к нему подойти.',
    access: 'paid',
    slots: [
      { id: 'forecast_next',  label: 'Следующий период', path: 'today.nextArcana' },
      { id: 'forecast_bridge', label: 'Переход',         path: 'core.S' },
    ],
  },
];

/** Какие разделы показывает каждая страница. Единая точка правды для UI. */
export const PAGE_VIEWS = {
  matrica: { title: 'Матрица судьбы', pair: false, sections: SECTIONS },
  finansy: {
    title: 'Финансы', pair: false,
    sections: [
      ...SECTIONS.filter((s) => ['money_flow', 'money_leak', 'profession'].includes(s.id)),
      ...FINANCE_EXTRA,
    ],
  },
  detskaya:     { title: 'Детская матрица',      pair: false, sections: CHILD_SECTIONS },
  prognoz:      { title: 'Прогноз',              pair: false, sections: FORECAST_SECTIONS },
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
    locked: section.access === 'paid' && !unlocked,
    slots: section.slots.map((slot) => {
      const arcana = resolvePath(matrix, slot.path);
      // Ежедневные разделы кэшируются по дате, обычные — навсегда.
      const key = section.daily
        ? dailyTextKey(arcana, matrix.today.arcana, matrix.today.date)
        : textKey(slot.id, arcana);
      return { id: slot.id, label: slot.label, arcana, key };
    }),
  }));
}
