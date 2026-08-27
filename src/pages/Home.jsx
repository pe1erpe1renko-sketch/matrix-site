import React, { useState, useRef, useEffect, useMemo } from "react";

/* ============================================================
   MATRIX — главная страница
   ============================================================ */

const C = {
  bg: "#0A0817",
  bgAlt: "#0F0B20",
  band: "#161031",
  cardHi: "#1F1841",
  border: "#2C2552",
  borderHi: "#4A3D85",
  gold: "#E4BE72",
  goldHi: "#F3D69C",
  lilac: "#B79CE8",
  lilacBtn: "#A78BDF",
  text: "#BDB6D8",
  muted: "#847CA2",
  white: "#F5F2FC",
  ink: "#140F2B",
};

const R = { xl: 24, lg: 20, md: 14, sm: 11, pill: 999 };

/* ---------------- Иконки ---------------- */

const Ic = {
  matrica: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none">
      <path d="M12 2 L14.2 9.8 L22 12 L14.2 14.2 L12 22 L9.8 14.2 L2 12 L9.8 9.8 Z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </svg>
  ),
  finansy: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 17V7h3a3 3 0 0 1 0 6h-4" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  sovmestimost: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none">
      <path d="M12 20s-7-4.4-7-9.2A4 4 0 0 1 12 8a4 4 0 0 1 7 2.8C19 15.6 12 20 12 20Z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  /* рукопожатие: два предплечья + сцепка + пальцы */
  biznes: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none">
      <path d="M1.8 10.2 L5.6 7.4 L9.4 10.2" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22.2 10.2 L18.4 7.4 L14.6 10.2" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.4 10.2 L12 12.8 L14.6 10.2 L12 7.6 Z" stroke="currentColor"
        strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10.6 14 L13 16.4 M13.4 13.2 L15.6 15.4" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  /* соска */
  detskaya: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="13.2" rx="6.4" ry="4.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="5.4" r="3.1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 8.5v2.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9.6 17.4c0 1.7 1.1 2.8 2.4 2.8s2.4-1.1 2.4-2.8" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  prognoz: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none">
      <path d="M20 14.5A8 8 0 1 1 10.2 4a6.5 6.5 0 0 0 9.8 10.5Z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M17 4.2l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7z" fill="currentColor" />
    </svg>
  ),
  chat: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none">
      <path d="M20 12.5c0 3.6-3.6 6.5-8 6.5-1 0-2-.15-2.9-.42L4.5 20l1.2-3.2C4.05 15.6 3 14.15 3 12.5 3 8.9 6.6 6 11 6s9 2.9 9 6.5Z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  tarify: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none">
      <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.5 10h19" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 14.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  profil: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4.8 20c0-3.9 3.2-6.6 7.2-6.6s7.2 2.7 7.2 6.6" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

const NAV = [
  { id: "matrica", label: "Матрица судьбы" },
  { id: "finansy", label: "Финансы" },
  { id: "sovmestimost", label: "Совместимость" },
  { id: "biznes", label: "Бизнес-совместимость" },
  { id: "detskaya", label: "Детская" },
  { id: "prognoz", label: "Прогноз" },
];

const NAV_SECONDARY = [
  { id: "chat", label: "ИИ-наставник" },
  { id: "tarify", label: "Тарифы и оплата" },
  { id: "profil", label: "Профиль" },
];

const TABS = {
  matrica: {
    tab: "Матрица",
    lead: "Узнайте своё предназначение, денежный канал и сценарий в отношениях по одной дате",
    pairs: false,
    understand: [
      "почему в одном деле усилий мало, а отдача большая — и наоборот",
      "какими вас видят в первые пять минут и чем это отличается от того, кто вы внутри",
      "какая задача стоит перед вами на этом отрезке жизни и когда он сменится",
      "что тянется к вам по линии отца, что по линии матери и что из этого ваш ресурс",
      "где организм даёт слабину и в каких ситуациях вы теряете энергию впустую",
    ],
    opens:
      "25 разделов, 51 позиция, около шестидесяти чисел из одной даты. Октаграмма с восемью внешними точками и центром, чакральная таблица в трёх измерениях, четыре уровня предназначения, родовые линии, возрастная шкала на 80 лет.",
    noteTitle: "Как считается",
    note:
      "Арифметикой. Дата раскладывается по 22 арканам, числа расставляются по точкам. Ни гадания, ни интуиции ни на одном шаге — при одинаковой дате результат одинаковый всегда.",
  },
  finansy: {
    tab: "Финансы",
    lead: "Узнайте, через что к вам приходят деньги и в каком месте канал перекрыт",
    pairs: false,
    understand: [
      "через какие действия деньги приходят естественно, а какие способы не работают, сколько ни старайся",
      "в какой точке канал перекрыт и что именно его закрывает",
      "как связаны ваш доход и ваше отношение к статусу",
      "что делать конкретно, чтобы канал открылся — с первым шагом на эту неделю",
    ],
    opens:
      "Денежный канал, способ его раскрытия, финансовый блок, отношения со статусом, профессиональный талант и сфера реализации.",
    noteTitle: "Важно",
    note: "Сумм и сроков здесь нет. Матрица показывает механизм, а не прогноз доходов.",
  },
  sovmestimost: {
    tab: "Совместимость",
    lead: "Узнайте, зачем вы встретились и на чём эти отношения держатся",
    pairs: true,
    understand: [
      "зачем вы встретились и какая задача у вас общая",
      "где вы усиливаете друг друга, а где стабильно упираетесь",
      "какой сценарий повторяется в паре и кто его запускает",
      "на чём эти отношения держатся, если убрать привычку",
    ],
    opens:
      "Матрица каждого, точки притяжения и трения, общая кармическая задача пары, зона финансов и зона быта.",
    noteTitle: "Считается по двум датам",
    note: "Расчёт работает для любой пары: партнёры, родитель и ребёнок, друзья.",
  },
  biznes: {
    tab: "Бизнес",
    lead: "Проверьте партнёра до того, как начнёте общее дело",
    pairs: true,
    understand: [
      "кто из вас двигает дело вперёд, а кто удерживает его от провала",
      "где ваши роли пересекаются и начнётся борьба за одно и то же",
      "как вы поведёте себя в конфликте и в дележе денег",
      "какие обязанности стоит закрепить письменно с самого начала",
    ],
    opens:
      "Матрица каждого партнёра, распределение ролей, общая денежная зона, точки трения и сильные стороны связки.",
    noteTitle: "Это не оценка человека",
    note: "Расчёт показывает, как складывается связка двоих, а не насколько кто-то хорош сам по себе.",
  },
  detskaya: {
    tab: "Детская",
    lead: "Узнайте таланты ребёнка и найдите к нему подход без давления",
    pairs: false,
    understand: [
      "с какими данными ребёнок родился и в чём его природная сила",
      "где заканчивается характер и начинается то, что вы в него вкладываете",
      "какой подход к нему работает, а какой вызывает сопротивление",
      "что вы передаёте ему по роду и что из этого стоит остановить на себе",
    ],
    opens:
      "Таланты, зона комфорта, кармическая задача, родовые программы, детско-родительская связь и ваша роль в ней.",
    noteTitle: "Без диагнозов",
    note:
      "Мы не оцениваем развитие ребёнка и не заменяем специалиста. Это карта особенностей, а не заключение.",
  },
  prognoz: {
    tab: "Прогноз",
    lead: "Узнайте свой аркан на сегодня, на месяц и на год вперёд",
    pairs: false,
    understand: [
      "какой аркан ведёт вас сегодня и какой будет завтра",
      "какая энергия у текущего периода жизни и сколько до его смены",
      "какие дни месяца подходят для решений, а какие лучше переждать",
      "чем занят год и что в нём стоит закрыть",
    ],
    opens:
      "Три уровня: день, месяц, период жизни. Аркан дня считается лично — в формулу входит ваш текущий период, поэтому у двух людей в одну и ту же дату арканы разные.",
    noteTitle: "Приходит сам",
    note: "На подписке аркан на завтра уходит вечером в Telegram, утром он же ждёт в кабинете.",
  },
};

const MONTHS = ["янв","фев","мар","апр","май","июн","июл","авг","сен","окт","ноя","дек"];
const YEARS = Array.from({ length: 106 }, (_, i) => 2026 - i);

/* Пример расчёта — реальные числа для 13.07.1998 */
const DEMO = {
  date: "13.07.1998",
  core: { W: 13, N: 7, E: 9, S: 11, C: 4, NW: 20, NE: 16, SE: 20, SW: 6 },
  chakras: [
    { n: "Сахасрара",   s: "Миссия",              c: "#8E44AD", p: 13, e: 7,  m: 20 },
    { n: "Аджна",       s: "Судьба, эгрегоры",    c: "#3B5BC0", p: 3,  e: 18, m: 21 },
    { n: "Вишудха",     s: "Творчество",          c: "#3BAFDA", p: 17, e: 11, m: 10 },
    { n: "Анахата",     s: "Отношения",           c: "#4CAF50", p: 21, e: 15, m: 9 },
    { n: "Манипура",    s: "Статус",              c: "#F7D02C", p: 4,  e: 4,  m: 8 },
    { n: "Свадхистана", s: "Радость",             c: "#F0932B", p: 13, e: 15, m: 10 },
    { n: "Муладхара",   s: "Тело, материя",       c: "#D63031", p: 9,  e: 11, m: 20 },
  ],
  total: { p: 8, e: 9, m: 17 },
  timeline: [
    { age: 0, a: 13 }, { age: 10, a: 20 }, { age: 20, a: 7 }, { age: 30, a: 16 },
    { age: 40, a: 9 }, { age: 50, a: 20 }, { age: 60, a: 11 }, { age: 70, a: 6 }, { age: 80, a: 13 },
  ],
  now: 28,
};

const ARCANA = [
  "Маг","Жрица","Императрица","Император","Иерофант","Влюблённые","Колесница",
  "Справедливость","Отшельник","Колесо Фортуны","Сила","Повешенный","Смерть",
  "Умеренность","Дьявол","Башня","Звезда","Луна","Солнце","Суд","Мир","Шут",
];

const FAQ = [
  {
    q: "Матрица судьбы — это гадание?",
    a: "Нет. Все числа получаются арифметикой из даты рождения: цифры складываются и приводятся к диапазону от 1 до 22. При одной и той же дате результат всегда одинаковый — у нас, у конкурентов и у консультанта с листком бумаги. Толкование этих чисел — отдельный разговор, но сам расчёт проверяем и однозначен.",
  },
  {
    q: "Чем это отличается от гороскопа?",
    a: "Гороскоп строится на положении планет и меняется день ото дня для всех людей одного знака сразу. Матрица строится только на вашей дате и не меняется никогда. Двенадцать знаков против нескольких десятков тысяч сочетаний — разница в точности примерно такая.",
  },
  {
    q: "Что я получу бесплатно?",
    a: "Октаграмму со всеми числами, чакральную таблицу, предназначения, родовые программы и четыре раздела разбора из двадцати пяти. Без регистрации. Остальные разделы, PDF, аркан дня и ИИ-наставник открываются на платном тарифе.",
  },
  {
    q: "Зачем нужны имя и пол, если на числа они не влияют?",
    a: "Имя подписывает разбор в кабинете: когда у вас несколько матриц — своя, партнёра, ребёнка — вы не перепутаете, где чья. Пол используется в детской матрице и в обращениях. На расчёт ни то ни другое не влияет, формула одна.",
  },
  {
    q: "Тексты пишет нейросеть?",
    a: "Да, по нашим правилам и рамкам: без предсказаний событий, без медицинских и юридических утверждений, без запугивания. Каждый текст пишется один раз для сочетания «позиция + аркан» и дальше хранится. Это не значит, что текст общий: сочетаний больше тысячи, и ваш набор из пятидесяти одной позиции уникален.",
  },
  {
    q: "Что такое аркан дня и чем он отличается у разных людей?",
    a: "Это ваша энергия на сутки. В формулу входит сегодняшняя дата и аркан текущего периода вашей жизни — а период считается по возрастной шкале от вашей даты рождения. Поэтому у двух человек в один и тот же день арканы разные.",
  },
  {
    q: "Можно ли отменить подписку?",
    a: "В любой момент, из личного кабинета. Разовый разбор оплачивается один раз и остаётся навсегда. Архив прогнозов после отмены подписки тоже остаётся у вас.",
  },
];

/* ============================================================ */

export default function Matrix() {
  const [collapsed, setCollapsed] = useState(false);
  const [tab, setTab] = useState("matrica");
  const [a, setA] = useState({ name: "", d: "", m: "", y: "", g: "" });
  const [b, setB] = useState({ name: "", d: "", m: "", y: "", g: "" });
  const [hover, setHover] = useState(null);
  const [faqOpen, setFaqOpen] = useState(0);

  const t = TABS[tab];
  const filled = (p) => p.name.trim() && p.d && p.m && p.y && p.g;
  const ready = filled(a) && (!t.pairs || filled(b));

  const navBtn = (item, isMain) => {
    const on = isMain && tab === item.id;
    const hv = hover === item.id;
    const Icon = Ic[item.id];
    return (
      <button
        key={item.id}
        style={{
          ...S.navItem,
          justifyContent: collapsed ? "center" : "flex-start",
          background: on ? C.cardHi : hv ? "#191331" : "transparent",
          color: on ? C.gold : hv ? C.white : C.text,
          fontWeight: on ? 600 : 400,
          boxShadow: on ? `inset 3px 0 0 ${C.gold}` : "none",
        }}
        onClick={() => isMain && setTab(item.id)}
        onMouseEnter={() => setHover(item.id)}
        onMouseLeave={() => setHover(null)}
        title={collapsed ? item.label : undefined}
      >
        <Icon width={19} height={19} style={{ flexShrink: 0 }} />
        {!collapsed && <span style={S.navLbl}>{item.label}</span>}
      </button>
    );
  };

  return (
    <div style={S.root}>
      <style>{CSS}</style>
      <Cursor />
      <Sky />

      {/* ---------------- МЕНЮ ---------------- */}
      <aside style={{ ...S.side, width: collapsed ? 76 : 262 }}>
        <div style={{ ...S.sideTop, justifyContent: collapsed ? "center" : "space-between" }}>
          {!collapsed && (
            <div style={S.logo}>
              <Spark size={19} />
              <span style={S.logoText}>MATRIX</span>
            </div>
          )}
          <button className="collapseBtn" style={S.collapse}
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Развернуть меню" : "Свернуть меню"}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform .24s" }}>
              <path d="M14.5 6 L8.5 12 L14.5 18" stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <nav style={S.nav}>
          {NAV.map((i) => navBtn(i, true))}
          <div style={S.divider} />
          {NAV_SECONDARY.map((i) => navBtn(i, false))}
        </nav>

        <div style={S.sideBottom}>
          <button className="btnLilac" style={S.loginBtn}>
            {collapsed ? "→" : "Войти"}
          </button>
        </div>
      </aside>

      {/* ---------------- КОНТЕНТ ---------------- */}
      <main style={S.main}>
        {/* HERO */}
        <section style={{ ...S.section, paddingTop: 56, paddingBottom: 64 }}>
          <div style={S.heroGrid}>
            <div>
              <div style={S.eyebrow}>Онлайн-калькулятор матрицы судьбы</div>
              <h1 style={S.h1}>
                Прочитайте свою жизнь по <em style={S.h1em}>дате рождения</em>
              </h1>
              <p style={S.heroLead}>
                MATRIX строит персональную матрицу из 22 арканов за пару секунд —
                характер, предназначение, денежный канал и отношения. Первый расчёт
                бесплатно, без установки.
              </p>
              <div style={S.stats}>
                <Stat n="22" l="аркана в основе метода" />
                <Stat n="25" l="разделов из одной даты" />
                <Stat n="~4 сек" l="на полную матрицу" />
              </div>
            </div>

            <div style={S.form}>
              <div style={S.formTitle}>Рассчитать матрицу</div>
              <div style={S.formSub}>Выберите тип расчёта и заполните данные</div>

              <div style={S.tabs}>
                {Object.entries(TABS).map(([id, v]) => {
                  const on = tab === id;
                  return (
                    <button key={id} className="chip"
                      style={{
                        ...S.chip,
                        background: on ? C.gold : "transparent",
                        borderColor: on ? C.gold : C.border,
                        color: on ? C.ink : C.text,
                        fontWeight: on ? 600 : 400,
                        boxShadow: on ? `0 8px 22px -10px ${C.gold}` : "none",
                      }}
                      onClick={() => setTab(id)}>{v.tab}</button>
                  );
                })}
              </div>

              <Person data={a} set={setA} label={t.pairs ? "Первый" : null} idPrefix="a" />
              {t.pairs && <Person data={b} set={setB} label="Второй" idPrefix="b" />}

              <button className={ready ? "btnGold" : ""}
                style={{ ...S.cta, background: ready ? C.gold : "#2A2350", color: ready ? C.ink : "#6E6690" }}
                disabled={!ready}>
                Рассчитать бесплатно
              </button>
              <div style={S.formNote}>
                <Spark size={11} /> Ядро матрицы открывается бесплатно и сразу.
                Полная расшифровка — в личном кабинете.
              </div>
            </div>
          </div>
        </section>

        {/* ПОДПИСЬ ВКЛАДКИ */}
        <section style={{ ...S.section, background: C.band, paddingTop: 54, paddingBottom: 54 }}>
          <div style={S.eyebrow}>{t.tab}</div>
          <h2 style={S.h2}>{t.lead}</h2>
        </section>

        {/* ЧТО ВЫ ПОЙМЁТЕ */}
        <section style={S.section}>
          <div style={S.undGrid}>
            <div>
              <div style={S.eyebrow}>Что вы поймёте</div>
              <h2 style={{ ...S.h2, fontSize: "clamp(23px, 2.1vw, 29px)", marginBottom: 24 }}>
                Что станет понятно <em style={S.h1em}>после расчёта</em>
              </h2>
              <div style={S.undAside}>
                <div style={S.infoLabel}>Что открывается</div>
                <p style={S.infoText}>{t.opens}</p>
              </div>
              <div style={{ ...S.undAside, borderLeftColor: C.lilac, marginTop: 12 }}>
                <div style={{ ...S.infoLabel, color: C.lilac }}>{t.noteTitle}</div>
                <p style={S.infoText}>{t.note}</p>
              </div>
            </div>

            <ol style={S.undList}>
              {t.understand.map((line, i) => (
                <li key={i} className="undRow" style={S.undRow}>
                  <span style={S.undNum}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={S.undTxt}>{line}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* КАК ВЫГЛЯДИТ РАЗБОР */}
        <section style={{ ...S.section, background: C.bgAlt }}>
          <div style={S.eyebrow}>Как выглядит разбор</div>
          <h2 style={S.h2}>
            Одна дата — <em style={S.h1em}>шестьдесят чисел</em>
          </h2>
          <div style={S.demoGrid}>
            <div className="card" style={S.demoCard}>
              <div style={S.demoHead}>
                <span style={S.infoLabel}>Октаграмма</span>
                <span style={S.demoDate}>пример</span>
              </div>
              <OctaDemo />
            </div>

            <div className="card" style={S.demoCard}>
              <div style={S.demoHead}>
                <span style={S.infoLabel}>Карта здоровья</span>
                <span style={S.demoDate}>7 чакр · 3 колонки</span>
              </div>
              <ChakraDemo />
            </div>
          </div>
        </section>

        {/* ВОЗРАСТНАЯ ШКАЛА */}
        <section style={S.section}>
          <div style={S.eyebrow}>Возрастная шкала</div>
          <h2 style={S.h2}>
            Видно, какая энергия ведёт вас <em style={S.h1em}>сейчас</em>
          </h2>
          <div className="card" style={{ ...S.demoCard, padding: "30px 32px 26px" }}>
            <Timeline />
            <p style={{ ...S.infoText, marginTop: 22, maxWidth: 760 }}>
              Восемь внешних точек матрицы становятся вехами по десять лет, между ними
              шкала дробится до отрезков в два с половиной года. Отсюда берётся аркан
              текущего периода — и он же участвует в расчёте вашего аркана дня.
            </p>
          </div>
        </section>

        {/* 22 АРКАНА */}
        <section style={{ ...S.section, background: C.bgAlt }}>
          <div style={S.eyebrow}>Основа метода</div>
          <h2 style={S.h2}>22 аркана</h2>
          <p style={{ ...S.infoText, maxWidth: 660, margin: "-14px 0 26px" }}>
            Каждое число матрицы — это один из арканов. Один и тот же аркан в позиции
            «денежный канал» и в позиции «отношения» читается по-разному.
          </p>
          <div style={S.arcGrid}>
            {ARCANA.map((name, i) => (
              <div key={name} className="arcTile" style={S.arcTile}>
                <span style={S.arcGhost}>{i + 1}</span>
                <span style={S.arcTileName}>{name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* КАК ПОЛУЧИТЬ */}
        <section style={S.section}>
          <div style={S.eyebrow}>Как получить</div>
          <h2 style={S.h2}>От даты рождения <em style={S.h1em}>до разбора</em></h2>

          <div style={S.flowWrap}>
            <div style={S.flowLine} />
            <div style={S.flow}>
              <Flow n="1" title="Введите данные" art={<ArtForm />}
                text="Имя, дата рождения, пол. Имя подписывает разбор в кабинете — вы будете хранить несколько матриц и не перепутаете, где чья."
                meta="15 секунд" />
              <Flow n="2" title="Система считает" art={<ArtCalc />}
                text="Восемь внешних точек, центр, обе оси, диагонали, чакральная таблица и возрастная шкала — около шестидесяти чисел."
                meta="~4 секунды" />
              <Flow n="3" title="Ядро открыто" art={<ArtFree />}
                text="Октаграмма, карта здоровья, предназначения и четыре раздела разбора. Бесплатно и без регистрации."
                meta="4 из 25 разделов" />
              <Flow n="4" title="Полный разбор" art={<ArtFull />}
                text="Остальной 21 раздел, PDF, аркан дня каждое утро и ИИ-наставник, который знает вашу матрицу."
                meta="от 490 ₽" gold />
            </div>
          </div>

          <p style={S.forever}>
            Матрица считается один раз и не меняется никогда — дата рождения не меняется.
            Купленный разбор остаётся у вас навсегда.
          </p>
        </section>

        {/* ТАРИФЫ */}
        <section style={{ ...S.section, background: C.bgAlt }}>
          <div style={S.eyebrow}>Тарифы</div>
          <h2 style={S.h2}>
            Начните бесплатно, продолжайте <em style={S.h1em}>по подписке</em>
          </h2>

          <div className="card" style={S.onceRow}>
            <div style={{ flex: "1 1 280px" }}>
              <div style={S.planName}>Разовый разбор</div>
              <div style={S.priceRow}>
                <span style={S.price}>490</span><span style={S.priceUnit}>₽</span>
              </div>
              <div style={S.priceHint}>один платёж, доступ навсегда</div>
              <p style={S.planLead}>Одна матрица судьбы целиком — все 25 разделов вместо четырёх.</p>
            </div>
            <div style={{ flex: "1 1 360px" }}>
              <div style={S.infoLabel}>Что откроется</div>
              <div style={S.onceList}>
                {["Предназначение и дело по душе","Деньги: канал и утечки","Отношения, близость, притяжение","Род: мужская и женская линии","Карма, испытания, прошлые жизни","Здоровье и энергия по чакрам","Детско-родительские связи","PDF со всем разбором"].map((x) => (
                  <div key={x} style={S.li}><span style={S.uMark}>—</span><span>{x}</span></div>
                ))}
              </div>
            </div>
            <div style={S.onceCtaWrap}>
              <button className="link" style={S.link}>Что входит полностью</button>
              <button className="btnGold" style={S.ctaSmall}>Купить за 490 ₽</button>
            </div>
          </div>

          <h3 style={S.h3}>Или подписка — сервис, который работает каждый день</h3>

          <div style={S.plans}>
            <Plan badge="ОПТИМАЛЬНЫЙ" badgeSolid featured name="Свой путь" price="590" unit="₽ / мес"
              lead="На 100 ₽ дороже разового — и это уже не разбор, а сервис, который открывается каждый день."
              items={["2 матрицы судьбы вместо одной","Аркан дня в Telegram — каждый вечер на завтра","ИИ-наставник: 5 вопросов в день","Архив прогнозов — остаётся даже после отмены","PDF по обеим матрицам"]} />
            <Plan badge="ВЫГОДНО" name="Близкий круг" price="990" unit="₽ / мес"
              lead="Прогнозы получаете не только вы. Каждый вечер они уходят вашим близким прямо в Telegram."
              items={["5 матриц судьбы","Аркан дня в Telegram — до 3 человек","У каждого своя ссылка на бота","ИИ-наставник: 20 вопросов в день"]} />
            <Plan name="Без границ" price="1790" unit="₽ / мес"
              lead="Без счётчиков. Для тех, кто работает с матрицами постоянно."
              items={["Неограниченное число матриц","Аркан дня в Telegram — до 7 человек","ИИ-наставник без ограничений","Приоритетная обработка запросов"]} />
          </div>

          <p style={S.forever}>
            Подписку можно отменить в любой момент. Разовый разбор оплачивается один раз.
          </p>
        </section>

        {/* FAQ */}
        <section style={S.section}>
          <div style={S.eyebrow}>Вопросы и ответы</div>
          <h2 style={S.h2}>Что обычно спрашивают</h2>
          <div style={S.faqWrap}>
            {FAQ.map((f, i) => {
              const open = faqOpen === i;
              return (
                <div key={i} className="card" style={{
                  ...S.faqItem,
                  borderColor: open ? C.borderHi : C.border,
                  background: open ? "rgba(31,24,65,0.86)" : "rgba(23,18,46,0.72)",
                }}>
                  <button style={S.faqQ} onClick={() => setFaqOpen(open ? -1 : i)}>
                    <span>{f.q}</span>
                    <span style={{ ...S.faqPlus, transform: open ? "rotate(45deg)" : "none", color: open ? C.gold : C.muted }}>+</span>
                  </button>
                  {open && <p style={S.faqA}>{f.a}</p>}
                </div>
              );
            })}
          </div>
        </section>

        {/* ФИНАЛЬНЫЙ ПРИЗЫВ */}
        <section style={{ ...S.section, paddingTop: 20 }}>
          <div className="card" style={S.finalCta}>
            <h2 style={{ ...S.h2, marginBottom: 12, textAlign: "center" }}>
              Ваша матрица уже <em style={S.h1em}>посчитана</em>
            </h2>
            <p style={{ ...S.infoText, textAlign: "center", maxWidth: 520, margin: "0 auto 24px" }}>
              Осталось её открыть. Введите дату рождения и посмотрите ядро бесплатно —
              регистрация не нужна.
            </p>
            <button className="btnGold" style={{ ...S.ctaSmall, padding: "15px 34px", fontSize: 15.5 }}>
              Рассчитать бесплатно
            </button>
          </div>
        </section>

        {/* ПОДВАЛ */}
        <footer style={S.footer}>
          <div style={S.footGrid}>
            <div>
              <div style={S.logo}><Spark size={19} /><span style={S.logoText}>MATRIX</span></div>
              <p style={{ ...S.infoText, marginTop: 14, maxWidth: 300 }}>
                Онлайн-калькулятор матрицы судьбы по методу 22 арканов.
              </p>
            </div>
            <FootCol title="Расчёты" items={NAV.map((n) => n.label)} />
            <FootCol title="Кабинет" items={["Мои матрицы", "ИИ-наставник", "Тарифы и оплата", "Профиль"]} />
          </div>
          <div style={S.footBottom}>
            © 2026 MATRIX. Сервис носит развлекательный характер и не заменяет
            консультацию специалиста.
          </div>
        </footer>
      </main>
    </div>
  );
}

/* ---------------- Демо-графика ---------------- */

const LAYERS = [
  { id: "age", label: "возрастная шкала" },
  { id: "rod", label: "родовые линии" },
  { id: "money", label: "зона денег" },
  { id: "love", label: "зона отношений" },
];

/* Промежуточные числа для 13.07.1998 */
const RAY = {
  NW: { outer: 8, mid: 6 },
  NE: { outer: 9, mid: 20 },
  SE: { outer: 8, mid: 6 },
  SW: { outer: 16, mid: 10 },
};
const AXIS = {
  h: { startOuter: 3, startMid: 17, startInner: 21, endMid: 13, endOuter: 22 },
  v: { startOuter: 18, startMid: 11, startInner: 15, endMid: 15, endOuter: 8 },
};

function OctaDemo() {
  const [on, setOn] = useState({ age: true, rod: true, money: true, love: true });
  const [sel, setSel] = useState("C");
  const [hov, setHov] = useState(null);

  const cx = 260, cy = 260, R0 = 170;
  const ANG = { W: 180, NW: 135, N: 90, NE: 45, E: 0, SE: -45, S: -90, SW: -135 };
  const AGE = { W: 0, NW: 10, N: 20, NE: 30, E: 40, SE: 50, S: 60, SW: 70 };

  const at = (key, k = 1) => {
    const a = (ANG[key] * Math.PI) / 180;
    return [cx + R0 * k * Math.cos(a), cy - R0 * k * Math.sin(a)];
  };

  /* ---- все точки схемы ---- */
  const P = [];
  const push = (id, xy, v, r, kind, title, hint) =>
    P.push({ id, x: xy[0], y: xy[1], v, r, kind, title, hint });

  push("W", at("W"), DEMO.core.W, 27, "main", "Портрет личности", "День рождения. Каким вас видят другие.");
  push("N", at("N"), DEMO.core.N, 27, "main", "Таланты", "Месяц рождения. Дары от природы.");
  push("E", at("E"), DEMO.core.E, 27, "main", "Родовой дар", "Год рождения. Что передано родом.");
  push("S", at("S"), DEMO.core.S, 27, "main", "Кармическая задача", "Что важно проработать в этой жизни.");
  push("NW", at("NW"), DEMO.core.NW, 24, "corner", "Мужская линия рода", "Программа по линии отца.");
  push("NE", at("NE"), DEMO.core.NE, 24, "corner", "Женская линия рода", "Программа по линии матери.");
  push("SE", at("SE"), DEMO.core.SE, 24, "corner", "Денежный канал", "Через что приходят ресурсы.");
  push("SW", at("SW"), DEMO.core.SW, 24, "corner", "Линия отношений", "Сценарии в любви и партнёрстве.");
  push("C", [cx, cy], DEMO.core.C, 32, "center", "Зона комфорта", "Ядро личности. Точка «Я».");

  const AX = [
    ["h_o", "W", 0.74, AXIS.h.startOuter, "Аджна · физика", "Судьба и эгрегоры в материальном проявлении."],
    ["h_m", "W", 0.52, AXIS.h.startMid, "Вишудха · физика", "Предназначение и творчество в делах."],
    ["h_i", "W", 0.30, AXIS.h.startInner, "Анахата · физика", "Отношения и картина мира в поступках."],
    ["h_em", "E", 0.33, AXIS.h.endMid, "Свадхистана · физика", "Детская радость, способность получать удовольствие."],
    ["h_eo", "E", 0.66, AXIS.h.endOuter, "Точка оси · физика", "Промежуточное звено между центром и родовым даром."],
    ["v_o", "N", 0.74, AXIS.v.startOuter, "Аджна · энергия", "Как вы чувствуете судьбу и своё место."],
    ["v_m", "N", 0.52, AXIS.v.startMid, "Вишудха · энергия", "Творческий поток и самовыражение."],
    ["v_i", "N", 0.30, AXIS.v.startInner, "Анахата · энергия", "Сердечный центр: чем вы наполняетесь."],
    ["v_em", "S", 0.33, AXIS.v.endMid, "Свадхистана · энергия", "Источник радости и лёгкости."],
    ["v_eo", "S", 0.66, AXIS.v.endOuter, "Точка оси · энергия", "Промежуточное звено к кармической задаче."],
  ];
  AX.forEach(([id, k, t, v, title, hint]) => push(id, at(k, t), v, 16, "axis", title, hint));

  const RAYS = [
    ["NW", "rod", "Мужская линия"],
    ["NE", "rod", "Женская линия"],
    ["SE", "money", "Денежный канал"],
    ["SW", "love", "Линия отношений"],
  ];
  const HINT = {
    NW: ["Что род передал по отцу и требует проработки.", "Итог мужской линии, ближе к центру."],
    NE: ["Что род передал по матери и требует проработки.", "Итог женской линии, ближе к центру."],
    SE: ["Финансовый блок: где канал перекрыт.", "Как раскрыть денежный канал."],
    SW: ["Барьер близости: что мешает сближаться.", "Путь к гармонии в отношениях."],
  };
  RAYS.forEach(([k, layer, name]) => {
    push(k + "_o", at(k, 0.72), RAY[k].outer, 16, "ray", `${name} · дальняя точка`, HINT[k][0]);
    push(k + "_m", at(k, 0.44), RAY[k].mid, 16, "ray", `${name} · ближняя точка`, HINT[k][1]);
    P[P.length - 1].layer = layer;
    P[P.length - 2].layer = layer;
  });

  const rayOn = (k) => (k === "NW" || k === "NE" ? on.rod : k === "SE" ? on.money : on.love);
  const rayColor = { NW: C.lilac, NE: C.lilac, SE: C.gold, SW: "#E68AB0" };
  const order = ["W", "NW", "N", "NE", "E", "SE", "S", "SW"];
  const outer = order.map((k) => at(k));

  const active = P.find((p) => p.id === (hov || sel));
  const colorOf = (p) =>
    p.kind === "main" ? C.gold
      : p.kind === "center" ? C.white
      : p.kind === "corner" ? C.lilac
      : p.kind === "ray" ? rayColor[p.id.split("_")[0]]
      : C.text;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <div style={S.layerRow}>
        {LAYERS.map((l) => {
          const a = on[l.id];
          return (
            <button key={l.id} className="chip" style={{
              ...S.layerChip,
              background: a ? "rgba(183,156,232,0.16)" : "transparent",
              borderColor: a ? C.lilac : C.border,
              color: a ? C.white : C.muted,
            }} onClick={() => setOn({ ...on, [l.id]: !a })}>
              <span style={{
                ...S.layerDot,
                background: a ? C.lilac : "transparent",
                borderColor: a ? C.lilac : C.borderHi,
              }} />
              {l.label}
            </button>
          );
        })}
      </div>

      <svg viewBox="-20 -20 560 560" style={{ width: "100%", height: "auto", display: "block" }}>
        <defs>
          <radialGradient id="ocore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(183,156,232,0.16)" />
            <stop offset="100%" stopColor="rgba(183,156,232,0.01)" />
          </radialGradient>
        </defs>

        <circle cx={cx} cy={cy} r={R0} fill="url(#ocore)" />
        {on.age && (
          <circle cx={cx} cy={cy} r={R0 * 1.24} fill="none" stroke={C.border}
            strokeWidth="0.8" strokeDasharray="2 6" opacity="0.5" />
        )}
        <polygon points={outer.map((p) => p.join(",")).join(" ")}
          fill="none" stroke={C.border} strokeWidth="1" />

        {outer.map((p, i) => (
          <g key={"ln" + i}>
            <line x1={p[0]} y1={p[1]} x2={cx} y2={cy} stroke={C.border} strokeWidth="0.8" />
            <line x1={p[0]} y1={p[1]} x2={outer[(i + 3) % 8][0]} y2={outer[(i + 3) % 8][1]}
              stroke={C.border} strokeWidth="0.6" opacity="0.5" />
          </g>
        ))}

        {["NW", "NE", "SE", "SW"].map((k) => rayOn(k) && (
          <line key={"rl" + k} x1={at(k)[0]} y1={at(k)[1]} x2={cx} y2={cy}
            stroke={rayColor[k]} strokeWidth="1.6" opacity="0.5" />
        ))}

        {on.age && (() => {
          const kR = 1.24;
          const dots = Array.from({ length: 32 }, (_, i) => {
            const deg = 180 - i * 11.25;              // по часовой от запада
            const a = (deg * Math.PI) / 180;
            return { i, x: cx + R0 * kR * Math.cos(a), y: cy - R0 * kR * Math.sin(a), deg };
          });
          return (
            <g>
              {dots.map((d) => d.i % 4 !== 0 && (
                <circle key={"q" + d.i} cx={d.x} cy={d.y} r="3.4"
                  fill="none" stroke={C.borderHi} strokeWidth="0.9" opacity="0.75" />
              ))}
              {order.map((k, i) => {
                const [x, y] = at(k, kR);
                const [lx, ly] = at(k, kR + 0.15);
                return (
                  <g key={"ag" + k}>
                    <circle cx={x} cy={y} r="14" fill={C.bg} stroke={C.gold}
                      strokeWidth="1" opacity="0.85" />
                    <text x={x} y={y} textAnchor="middle" dominantBaseline="central"
                      fill={C.gold} fontSize="12"
                      fontFamily="'Playfair Display', Georgia, serif">{DEMO.core[k]}</text>
                    <text x={lx} y={ly} textAnchor="middle" dominantBaseline="central"
                      fill={C.muted} fontSize="10.5">{AGE[k]}</text>
                  </g>
                );
              })}
            </g>
          );
        })()}

        {P.map((p) => {
          if (p.layer && !on[p.layer]) return null;
          const isSel = sel === p.id;
          const isHov = hov === p.id;
          const col = colorOf(p);
          const strong = isSel || isHov;
          return (
            <g key={p.id} className="octaPt" onClick={() => setSel(p.id)}
              onMouseEnter={() => setHov(p.id)} onMouseLeave={() => setHov(null)}>
              {strong && <circle cx={p.x} cy={p.y} r={p.r + 9} fill={col} opacity="0.14" />}
              <circle cx={p.x} cy={p.y} r={p.r}
                fill={p.kind === "center" ? C.cardHi : C.bg}
                stroke={strong ? col : p.kind === "axis" ? C.border : col}
                strokeWidth={strong ? 2.2 : p.kind === "axis" ? 1 : 1.4}
                opacity={p.kind === "axis" && !strong ? 0.9 : 1} />
              <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central"
                fill={p.kind === "axis" && !strong ? C.muted : col}
                fontSize={p.kind === "center" ? 25 : p.kind === "main" ? 21 : p.kind === "corner" ? 18 : 13}
                fontFamily="'Playfair Display', Georgia, serif">{p.v}</text>
            </g>
          );
        })}
      </svg>

      <div style={S.octaPanel}>
        {active ? (
          <>
            <div style={S.octaPanelTop}>
              <span style={S.octaVal}>{active.v}</span>
              <div>
                <div style={S.octaTitle}>{active.title}</div>
                <div style={S.octaArc}>Аркан {active.v} — {ARCANA[active.v - 1]}</div>
              </div>
            </div>
            <p style={S.octaHint}>{active.hint}</p>
          </>
        ) : (
          <p style={S.octaHint}>Нажмите на любое число — покажем, что оно означает.</p>
        )}
      </div>
    </div>
  );
}


const BAR = { p: C.gold, e: C.lilac, m: "#E68AB0" };

function ChakraDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      <div style={{ ...S.chkRow, borderBottom: `1px solid ${C.border}`, paddingBottom: 10, flex: "0 0 auto" }}>
        <span style={S.chkName} />
        <span style={S.chkLegend}>
          {[["p", "физика"], ["e", "энергия"], ["m", "эмоции"]].map(([k, l]) => (
            <span key={k} style={S.chkLeg}>
              <span style={{ ...S.chkLegDot, background: BAR[k] }} />{l}
            </span>
          ))}
        </span>
        <span style={S.chkHead}>Ф</span>
        <span style={S.chkHead}>Э</span>
        <span style={S.chkHead}>Эм</span>
      </div>

      {DEMO.chakras.map((c) => (
        <div key={c.n} className="chk" style={{ ...S.chkRow, flex: "1 1 0", minHeight: 54 }}>
          <span style={S.chkName}>
            <span style={{ ...S.chkBar, background: c.c }} />
            <span>
              <span style={{ display: "block", color: C.white, fontSize: 14.5 }}>{c.n}</span>
              <span style={{ display: "block", color: C.muted, fontSize: 11.5 }}>{c.s}</span>
            </span>
          </span>
          <span style={S.chkGauge}>
            {["p", "e", "m"].map((k) => (
              <span key={k} style={S.chkTrack}>
                <span style={{
                  ...S.chkFill,
                  width: (c[k] / 22) * 100 + "%",
                  background: BAR[k],
                }} />
              </span>
            ))}
          </span>
          <span style={S.chkVal}>{c.p}</span>
          <span style={S.chkVal}>{c.e}</span>
          <span style={S.chkVal}>{c.m}</span>
        </div>
      ))}

      <div style={{
        ...S.chkRow, borderTop: `2px solid ${C.borderHi}`, marginTop: 4,
        paddingTop: 14, flex: "0 0 auto",
        background: "rgba(228,190,114,0.05)", borderRadius: R.sm,
      }}>
        <span style={{ ...S.chkName, color: C.gold, fontSize: 15, paddingLeft: 14, fontWeight: 600 }}>
          Итог · общее энергополе
        </span>
        <span />
        <span style={{ ...S.chkVal, color: C.gold }}>{DEMO.total.p}</span>
        <span style={{ ...S.chkVal, color: C.gold }}>{DEMO.total.e}</span>
        <span style={{ ...S.chkVal, color: C.gold }}>{DEMO.total.m}</span>
      </div>
    </div>
  );
}

function Timeline() {
  const W = 900, H = 128, padX = 34;
  const span = W - padX * 2;
  const xOf = (age) => padX + (age / 80) * span;
  const nowX = xOf(DEMO.now);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
      <line x1={padX} y1={64} x2={W - padX} y2={64} stroke={C.border} strokeWidth="1.5" />
      <line x1={padX} y1={64} x2={nowX} y2={64} stroke={C.gold} strokeWidth="1.5" opacity="0.75" />

      {DEMO.timeline.map((p, i) => {
        const x = xOf(p.age);
        const passed = p.age <= DEMO.now;
        return (
          <g key={i}>
            <circle cx={x} cy={64} r="17" fill={C.bg}
              stroke={passed ? C.gold : C.borderHi} strokeWidth="1.3" />
            <text x={x} y={64} textAnchor="middle" dominantBaseline="central"
              fill={passed ? C.gold : C.text} fontSize="14"
              fontFamily="'Playfair Display', Georgia, serif">{p.a}</text>
            <text x={x} y={100} textAnchor="middle" fill={C.muted} fontSize="11">
              {p.age}
            </text>
          </g>
        );
      })}

      <g>
        <line x1={nowX} y1={20} x2={nowX} y2={44} stroke={C.lilac} strokeWidth="1.4" strokeDasharray="3 3" />
        <circle cx={nowX} cy={16} r="4" fill={C.lilac} />
        <text x={nowX} y={8} textAnchor="middle" fill={C.lilac} fontSize="11.5">сейчас</text>
      </g>
    </svg>
  );
}

/* ---------------- Курсор ---------------- */

function Cursor() {
  const dot = useRef(null), ring = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let mx = -100, my = -100, rx = -100, ry = -100, sc = 1, target = 1, raf;
    const move = (e) => { mx = e.clientX; my = e.clientY; };
    const down = () => { target = 0.45; };
    const up = () => { target = 1; };
    const loop = () => {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      sc += (target - sc) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${mx}px,${my}px,0) translate(-50%,-50%)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%) scale(${sc})`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, []);
  return (
    <>
      <div ref={ring} style={S.curRing} aria-hidden="true" />
      <div ref={dot} style={S.curDot} aria-hidden="true" />
    </>
  );
}

/* ---------------- Небо ---------------- */

function Sky() {
  const l0 = useRef(null), l1 = useRef(null), l2 = useRef(null);
  const tunnel = useRef(null);

  const layers = useMemo(() => {
    const rnd = (s) => { const x = Math.sin(s) * 10000; return x - Math.floor(x); };
    return [0, 1, 2].map((li) =>
      Array.from({ length: 46 }, (_, i) => {
        const k = li * 100 + i;
        return {
          x: rnd(k * 1.7) * 100, y: rnd(k * 3.1) * 100,
          s: 0.7 + rnd(k * 5.3) * (1.2 + li * 0.7),
          o: 0.16 + rnd(k * 7.9) * 0.55,
          d: rnd(k * 2.3) * 7,
        };
      })
    );
  }, []);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const refs = [l0, l1, l2];
    const depth = [22, 46, 82];
    let tx = 0, ty = 0, cx = 0, cy = 0, raf;
    const move = (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const loop = () => {
      cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
      refs.forEach((l, i) => {
        if (l.current) l.current.style.transform = `translate3d(${-cx * depth[i]}px, ${-cy * depth[i]}px, 0)`;
      });
      if (tunnel.current)
        tunnel.current.style.transform = `translate(-50%,-50%) translate3d(${-cx * 58}px, ${-cy * 58}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener("mousemove", move);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", move); };
  }, []);

  const rings = [1, 0.79, 0.62, 0.48, 0.375, 0.29, 0.225, 0.175, 0.135];
  const octa = (r) => Array.from({ length: 8 }, (_, i) => {
    const ang = (Math.PI / 4) * i - Math.PI / 2;
    return [300 + r * Math.cos(ang), 300 + r * Math.sin(ang)];
  });

  return (
    <div style={S.sky} aria-hidden="true">
      {[l0, l1, l2].map((ref, li) => (
        <div key={li} ref={ref} style={S.skyLayer}>
          <div className="fly" style={{ animationDuration: [150, 105, 70][li] + "s" }}>
            {[0, 1].map((copy) => (
              <div key={copy} style={{ position: "absolute", left: 0, right: 0, height: "100%", top: copy * 100 + "%" }}>
                {layers[li].map((s, i) => (
                  <span key={i} className="star" style={{
                    left: s.x + "%", top: s.y + "%",
                    width: s.s, height: s.s, opacity: s.o,
                    animationDelay: s.d + "s",
                  }} />
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div ref={tunnel} style={S.tunnelWrap}>
        <div style={S.glow} />
        <svg viewBox="0 0 600 600" style={S.tunnelSvg}>
          <defs>
            <radialGradient id="fade" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={C.gold} stopOpacity="0.95" />
              <stop offset="55%" stopColor={C.lilac} stopOpacity="0.5" />
              <stop offset="100%" stopColor={C.lilac} stopOpacity="0.12" />
            </radialGradient>
          </defs>
          {rings.map((k, idx) => {
            const pts = octa(262 * k);
            return (
              <g key={idx} className={idx % 2 ? "spinB" : "spinA"}
                style={{ transformOrigin: "300px 300px", animationDuration: 220 - idx * 16 + "s" }}>
                <g transform={`rotate(${idx * 6.5} 300 300)`} opacity={0.1 + idx * 0.085}>
                  <polygon points={pts.map((p) => p.join(",")).join(" ")}
                    fill="none" stroke="url(#fade)" strokeWidth={0.9 + idx * 0.12} />
                  {pts.map(([x, y], i) => (
                    <line key={i} x1={x} y1={y}
                      x2={pts[(i + 3) % 8][0]} y2={pts[(i + 3) % 8][1]}
                      stroke="url(#fade)" strokeWidth="0.55" opacity="0.6" />
                  ))}
                  {idx < 4 && pts.map(([x, y], i) => (
                    <circle key={"d" + i} cx={x} cy={y} r={2.6 - idx * 0.4} fill={C.gold} opacity="0.9" />
                  ))}
                </g>
              </g>
            );
          })}
          <circle cx="300" cy="300" r="16" fill={C.lilac} opacity="0.14" />
          <circle cx="300" cy="300" r="3.4" fill={C.goldHi} opacity="0.95" />
        </svg>
      </div>
    </div>
  );
}

/* ---------------- Компоненты ---------------- */

function Person({ data, set, label, idPrefix }) {
  const up = (k) => (e) => set({ ...data, [k]: e.target.value });
  return (
    <div style={{ marginTop: label ? 16 : 14 }}>
      {label && <div style={S.personLabel}>{label}</div>}
      <div style={S.nameRow}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <label style={S.fieldLabel} htmlFor={idPrefix + "name"}>Имя</label>
          <input id={idPrefix + "name"} className="fld" style={S.input}
            placeholder="Как подписать" maxLength={20} value={data.name} onChange={up("name")} />
        </div>
        <div>
          <label style={S.fieldLabel}>Пол</label>
          <div style={S.genderRow}>
            {["Ж", "М"].map((v) => {
              const on = data.g === v;
              return (
                <button key={v} className="gender" style={{
                  ...S.gender,
                  background: on ? C.lilacBtn : "transparent",
                  borderColor: on ? C.lilacBtn : C.border,
                  color: on ? C.ink : C.text,
                  fontWeight: on ? 700 : 500,
                }} onClick={() => set({ ...data, g: v })}>{v}</button>
              );
            })}
          </div>
        </div>
      </div>
      <label style={S.fieldLabel}>Дата рождения</label>
      <div style={S.dateRow}>
        <select className="fld" style={S.select} value={data.d} onChange={up("d")}>
          <option value="">День</option>
          {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className="fld" style={S.select} value={data.m} onChange={up("m")}>
          <option value="">Месяц</option>
          {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
        </select>
        <input className="fld" style={S.select} list={idPrefix + "years"} placeholder="Год"
          value={data.y} onChange={up("y")} inputMode="numeric" maxLength={4} />
        <datalist id={idPrefix + "years"}>{YEARS.map((y) => <option key={y} value={y} />)}</datalist>
      </div>
    </div>
  );
}

function Plan({ badge, badgeSolid, name, price, unit, lead, items, featured }) {
  return (
    <div className="card" style={{
      ...S.plan,
      borderColor: featured ? C.lilac : C.border,
      background: featured ? "rgba(31,24,65,0.85)" : "rgba(23,18,46,0.72)",
      boxShadow: featured ? `0 26px 70px -34px ${C.lilac}` : "none",
    }}>
      <div style={S.badgeSlot}>
        {badge && <span style={{
          ...S.badge,
          background: badgeSolid ? C.lilacBtn : "transparent",
          color: badgeSolid ? C.ink : C.lilac, borderColor: C.lilac,
        }}>{badge}</span>}
      </div>
      <div style={S.planName}>{name}</div>
      <div style={S.priceRow}>
        <span style={S.price}>{price}</span><span style={S.priceUnit}>{unit}</span>
      </div>
      <p style={S.planLead}>{lead}</p>
      <div style={{ flex: 1 }}>
        {items.map((x) => <div key={x} style={S.li}><span style={S.uMark}>—</span><span>{x}</span></div>)}
      </div>
      <button className="link" style={{ ...S.link, marginTop: 18 }}>Что входит полностью</button>
      <button className={featured ? "btnLilac" : "btnOutline"}
        style={{ ...S.ctaSmall, width: "100%", marginTop: 12 }}>Выбрать</button>
    </div>
  );
}

function Flow({ n, title, text, art, meta, gold }) {
  return (
    <div className="card" style={S.flowCard}>
      <div style={{ ...S.flowNum, borderColor: gold ? C.gold : C.borderHi, color: gold ? C.gold : C.lilac }}>
        {n}
      </div>
      <div style={S.flowArt}>{art}</div>
      <div style={S.stepTitle}>{title}</div>
      <p style={{ ...S.infoText, fontSize: 13.5, flex: 1 }}>{text}</p>
      <div style={{ ...S.flowMeta, color: gold ? C.gold : C.muted, borderColor: gold ? "rgba(228,190,114,0.35)" : C.border }}>
        {meta}
      </div>
    </div>
  );
}

/* --- иллюстрации шагов --- */

function ArtForm() {
  return (
    <svg viewBox="0 0 120 84" style={S.artSvg}>
      <rect x="14" y="8" width="92" height="68" rx="9" fill="rgba(23,18,46,0.9)" stroke={C.border} />
      <rect x="24" y="20" width="48" height="8" rx="4" fill={C.borderHi} />
      <rect x="24" y="36" width="20" height="10" rx="5" fill="none" stroke={C.lilac} />
      <rect x="48" y="36" width="20" height="10" rx="5" fill="none" stroke={C.lilac} />
      <rect x="72" y="36" width="24" height="10" rx="5" fill="none" stroke={C.lilac} />
      <rect x="24" y="54" width="40" height="12" rx="6" fill={C.gold} opacity="0.9" />
      <circle cx="86" cy="62" r="4" fill={C.gold} />
      <circle cx="86" cy="62" r="10" fill="none" stroke={C.lilac} strokeWidth="1" opacity="0.6" />
    </svg>
  );
}

function ArtCalc() {
  const pts = Array.from({ length: 8 }, (_, i) => {
    const a = (Math.PI / 4) * i - Math.PI / 2;
    return [60 + 28 * Math.cos(a), 42 + 28 * Math.sin(a)];
  });
  return (
    <svg viewBox="0 0 120 84" style={S.artSvg}>
      <polygon points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={C.border} />
      {pts.map(([x, y], i) => (
        <g key={i}>
          <line x1={x} y1={y} x2="60" y2="42" stroke={C.border} strokeWidth="0.6" />
          <circle cx={x} cy={y} r="6.5" fill={C.bg} stroke={i % 2 ? C.lilac : C.gold} />
        </g>
      ))}
      <circle cx="60" cy="42" r="9" fill={C.cardHi} stroke={C.lilac} strokeWidth="1.4" />
      <circle cx="60" cy="42" r="18" fill="none" stroke={C.gold} strokeWidth="0.8"
        strokeDasharray="3 5" opacity="0.7" className="spinA"
        style={{ transformOrigin: "60px 42px", animationDuration: "18s" }} />
    </svg>
  );
}

function ArtFree() {
  return (
    <svg viewBox="0 0 120 84" style={S.artSvg}>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={16 + (i % 2) * 46} y={12 + Math.floor(i / 2) * 32}
          width="42" height="24" rx="7" fill="rgba(228,190,114,0.14)" stroke={C.gold} strokeWidth="0.9" />
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={"l" + i} x={16 + (i % 3) * 34} y={70} width="26" height="7" rx="3.5"
          fill="none" stroke={C.border} />
      ))}
      <path d="M30 24 l4 4 l7-8" stroke={C.gold} strokeWidth="1.6" fill="none"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArtFull() {
  return (
    <svg viewBox="0 0 120 84" style={S.artSvg}>
      <rect x="12" y="10" width="56" height="64" rx="8" fill="rgba(23,18,46,0.9)" stroke={C.gold} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x="22" y={22 + i * 10} width={i === 4 ? 20 : 36} height="5" rx="2.5"
          fill={C.borderHi} />
      ))}
      <g>
        <rect x="72" y="34" width="34" height="26" rx="6" fill={C.bg} stroke={C.gold} strokeWidth="1.3" />
        <path d="M79 34 v-7 a10 10 0 0 1 20 0" fill="none" stroke={C.gold} strokeWidth="1.3" />
        <circle cx="89" cy="46" r="3.4" fill={C.gold} />
      </g>
    </svg>
  );
}

function Stat({ n, l }) {
  return <div><div style={S.statN}>{n}</div><div style={S.statL}>{l}</div></div>;
}

function FootCol({ title, items }) {
  return (
    <div>
      <div style={S.footTitle}>{title}</div>
      {items.map((x) => <div key={x} className="footLink" style={S.footLink}>{x}</div>)}
    </div>
  );
}

function Spark({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ flexShrink: 0, display: "block" }}>
      <path d="M8 0 L9.6 6.4 L16 8 L9.6 9.6 L8 16 L6.4 9.6 L0 8 L6.4 6.4 Z" fill={C.gold} />
    </svg>
  );
}

/* ---------------- Стили ---------------- */

const S = {
  root: {
    display: "flex", minHeight: "100vh", background: C.bg, color: C.text,
    fontFamily: "'Inter', -apple-system, 'Segoe UI', Roboto, sans-serif",
    fontSize: 15, lineHeight: 1.6, position: "relative",
  },

  curDot: {
    position: "fixed", left: 0, top: 0, width: 7, height: 7, borderRadius: "50%",
    background: C.gold, pointerEvents: "none", zIndex: 9999,
  },
  curRing: {
    position: "fixed", left: 0, top: 0, width: 34, height: 34, borderRadius: "50%",
    border: `1px solid ${C.lilac}`, opacity: 0.55, pointerEvents: "none", zIndex: 9998,
  },

  sky: { position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" },
  skyLayer: { position: "absolute", inset: -90, willChange: "transform" },
  tunnelWrap: {
    position: "absolute", left: "50%", top: "42%",
    width: "min(84vh, 720px)", height: "min(84vh, 720px)",
    transform: "translate(-50%,-50%)", willChange: "transform",
  },
  tunnelSvg: { width: "100%", height: "100%", position: "relative", zIndex: 2 },
  glow: {
    position: "absolute", inset: "22%", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(183,156,232,0.13), transparent 68%)",
    filter: "blur(26px)", zIndex: 1,
  },

  side: {
    background: "rgba(13,10,30,0.9)", backdropFilter: "blur(12px)",
    borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column",
    position: "sticky", top: 0, height: "100vh",
    transition: "width .24s cubic-bezier(.4,0,.2,1)", flexShrink: 0, zIndex: 5,
  },
  sideTop: {
    display: "flex", alignItems: "center", padding: "0 16px",
    borderBottom: `1px solid ${C.border}`, height: 74,
  },
  logo: { display: "flex", alignItems: "center", gap: 11 },
  logoText: { fontSize: 19, fontWeight: 600, color: C.white, letterSpacing: "0.24em", lineHeight: 1 },
  collapse: {
    background: "transparent", border: `1px solid ${C.border}`, color: C.muted,
    width: 32, height: 32, borderRadius: R.sm, display: "flex",
    alignItems: "center", justifyContent: "center",
    transition: "all .18s ease", flexShrink: 0,
  },
  nav: { padding: "14px 12px", flex: 1, overflowY: "auto", overflowX: "hidden" },
  navItem: {
    display: "flex", alignItems: "center", gap: 12, width: "100%",
    padding: "11px 13px", border: "none", borderRadius: R.md,
    fontSize: 14.5, textAlign: "left", fontFamily: "inherit", marginBottom: 3,
    transition: "background .16s ease, color .16s ease",
  },
  navLbl: { whiteSpace: "nowrap", overflow: "hidden" },
  divider: { height: 1, background: C.border, margin: "14px 12px" },
  sideBottom: { padding: 14, borderTop: `1px solid ${C.border}` },
  loginBtn: {
    width: "100%", padding: "12px 14px", borderRadius: R.md,
    fontSize: 14.5, fontFamily: "inherit", border: "none",
  },

  main: { flex: 1, minWidth: 0, position: "relative", zIndex: 2 },
  section: { padding: "62px 52px", position: "relative" },

  heroGrid: {
    display: "grid", width: "100%",
    gridTemplateColumns: "minmax(300px, 1fr) minmax(330px, 440px)",
    gap: 56, alignItems: "center",
  },

  eyebrow: {
    fontSize: 11.5, letterSpacing: "0.18em", textTransform: "uppercase",
    color: C.gold, marginBottom: 14, fontWeight: 500,
  },
  h1: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "clamp(32px, 3.8vw, 50px)", lineHeight: 1.1,
    color: C.white, margin: "0 0 20px", fontWeight: 600,
  },
  h1em: { color: C.gold, fontStyle: "italic" },
  h2: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "clamp(23px, 2.4vw, 32px)", lineHeight: 1.24,
    color: C.white, margin: "0 0 28px", fontWeight: 600, maxWidth: 860,
  },
  h3: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 22, color: C.white, margin: "46px 0 24px", fontWeight: 600,
  },
  heroLead: { maxWidth: 450, margin: "0 0 26px", color: C.text, fontSize: 14.5 },

  stats: { display: "flex", gap: 38, flexWrap: "wrap" },
  statN: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, color: C.gold, lineHeight: 1 },
  statL: { fontSize: 12, color: C.muted, marginTop: 7, maxWidth: 124 },

  form: {
    background: "rgba(23,18,47,0.9)", backdropFilter: "blur(18px)",
    border: `1px solid ${C.border}`, borderRadius: R.xl, padding: "24px 24px 26px",
    boxShadow: "0 30px 80px -40px rgba(0,0,0,0.9)",
  },
  formTitle: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 21, color: C.white, marginBottom: 4 },
  formSub: { fontSize: 13, color: C.muted, marginBottom: 16 },
  tabs: { display: "flex", flexWrap: "wrap", gap: 7 },
  chip: {
    padding: "7px 13px", borderRadius: R.pill, fontSize: 12.5,
    border: "1px solid", fontFamily: "inherit", transition: "all .16s ease",
  },
  personLabel: {
    fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase",
    color: C.lilac, marginBottom: 2,
  },
  nameRow: { display: "flex", gap: 10, alignItems: "flex-end" },
  fieldLabel: {
    display: "block", fontSize: 10.5, letterSpacing: "0.13em",
    textTransform: "uppercase", color: C.muted, margin: "11px 0 6px",
  },
  input: {
    width: "100%", padding: "10px 13px", borderRadius: R.md,
    background: "rgba(10,8,23,0.72)", border: `1px solid ${C.border}`,
    color: C.white, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box",
  },
  dateRow: { display: "grid", gridTemplateColumns: "1fr 1.1fr 1fr", gap: 8 },
  select: {
    width: "100%", padding: "10px 9px", borderRadius: R.md,
    background: "rgba(10,8,23,0.72)", border: `1px solid ${C.border}`,
    color: C.white, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box",
  },
  genderRow: { display: "flex", gap: 6 },
  gender: {
    width: 42, padding: "10px 0", borderRadius: R.md, fontSize: 13.5,
    border: "1px solid", fontFamily: "inherit", transition: "all .16s ease",
  },
  cta: {
    width: "100%", marginTop: 20, padding: "14px 18px", borderRadius: R.md,
    fontSize: 15, fontWeight: 600, fontFamily: "inherit", border: "none",
    transition: "all .16s ease",
  },
  ctaSmall: {
    padding: "13px 24px", borderRadius: R.md, fontSize: 14.5,
    fontWeight: 600, fontFamily: "inherit", border: "none",
  },
  formNote: {
    display: "flex", gap: 8, alignItems: "flex-start",
    fontSize: 12, color: C.muted, marginTop: 12, lineHeight: 1.5,
  },

  undGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))",
    gap: 52, alignItems: "start",
  },
  undAside: {
    borderLeft: `2px solid ${C.gold}`, paddingLeft: 18,
  },
  undList: { listStyle: "none", margin: 0, padding: 0 },
  undRow: {
    display: "flex", gap: 20, alignItems: "flex-start",
    padding: "20px 14px 20px 4px", borderTop: `1px solid ${C.border}`,
    borderRadius: R.sm, transition: "background .18s ease, padding-left .18s ease",
  },
  undNum: {
    fontFamily: "'Playfair Display', Georgia, serif", color: C.gold,
    fontSize: 22, lineHeight: 1.1, flexShrink: 0, opacity: 0.9, minWidth: 34,
  },
  undTxt: { fontSize: 15.5, color: C.text, lineHeight: 1.55 },
  uMark: { color: C.gold, flexShrink: 0 },

  layerRow: { display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 6 },
  layerChip: {
    display: "flex", alignItems: "center", gap: 7,
    padding: "6px 12px", borderRadius: R.pill, fontSize: 11.5,
    border: "1px solid", fontFamily: "inherit", transition: "all .16s ease",
  },
  layerDot: {
    width: 7, height: 7, borderRadius: 4, border: "1px solid",
    flexShrink: 0, transition: "all .16s ease",
  },
  octaPanel: {
    marginTop: 14, padding: "16px 18px", borderRadius: R.lg,
    background: "rgba(10,8,23,0.55)", border: `1px solid ${C.border}`,
    minHeight: 104,
  },
  octaPanelTop: { display: "flex", alignItems: "center", gap: 14, marginBottom: 10 },
  octaVal: {
    fontFamily: "'Playfair Display', Georgia, serif", fontSize: 30,
    color: C.gold, lineHeight: 1, minWidth: 40, textAlign: "center",
  },
  octaTitle: { color: C.white, fontSize: 15.5, fontWeight: 500 },
  octaArc: { color: C.lilac, fontSize: 12.5, marginTop: 2 },
  octaHint: { margin: 0, color: C.text, fontSize: 13.5, lineHeight: 1.5 },

  infoLabel: {
    fontSize: 11.5, letterSpacing: "0.15em", textTransform: "uppercase",
    color: C.gold, marginBottom: 11,
  },
  infoText: { margin: 0, color: C.text, fontSize: 14.5 },

  demoGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))", gap: 16,
  },
  demoCard: {
    background: "rgba(23,18,46,0.78)", border: `1px solid ${C.border}`,
    borderRadius: R.xl, padding: "22px 24px 22px",
    display: "flex", flexDirection: "column",
    transition: "border-color .18s ease, background .18s ease",
  },
  demoHead: {
    display: "flex", justifyContent: "space-between",
    alignItems: "baseline", marginBottom: 14, gap: 12, flexWrap: "wrap",
    flex: "0 0 auto",
  },
  demoDate: { fontSize: 11.5, color: C.muted, letterSpacing: "0.04em" },

  chkRow: {
    display: "grid",
    gridTemplateColumns: "minmax(150px, 210px) minmax(70px, 1fr) 46px 46px 46px",
    alignItems: "center", padding: "6px 0", gap: 14,
  },
  chkName: { display: "flex", alignItems: "center", gap: 11 },
  chkBar: { width: 3, height: 30, borderRadius: 2, flexShrink: 0 },
  chkGauge: { display: "flex", flexDirection: "column", gap: 4, minWidth: 0 },
  chkTrack: {
    display: "block", height: 4, borderRadius: 2,
    background: "rgba(183,156,232,0.12)", overflow: "hidden",
  },
  chkFill: { display: "block", height: "100%", borderRadius: 2, opacity: 0.85 },
  chkLegend: { display: "flex", gap: 12, flexWrap: "wrap" },
  chkLeg: {
    display: "flex", alignItems: "center", gap: 5,
    fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: C.muted,
  },
  chkLegDot: { width: 7, height: 3, borderRadius: 2, display: "block" },
  chkHead: {
    fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase",
    color: C.muted, textAlign: "center",
  },
  chkVal: {
    textAlign: "center", fontSize: 18, color: C.white,
    fontFamily: "'Playfair Display', Georgia, serif",
  },

  arcGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(158px, 1fr))", gap: 12,
  },
  arcTile: {
    position: "relative", overflow: "hidden",
    minHeight: 92, padding: "16px 16px 14px",
    borderRadius: R.lg, background: "rgba(23,18,46,0.66)",
    border: `1px solid ${C.border}`,
    display: "flex", alignItems: "flex-end",
    transition: "all .18s ease",
  },
  arcGhost: {
    position: "absolute", top: -6, right: 10,
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 54, lineHeight: 1, color: C.gold, opacity: 0.16,
    pointerEvents: "none", transition: "opacity .18s ease",
  },
  arcTileName: {
    fontSize: 14, color: C.white, position: "relative", zIndex: 2,
    lineHeight: 1.3, fontWeight: 500,
  },

  flowWrap: { position: "relative" },
  flowLine: {
    position: "absolute", left: 40, right: 40, top: 34, height: 1,
    background: `linear-gradient(90deg, ${C.border}, ${C.borderHi}, ${C.gold})`,
    opacity: 0.5,
  },
  flow: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: 16, position: "relative",
  },
  flowCard: {
    display: "flex", flexDirection: "column", alignItems: "flex-start",
    padding: "0 22px 22px", borderRadius: R.lg,
    background: "rgba(23,18,46,0.82)", border: `1px solid ${C.border}`,
    transition: "border-color .18s ease, transform .18s ease",
  },
  flowNum: {
    width: 44, height: 44, borderRadius: "50%", border: "1.5px solid",
    background: C.bg, display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Playfair Display', Georgia, serif", fontSize: 19,
    marginTop: -22, marginBottom: 14,
  },
  flowArt: {
    width: "100%", marginBottom: 16, borderRadius: R.md,
    background: "rgba(10,8,23,0.45)", padding: "10px 6px",
  },
  artSvg: { width: "100%", height: "auto", display: "block" },
  flowMeta: {
    marginTop: 14, fontSize: 11.5, letterSpacing: "0.08em",
    textTransform: "uppercase", padding: "6px 12px",
    border: "1px solid", borderRadius: R.pill,
  },
  stepTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 19, color: C.white, marginBottom: 10,
  },
  forever: { fontSize: 13, color: C.muted, marginTop: 24, textAlign: "center" },

  onceRow: {
    display: "flex", flexWrap: "wrap", gap: 38, padding: "30px 32px",
    background: "rgba(31,24,65,0.75)", border: `1px solid ${C.border}`,
    borderRadius: R.xl, alignItems: "flex-start",
    transition: "border-color .18s ease, background .18s ease",
  },
  onceList: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 22px" },
  li: { display: "flex", gap: 10, fontSize: 14, padding: "4px 0" },
  onceCtaWrap: {
    display: "flex", flexDirection: "column", gap: 12,
    marginLeft: "auto", alignItems: "flex-end", alignSelf: "flex-end",
  },
  link: {
    background: "none", border: "none", color: C.lilac, fontSize: 13.5,
    fontFamily: "inherit", textDecoration: "underline",
    textUnderlineOffset: 3, padding: 0, transition: "color .15s ease",
  },

  plans: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 17, alignItems: "stretch",
  },
  plan: {
    flexDirection: "column", gap: 0, padding: "24px 26px 28px", display: "flex",
    border: "1px solid", borderRadius: R.xl,
    transition: "border-color .18s ease, background .18s ease",
  },
  badgeSlot: { height: 28, marginBottom: 6 },
  badge: {
    fontSize: 10.5, letterSpacing: "0.13em", padding: "5px 12px",
    borderRadius: R.pill, border: "1px solid", fontWeight: 600,
  },
  planName: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 21, color: C.white },
  priceRow: { display: "flex", alignItems: "baseline", gap: 8, marginTop: 9 },
  price: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 42, color: C.white, lineHeight: 1 },
  priceUnit: { fontSize: 14, color: C.muted },
  priceHint: { fontSize: 12.5, color: C.gold, marginTop: 7 },
  planLead: { fontSize: 14, color: C.text, margin: "15px 0 17px" },

  faqWrap: { display: "flex", flexDirection: "column", gap: 10, maxWidth: 880 },
  faqItem: {
    border: "1px solid", borderRadius: R.lg, padding: "4px 22px 4px",
    transition: "border-color .18s ease, background .18s ease",
  },
  faqQ: {
    width: "100%", background: "none", border: "none", color: C.white,
    fontSize: 15.5, fontFamily: "inherit", textAlign: "left",
    padding: "18px 0", display: "flex", justifyContent: "space-between",
    alignItems: "center", gap: 18, fontWeight: 500,
  },
  faqPlus: { fontSize: 22, lineHeight: 1, transition: "transform .2s ease, color .2s ease", flexShrink: 0 },
  faqA: { margin: "0 0 20px", color: C.text, fontSize: 14.5, maxWidth: 760 },

  finalCta: {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "48px 40px 52px", borderRadius: R.xl,
    background: "rgba(31,24,65,0.78)", border: `1px solid ${C.borderHi}`,
    transition: "border-color .18s ease",
  },

  footer: {
    borderTop: `1px solid ${C.border}`, padding: "50px 52px 36px",
    background: "rgba(15,11,32,0.92)",
  },
  footGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 36 },
  footTitle: {
    fontSize: 11.5, letterSpacing: "0.15em", textTransform: "uppercase",
    color: C.gold, marginBottom: 15,
  },
  footLink: { fontSize: 14, color: C.text, padding: "5px 0", transition: "color .15s ease" },
  footBottom: {
    marginTop: 38, paddingTop: 22, borderTop: `1px solid ${C.border}`,
    fontSize: 12.5, color: C.muted,
  },
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,600&family=Inter:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; }
html, body, button, input, select, a, label { cursor: none; }
::placeholder { color: #6E6690; }

.star { position: absolute; border-radius: 50%; background: #EDE6FF; animation: tw 6s ease-in-out infinite; }
@keyframes tw { 0%, 100% { opacity: .22; } 50% { opacity: 1; } }

.fly { position: absolute; inset: 0; animation: fly linear infinite; }
@keyframes fly { from { transform: translateY(0); } to { transform: translateY(-100%); } }

.spinA { animation: rotA linear infinite; }
.spinB { animation: rotB linear infinite; }
@keyframes rotA { to { transform: rotate(360deg); } }
@keyframes rotB { to { transform: rotate(-360deg); } }

.collapseBtn:hover { border-color: ${C.lilac}; color: ${C.lilac}; background: rgba(183,156,232,0.09); }
.chip:hover { border-color: ${C.borderHi}; }
.gender:hover { border-color: ${C.borderHi}; }
.arcTile:hover { border-color: ${C.gold}; background: rgba(31,24,65,0.9); transform: translateY(-2px); }
.arcTile:hover span:first-child { opacity: .42; }
.chk:hover { background: rgba(183,156,232,0.05); }
.undRow:hover { background: rgba(183,156,232,0.05); padding-left: 12px; }
.undRow:first-child { border-top: none; }
.octaPt { transition: opacity .16s ease; }
.octaPt:hover { opacity: .92; }

.btnGold:hover { background: ${C.goldHi} !important; box-shadow: 0 12px 36px -14px ${C.gold}; }
.btnLilac { background: ${C.lilacBtn}; color: ${C.ink}; font-weight: 600; }
.btnLilac:hover { background: ${C.lilac}; box-shadow: 0 12px 36px -14px ${C.lilac}; }
.btnOutline { background: transparent; border: 1px solid ${C.border}; color: ${C.white}; }
.btnOutline:hover { border-color: ${C.lilac}; }

.link:hover { color: ${C.goldHi}; }
.footLink:hover { color: ${C.gold}; }
.card:hover { border-color: ${C.borderHi}; }

.fld:focus { outline: none; border-color: ${C.lilac}; }
button:focus-visible, .fld:focus-visible { outline: 2px solid ${C.lilac}; outline-offset: 2px; }

@media (prefers-reduced-motion: reduce) { .spinA, .spinB, .star, .fly { animation: none; } }
@media (pointer: coarse) { html, body, button, input, select, a, label { cursor: auto; } }
`;
