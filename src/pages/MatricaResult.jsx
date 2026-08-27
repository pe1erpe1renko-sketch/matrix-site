import React, { useState, useMemo, useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { calculateMatrix } from "../lib/matrixEngine.js";
import { buildSectionData } from "../lib/contentPositions.js";
import { sectionsUnlocked, sectionsOpen, SECTIONS_TOTAL, DEFAULT_PLAN } from "../lib/plans.js";
import { urlDateToISO, urlDateToHuman } from "../lib/urlDate.js";
import { ARCANA_NAMES } from "../lib/prompts.js";
import PageStub from "../components/PageStub.jsx";
import Octagram from "../components/Octagram.jsx";
import ChakraTable from "../components/ChakraTable.jsx";
import AgeTimeline from "../components/AgeTimeline.jsx";
import PurposeGrid from "../components/PurposeGrid.jsx";
import AncestralLines from "../components/AncestralLines.jsx";
import SectionList from "../components/SectionList.jsx";
import DayArcana from "../components/DayArcana.jsx";
import DevPlanSwitch from "../components/DevPlanSwitch.jsx";

/**
 * СТРАНИЦА РАЗБОРА — /matrica/13-07-1998
 * =====================================
 * Работает по прямой ссылке: дата берётся из адреса, форма для этого
 * не нужна. На этом держится поисковый трафик и пересылка ссылок.
 *
 * Все числа приходят из calculateMatrix(). Ни одного расчёта в этом файле
 * нет и быть не должно: методика закрыта и живёт в src/lib/matrixEngine.js.
 *
 * Тариф пока берётся из служебного переключателя. Когда появится вход,
 * он придёт с бэкенда — заменить нужно будет только строку с useState.
 */
export default function MatricaResult() {
  const { date } = useParams();
  const iso = urlDateToISO(date);

  const [plan, setPlan] = useState(DEFAULT_PLAN);

  /* ?section=money_flow — так «Подробнее» с главной попадает сразу в раздел. */
  const [searchParams] = useSearchParams();
  const [openSection, setOpenSection] = useState(searchParams.get("section") || "character");

  /* Расчёт один раз на дату. Несуществующая дата → matrix === null. */
  const matrix = useMemo(() => {
    if (!iso) return null;
    try {
      return calculateMatrix(iso);
    } catch {
      return null;
    }
  }, [iso]);

  const unlocked = sectionsUnlocked(plan);

  /* Пришли по ссылке с разделом — доводим до него, а не бросаем вверху страницы.
     Ждём кадр: к моменту эффекта разделы уже в разметке, но ещё не разложены. */
  const requestedSection = searchParams.get("section");
  useEffect(() => {
    if (!requestedSection) return undefined;
    const id = requestAnimationFrame(() => {
      const node = document.getElementById(`section-${requestedSection}`);
      if (node) node.scrollIntoView({ behavior: "auto", block: "center" });
    });
    return () => cancelAnimationFrame(id);
  }, [requestedSection]);

  const sections = useMemo(() => {
    if (!matrix) return [];
    return buildSectionData(matrix, { unlocked }).map((section) =>
      section.id === "day_arcana"
        // Аркан дня показан крупно вверху страницы — второй раз тот же
        // текст печатать незачем, оставляем ссылку на верхний блок.
        ? { ...section, note: `Ваш аркан на сегодня — ${matrix.today.dayArcana} (${ARCANA_NAMES[matrix.today.dayArcana]}). Он показан целиком в самом верху страницы, вместе с арканом на завтра.` }
        : section
    );
  }, [matrix, unlocked]);

  if (!matrix) {
    return (
      <PageStub
        badge="Неверная дата"
        title="Такую дату разобрать не получится"
        text="Дата в адресе пишется как 13-07-1998 — день, месяц и год через дефис. Проверьте ссылку или начните расчёт заново на главной."
      />
    );
  }

  /* Переход из панели точки октаграммы в раздел разбора. */
  const openSectionById = (id) => {
    setOpenSection(id);
    const node = document.getElementById(`section-${id}`);
    if (node) node.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const { today } = matrix;

  /* 27.5 → «27,5»: в русском тексте десятичная запятая, а не точка. */
  const ru = (n) => String(n).replace(".", ",");

  return (
    <>
      <section style={{ ...S.section, paddingTop: 34, paddingBottom: 26 }}>
        <DevPlanSwitch plan={plan} onChange={setPlan} />

        <div style={S.resultHead}>
          <div>
            <div style={S.eyebrow}>Матрица судьбы</div>
            <h1 style={S.resultDate}>{urlDateToHuman(date)}</h1>
            <p style={{ ...S.purposeHint, maxWidth: 520 }}>
              Разбор посчитан по дате рождения и не меняется никогда.
              Открыто разделов: {sectionsOpen(plan)} из {SECTIONS_TOTAL}.
            </p>
          </div>
          <Link to="/matrica" className="link" style={S.link}>Посчитать другую дату</Link>
        </div>

        <DayArcana today={today} />
      </section>

      {/* ОКТАГРАММА И ЧАКРАЛЬНАЯ ТАБЛИЦА */}
      <section style={{ ...S.section, background: C.bgAlt, paddingTop: 48 }}>
        <div style={S.eyebrow}>Схема матрицы</div>
        <h2 style={S.h2}>
          Одна дата — <em style={S.h1em}>шестьдесят чисел</em>
        </h2>
        <div style={S.demoGrid}>
          <div className="card" style={S.demoCard}>
            <div style={S.demoHead}>
              <span style={S.infoLabel}>Октаграмма</span>
              <span style={S.demoDate}>{urlDateToHuman(date)}</span>
            </div>
            <Octagram matrix={matrix} onOpenSection={openSectionById} sectionsUnlocked={unlocked} />
          </div>

          <div className="card" style={S.demoCard}>
            <div style={S.demoHead}>
              <span style={S.infoLabel}>Карта здоровья</span>
              <span style={S.demoDate}>7 чакр · 3 колонки</span>
            </div>
            <ChakraTable chakras={matrix.chakras} />
          </div>
        </div>
      </section>

      {/* ПРЕДНАЗНАЧЕНИЯ */}
      <section style={S.section}>
        <div style={S.eyebrow}>Предназначение</div>
        <h2 style={S.h2}>Четыре уровня задачи</h2>
        <PurposeGrid purpose={matrix.purpose} />
      </section>

      {/* РОДОВЫЕ ПРОГРАММЫ */}
      <section style={{ ...S.section, background: C.bgAlt }}>
        <div style={S.eyebrow}>Род</div>
        <h2 style={S.h2}>Что тянется <em style={S.h1em}>по линиям рода</em></h2>
        <AncestralLines ancestral={matrix.ancestral} />
      </section>

      {/* ВОЗРАСТНАЯ ШКАЛА */}
      <section style={S.section}>
        <div style={S.eyebrow}>Возрастная шкала</div>
        <h2 style={S.h2}>Какая энергия ведёт вас <em style={S.h1em}>сейчас</em></h2>
        <div className="card" style={{ ...S.demoCard, padding: "30px 32px 26px" }}>
          <AgeTimeline timeline={matrix.timeline} age={today.age} />
          <p style={{ ...S.infoText, marginTop: 22, maxWidth: 760 }}>
            Сейчас вам {Math.floor(today.age)} — вы в периоде от {ru(today.from)} до {ru(today.to)} лет,
            им управляет аркан {today.arcana} ({ARCANA_NAMES[today.arcana]}).
            Следующий период пройдёт под арканом {today.nextArcana} ({ARCANA_NAMES[today.nextArcana]}).
            Между вехами шкала дробится до отрезков в два с половиной года — отсюда и берётся
            аркан периода, который участвует в расчёте вашего аркана дня.
          </p>
        </div>
      </section>

      {/* 25 РАЗДЕЛОВ */}
      <section style={{ ...S.section, background: C.bgAlt }}>
        <div style={S.eyebrow}>Разбор</div>
        <h2 style={S.h2}>
          {SECTIONS_TOTAL} разделов, {sectionsOpen(plan)} <em style={S.h1em}>открыто</em>
        </h2>
        <p style={{ ...S.infoText, maxWidth: 660, margin: "-14px 0 26px" }}>
          Числа посчитаны по всем разделам сразу — они ваши. Под замком только
          трактовки: они открываются на любом платном тарифе.
        </p>
        <SectionList
          sections={sections}
          openId={openSection}
          onToggle={(id) => setOpenSection(openSection === id ? null : id)}
        />
      </section>
    </>
  );
}
