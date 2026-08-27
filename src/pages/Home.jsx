import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { C, R, FONT, SURFACE } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { Spark } from "../components/Icons.jsx";
import { CALC_NAV, DEFAULT_CALC, calcById, activeNavId } from "../routes.js";
import { partsToUrlDate } from "../lib/urlDate.js";

/* ============================================================
   MATRIX — главная страница
   ============================================================

   Меню слева и подвал живут в макете (components/Layout.jsx),
   здесь только середина страницы.

   ВКЛАДКА ФОРМЫ = АДРЕС. Шесть вкладок расчёта — это шесть адресов
   (/matrica, /finansy, …), на все отвечает этот же компонент.
   Поэтому вкладка не хранится в состоянии: её выбирает адрес страницы,
   а сама вкладка — обычная ссылка. Так работает «назад», ссылку на
   нужный калькулятор можно переслать, и меню с вкладками не расходятся.

   Информационные блоки под формой меняются вместе с вкладкой —
   тексты лежат в TABS ниже.
   ============================================================ */

const TABS = {
  matrica: {
    tab: "Матрица",
    lead: "Узнайте своё предназначение, денежный канал и сценарий в отношениях по одной дате",
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

export default function Home() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  /* Вкладка берётся из адреса, а не из состояния. */
  const calc = calcById(activeNavId(pathname)) || calcById(DEFAULT_CALC);
  const tab = calc.id;
  const t = TABS[tab];

  const [a, setA] = useState({ name: "", d: "", m: "", y: "", g: "" });
  const [b, setB] = useState({ name: "", d: "", m: "", y: "", g: "" });
  const [faqOpen, setFaqOpen] = useState(0);

  const filled = (p) => p.name.trim() && p.d && p.m && p.y && p.g;
  const ready = filled(a) && (!calc.pairs || filled(b));

  /**
   * Переход к разбору. Адрес собирается из введённых дат:
   * /matrica/13-07-1998, /sovmestimost/13-07-1998/09-04-1992.
   * Дальше страница результата живёт сама по себе — её можно открыть
   * прямой ссылкой, форму заполнять заново не нужно.
   */
  const openResult = () => {
    if (!ready) return;
    const first = partsToUrlDate(a);
    const second = calc.pairs ? partsToUrlDate(b) : null;
    if (!first || (calc.pairs && !second)) return;
    navigate(calc.pairs ? `${calc.path}/${first}/${second}` : `${calc.path}/${first}`);
  };

  return (
    <>
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
              {CALC_NAV.map((c) => {
                const on = tab === c.id;
                return (
                  <Link key={c.id} to={c.path} className="chip"
                    style={{
                      ...S.chip,
                      background: on ? C.gold : "transparent",
                      borderColor: on ? C.gold : C.border,
                      color: on ? C.ink : C.text,
                      fontWeight: on ? 600 : 400,
                      boxShadow: on ? `0 8px 22px -10px ${C.gold}` : "none",
                    }}>{TABS[c.id].tab}</Link>
                );
              })}
            </div>

            <Person data={a} set={setA} label={calc.pairs ? "Первый" : null} idPrefix="a" />
            {calc.pairs && <Person data={b} set={setB} label="Второй" idPrefix="b" />}

            <button className={ready ? "btnGold" : ""}
              style={{ ...S.cta, background: ready ? C.gold : C.disabled, color: ready ? C.ink : C.faint }}
              disabled={!ready} onClick={openResult}>
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
            <Link to="/tarify" className="link" style={S.link}>Что входит полностью</Link>
            <Link to="/tarify" className="btnGold"
              style={{ ...S.ctaSmall, background: C.gold, color: C.ink, textAlign: "center" }}>Купить за 490 ₽</Link>
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
                background: open ? SURFACE.cardHi : SURFACE.card,
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
          <button className="btnGold"
            style={{ ...S.ctaSmall, padding: "15px 34px", fontSize: 15.5, background: C.gold, color: C.ink }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Рассчитать бесплатно
          </button>
        </div>
      </section>
    </>
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
  const rayColor = { NW: C.lilac, NE: C.lilac, SE: C.gold, SW: C.pink };
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
                      fontFamily={FONT.serif}>{DEMO.core[k]}</text>
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
                fontFamily={FONT.serif}>{p.v}</text>
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


const BAR = { p: C.gold, e: C.lilac, m: C.pink };

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
              fontFamily={FONT.serif}>{p.a}</text>
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
      background: featured ? SURFACE.cardHi : SURFACE.card,
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
      <Link to="/tarify" className="link" style={{ ...S.link, marginTop: 18 }}>Что входит полностью</Link>
      <Link to="/tarify" className={featured ? "btnLilac" : "btnOutline"}
        style={{ ...S.ctaSmall, width: "100%", marginTop: 12, textAlign: "center" }}>Выбрать</Link>
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
