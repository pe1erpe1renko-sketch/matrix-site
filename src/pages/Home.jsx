import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { C, SURFACE } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { Spark } from "../components/Icons.jsx";
import { CALC_NAV, DEFAULT_CALC, calcById, activeNavId } from "../routes.js";
import { partsToUrlDate } from "../lib/urlDate.js";
import { useIsPhone, hScrollRow, TAP } from "../theme/responsive.js";
import { PlanCard } from "../components/PlanCard.jsx";
import DateFields from "../components/DateFields.jsx";
import { SUBSCRIPTION_PLANS } from "../lib/plans.js";
import { calculateMatrix } from "../lib/matrixEngine.js";
import { ARCANA_NAMES } from "../lib/prompts.js";
import Octagram from "../components/Octagram.jsx";
import ChakraTable from "../components/ChakraTable.jsx";
import AgeTimeline from "../components/AgeTimeline.jsx";

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

/**
 * Пример на витрине — настоящий расчёт, а не выдуманные числа.
 * Раньше здесь лежала копия чисел для 13.07.1998, и любая правка движка
 * молча расходилась бы с главной страницей. Теперь витрина и разбор
 * считаются одной функцией и разойтись не могут.
 */
const DEMO_DATE_URL = "13-07-1998";
const DEMO_MATRIX = calculateMatrix("1998-07-13");

const ARCANA = Object.values(ARCANA_NAMES);




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
  /* Какую карточку тарифа человек рассматривает. Пока не выбрал ничего —
     null, и тогда никто не приглушён: страница открывается спокойной. */
  const [chosenPlan, setChosenPlan] = useState(null);
  const isPhone = useIsPhone();

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
        {/* minmax(0, 1fr), а не 1fr: колонка «1fr» не сжимается уже своего
            содержимого, и лента вкладок внутри растягивала бы весь экран. */}
        <div style={{ ...S.heroGrid, ...(isPhone ? { gridTemplateColumns: "minmax(0, 1fr)", gap: 30 } : null) }}>
          {/* На телефоне форма идёт первой: человек пришёл считать,
              а не читать. Меняем порядок, а не разметку. */}
          <div style={isPhone ? { order: 2 } : null}>
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

          <div style={{ ...S.form, ...(isPhone ? { order: 1, padding: "20px 16px 22px" } : null) }}>
            <div style={S.formTitle}>Рассчитать матрицу</div>
            <div style={S.formSub}>Выберите тип расчёта и заполните данные</div>

            <div className={isPhone ? "hScroll" : undefined}
              style={isPhone ? { ...hScrollRow, gap: 8, paddingBottom: 4 } : S.tabs}>
              {CALC_NAV.map((c) => {
                const on = tab === c.id;
                return (
                  <Link key={c.id} to={c.path} className="chip"
                    style={{
                      ...S.chip,
                      ...(isPhone ? { minHeight: TAP, display: "flex", alignItems: "center", whiteSpace: "nowrap" } : null),
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
              <span style={S.demoDate}>пример · 13.07.1998</span>
            </div>
            <Octagram
              matrix={DEMO_MATRIX}
              onOpenSection={(id) => navigate(`/matrica/${DEMO_DATE_URL}?section=${id}`)}
            />
          </div>

          <div className="card" style={S.demoCard}>
            <div style={S.demoHead}>
              <span style={S.infoLabel}>Карта здоровья</span>
              <span style={S.demoDate}>7 чакр · 3 колонки</span>
            </div>
            <ChakraTable chakras={DEMO_MATRIX.chakras} />
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
          <AgeTimeline timeline={DEMO_MATRIX.timeline} age={DEMO_MATRIX.today.age} />
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

        <PlanCard
          id="once" layout="wide" accent={C.gold}
          chosen={chosenPlan === "once"} dimmed={chosenPlan !== null && chosenPlan !== "once"}
          onSelect={setChosenPlan}
          detailsTo="/tarify"
          cta={{ label: "Купить за 490 ₽", to: "/tarify", variant: "gold" }} />

        <h3 style={S.h3}>Или подписка — сервис, который работает каждый день</h3>

        <div style={S.plans}>
          {SUBSCRIPTION_PLANS.map((id) => (
            <PlanCard key={id} id={id} layout="full"
              chosen={chosenPlan === id} dimmed={chosenPlan !== null && chosenPlan !== id}
              onSelect={setChosenPlan}
              detailsTo="/tarify"
              cta={{ label: "Выбрать", to: "/tarify", variant: id === "path" ? "lilac" : "outline" }} />
          ))}
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
      <DateFields value={data} onChange={(next) => set({ ...data, ...next })} idPrefix={idPrefix} />
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
