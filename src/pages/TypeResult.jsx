import React from "react";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import PageStub from "../components/PageStub.jsx";
import CalcTheatre from "../components/CalcTheatre.jsx";
import Octagram from "../components/Octagram.jsx";
import ChakraTable from "../components/ChakraTable.jsx";
import PurposeGrid from "../components/PurposeGrid.jsx";
import AncestralLines from "../components/AncestralLines.jsx";
import ResultHeader from "../components/ResultHeader.jsx";
import SectionsBlock from "../components/SectionsBlock.jsx";
import NextStepsBlock from "../components/NextStepsBlock.jsx";
import FullMatrixBlock from "../components/FullMatrixBlock.jsx";
import TypeNote from "../components/TypeNote.jsx";
import { useCalcPage } from "../components/useCalcPage.js";

/**
 * ТЕМАТИЧЕСКИЙ РАЗБОР ПО ОДНОЙ ДАТЕ
 * =================================
 * Одна страница на четыре адреса: /karma, /zdorovie, /rod,
 * /prednaznachenie. Тип разбора — это фильтр вопросов, а не отдельный
 * расчёт: числа те же самые, меняется только то, какие из девяноста двух
 * вопросов показаны. Поэтому и страница одна.
 *
 * Своя страница остаётся у матрицы судьбы (там вся схема целиком),
 * у денег (октаграмма с акцентом на денежный канал), у детской
 * и у прогноза — там содержимое разное не только набором вопросов.
 *
 * СХЕМА СВЕРХУ подбирается под тип: здоровью — чакральная таблица,
 * роду — родовые линии, предназначению — четыре уровня задачи.
 * Это не украшение: человек пришёл за темой и должен сразу увидеть
 * числа по ней, а не общую картинку.
 */
export default function TypeResult({ typeId }) {
  const page = useCalcPage(typeId);
  const { matrix, view } = page;

  if (!page.valid) {
    return (
      <PageStub
        badge="Неверная дата"
        title="Такую дату разобрать не получится"
        text="Дата в адресе пишется как 13-07-1998 — день, месяц и год через дефис. Проверьте ссылку или начните расчёт заново на главной."
      />
    );
  }

  /* Сцена расчёта — только при первом открытии этой матрицы. */
  if (page.theatre.playing) {
    return <CalcTheatre matrix={matrix} onDone={page.theatre.finish} />;
  }

  return (
    <>
      <section style={{ ...S.section, paddingTop: 34, paddingBottom: 26 }}>
        <ResultHeader
          eyebrow={view.title}
          humanDates={page.humanDates}
          lead={view.lead}
          reportKey={page.reportKey}
          isoDates={page.isoDates}
          questionsTotal={page.questionsTotal}
          questionsOpen={page.questionsOpen}
          backTo={`/${view.slug}`}
        />

        <TypeNote note={view.note} />
      </section>

      <section style={{ ...S.section, background: C.bgAlt, paddingTop: 44 }}>
        <div style={S.eyebrow}>Числа по теме</div>
        <h2 style={S.h2}>{HEAD[typeId] || "Что посчитано"}</h2>
        <div className="card" style={S.demoCard}>
          <div style={S.demoHead}>
            <span style={S.infoLabel}>{CHART[typeId] || "Октаграмма"}</span>
            <span style={S.demoDate}>{page.humanDates[0]}</span>
          </div>
          <Chart typeId={typeId} matrix={matrix} />
        </div>
      </section>

      <SectionsBlock
        sections={page.sections}
        spheres={page.spheresTotal}
        total={page.questionsTotal}
        open={page.questionsOpen}
        selfDate={page.urlDates[0]}
        humanDates={page.humanDates}
        unlocked={page.access.unlocked}
        background={C.bg}
        lead="Числа посчитаны целиком — они ваши. Под замком только трактовки. Разбор открывается один раз на дату и действует на всех страницах, которые считаются по ней."
      />

      <FullMatrixBlock urlDates={page.urlDates} />

      <NextStepsBlock selfDate={page.urlDates[0]} />
    </>
  );
}

const HEAD = {
  karma: "Что тянется и куда возвращается",
  zdorovie: "Карта здоровья по чакрам",
  rod: "Что идёт по линиям рода",
  prednaznachenie: "Четыре уровня задачи",
};

const CHART = {
  karma: "Октаграмма",
  zdorovie: "7 чакр · 3 колонки",
  rod: "Мужская и женская линии",
  prednaznachenie: "Предназначение",
};

function Chart({ typeId, matrix }) {
  if (typeId === "zdorovie") return <ChakraTable chakras={matrix.chakras} />;
  if (typeId === "rod") return <AncestralLines ancestral={matrix.ancestral} />;
  if (typeId === "prednaznachenie") return <PurposeGrid purpose={matrix.purpose} />;
  return <Octagram matrix={matrix} />;
}
