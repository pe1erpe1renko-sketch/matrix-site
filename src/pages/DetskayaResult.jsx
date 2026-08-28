import React from "react";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { ARCANA_NAMES } from "../lib/prompts.js";
import PageStub from "../components/PageStub.jsx";
import CalcTheatre from "../components/CalcTheatre.jsx";
import Octagram from "../components/Octagram.jsx";
import ChakraTable from "../components/ChakraTable.jsx";
import ResultHeader from "../components/ResultHeader.jsx";
import SectionsBlock from "../components/SectionsBlock.jsx";
import { useCalcPage } from "../components/useCalcPage.js";

/**
 * ДЕТСКАЯ МАТРИЦА — /detskaya/02-11-2019
 * =====================================
 * Обычный расчёт по дате ребёнка. Формула одна и та же — детской матрицу
 * делает не расчёт, а тон разделов: их читает родитель про ребёнка,
 * а не взрослый про себя. Набор разделов приходит из PAGE_VIEWS.detskaya.
 *
 * Это отдельный разбор: считается по дате ребёнка, а не по вашей,
 * поэтому списывает свою единицу лимита.
 *
 * Плашка сверху обязательна. Мы не оцениваем развитие ребёнка и не
 * заменяем специалиста — это должно быть сказано до всех трактовок,
 * а не мелким шрифтом внизу.
 */
export default function DetskayaResult() {
  const page = useCalcPage("detskaya");

  if (!page.valid) {
    return (
      <PageStub
        badge="Неверная дата"
        title="Такую дату разобрать не получится"
        text="Дата рождения ребёнка в адресе пишется как 02-11-2019 — день, месяц и год через дефис. Проверьте ссылку или начните расчёт заново на главной."
      />
    );
  }

  const { matrix } = page;

  /* Сцена расчёта — только при первом открытии этой матрицы. */
  if (page.theatre.playing) {
    return <CalcTheatre matrix={matrix} onDone={page.theatre.finish} />;
  }
  const nature = [
    { value: matrix.core.N, title: "Главный талант",   hint: "С чем ребёнок родился, до всякого воспитания." },
    { value: matrix.core.W, title: "Как проявляется",  hint: "Каким его видят другие дети и взрослые." },
    { value: matrix.core.C, title: "Что даёт опору",   hint: "Состояние, в котором он восстанавливается." },
    { value: matrix.core.S, title: "Главный урок",     hint: "Задача, которая стоит перед ним в этой жизни." },
  ];

  return (
    <>
      <section style={{ ...S.section, paddingTop: 34, paddingBottom: 26 }}>
        <ResultHeader
          eyebrow="Детская матрица"
          humanDates={page.humanDates}
          reportKey={page.reportKey}
          isoDates={page.isoDates}
          questionsTotal={page.questionsTotal}
          questionsOpen={page.questionsOpen}
          backTo="/detskaya"
        />

        <div style={S.notice}>
          <Warn />
          <p style={S.noticeText}>
            <b style={{ color: C.white }}>Это карта особенностей, а не заключение о развитии.</b>{" "}
            Мы не ставим диагнозов и не заменяем специалиста. Если что-то в поведении
            ребёнка вас беспокоит, обращайтесь к врачу или психологу — матрица этого
            разговора не отменяет и не заменяет.
          </p>
        </div>

        <div style={S.purposeGrid}>
          {nature.map((item) => (
            <div key={item.title} className="card" style={S.purposeCard}>
              <span style={S.purposeVal}>{item.value}</span>
              <div style={S.purposeTitle}>{item.title}</div>
              <p style={S.purposeHint}>{item.hint}</p>
              <div style={S.purposeFormula}>
                <span style={{ color: C.lilac }}>{ARCANA_NAMES[item.value]}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ ...S.section, background: C.bgAlt, paddingTop: 48 }}>
        <div style={S.eyebrow}>Схема матрицы</div>
        <h2 style={S.h2}>Карта ребёнка <em style={S.h1em}>целиком</em></h2>
        <div style={S.demoGrid}>
          <div className="card" style={S.demoCard}>
            <div style={S.demoHead}>
              <span style={S.infoLabel}>Октаграмма</span>
              <span style={S.demoDate}>{page.humanDates[0]}</span>
            </div>
            <Octagram matrix={matrix} />
          </div>
          <div className="card" style={S.demoCard}>
            <div style={S.demoHead}>
              <span style={S.infoLabel}>Энергополе</span>
              <span style={S.demoDate}>зоны внимания, не диагнозы</span>
            </div>
            <ChakraTable chakras={matrix.chakras} />
          </div>
        </div>
      </section>

      <SectionsBlock
        sections={page.sections}
        spheres={page.spheresTotal}
        total={page.questionsTotal}
        open={page.questionsOpen}
        lead="Разделы написаны для родителя: не «вы такой», а «ребёнок такой, и вот что с этим делать». Числа открыты все, под замком только трактовки."
      />
    </>
  );
}

function Warn() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
      <circle cx="12" cy="12" r="9" stroke={C.lilac} strokeWidth="1.6" />
      <path d="M12 7.5v5.5" stroke={C.lilac} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="16.4" r="1.1" fill={C.lilac} />
    </svg>
  );
}
