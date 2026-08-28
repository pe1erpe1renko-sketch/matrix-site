import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { ARCANA_NAMES } from "../lib/prompts.js";
import PageStub from "../components/PageStub.jsx";
import CalcTheatre from "../components/CalcTheatre.jsx";
import Octagram from "../components/Octagram.jsx";
import ChakraTable from "../components/ChakraTable.jsx";
import AgeTimeline from "../components/AgeTimeline.jsx";
import PurposeGrid from "../components/PurposeGrid.jsx";
import AncestralLines from "../components/AncestralLines.jsx";
import DayArcana from "../components/DayArcana.jsx";
import ResultHeader from "../components/ResultHeader.jsx";
import SectionsBlock from "../components/SectionsBlock.jsx";
import { useCalcPage } from "../components/useCalcPage.js";

/**
 * СТРАНИЦА РАЗБОРА — /matrica/13-07-1998
 * =====================================
 * Работает по прямой ссылке: дата берётся из адреса, форма для этого
 * не нужна. На этом держится поисковый трафик и пересылка ссылок.
 *
 * Все числа приходят из calculateMatrix(). Ни одного расчёта в этом файле
 * нет и быть не должно: методика закрыта и живёт в src/lib/matrixEngine.js.
 *
 * Разбор по этой дате открывает заодно /finansy и /prognoz по ней же:
 * платят за дату, а не за калькулятор.
 */
export default function MatricaResult() {
  const page = useCalcPage("matrica");

  /* ?section=money — так «Подробнее» с главной попадает сразу в нужную сферу.
     Раскрытием и прокруткой занимается SectionsBlock, сюда кладём только
     просьбу. Поле at нужно, чтобы повторный клик по той же точке сработал. */
  const [searchParams] = useSearchParams();
  const [sphereRequest, setSphereRequest] = useState(null);

  useEffect(() => {
    const id = searchParams.get("section");
    if (id) setSphereRequest({ id, at: Date.now() });
  }, [searchParams]);

  const { matrix } = page;

  /* Сцена расчёта — только при первом открытии этой матрицы. */
  if (page.theatre.playing) {
    return <CalcTheatre matrix={matrix} onDone={page.theatre.finish} />;
  }

  if (!page.valid) {
    return (
      <PageStub
        badge="Неверная дата"
        title="Такую дату разобрать не получится"
        text="Дата в адресе пишется как 13-07-1998 — день, месяц и год через дефис. Проверьте ссылку или начните расчёт заново на главной."
      />
    );
  }

  /* Переход из панели точки октаграммы к нужной сфере разбора. */
  const openSectionById = (id) => setSphereRequest({ id, at: Date.now() });

  const { today } = matrix;
  const ru = (n) => String(n).replace(".", ",");

  return (
    <>
      <section style={{ ...S.section, paddingTop: 34, paddingBottom: 26 }}>
        <ResultHeader
          eyebrow="Матрица судьбы"
          humanDates={page.humanDates}
          lead="Разбор посчитан по дате рождения и не меняется никогда. Этот же разбор открывает страницы «Финансы» и «Прогноз» по той же дате."
          reportKey={page.reportKey}
          isoDates={page.isoDates}
          questionsTotal={page.questionsTotal}
          questionsOpen={page.questionsOpen}
          backTo="/matrica"
        />

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
              <span style={S.demoDate}>{page.humanDates[0]}</span>
            </div>
            <Octagram matrix={matrix} onOpenSection={openSectionById}
              />
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

      <SectionsBlock
        sections={page.sections}
        spheres={page.spheresTotal}
        total={page.questionsTotal}
        open={page.questionsOpen}
        openRequest={sphereRequest}
      />
    </>
  );
}
