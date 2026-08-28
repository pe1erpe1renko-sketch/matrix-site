import React from "react";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { ARCANA_NAMES } from "../lib/prompts.js";
import PageStub from "../components/PageStub.jsx";
import CalcTheatre from "../components/CalcTheatre.jsx";
import Octagram from "../components/Octagram.jsx";
import ChakraTable from "../components/ChakraTable.jsx";
import PartnerCores from "../components/PartnerCores.jsx";
import ResultHeader from "../components/ResultHeader.jsx";
import SectionsBlock from "../components/SectionsBlock.jsx";
import NextStepsBlock from "../components/NextStepsBlock.jsx";
import FullMatrixBlock from "../components/FullMatrixBlock.jsx";
import TypeNote from "../components/TypeNote.jsx";
import { useCalcPage } from "../components/useCalcPage.js";

/**
 * ПАРНЫЕ РАЗБОРЫ
 * ==============
 * Одна страница на три адреса: /sovmestimost, /mama-rebenok и /biznes,
 * каждый по двум датам. Числа у них ОДИНАКОВЫЕ — все считаются одной
 * calculatePair(). Различаются только наборы вопросов: тип разбора —
 * это фильтр, а не отдельный расчёт.
 *
 * Матрица пары — сумма одноимённых точек двух личных матриц. Своей даты
 * рождения у пары нет, поэтому здесь нет ни аркана дня, ни возрастной шкалы:
 * то и другое остаётся личным и живёт на /matrica каждого человека.
 *
 * @param {string} pageId — 'sovmestimost', 'mama-rebenok' или 'biznes'
 */
export default function PairResult({ pageId }) {
  const page = useCalcPage(pageId);

  if (!page.valid) {
    return (
      <PageStub
        badge="Неверные даты"
        title="Такие даты разобрать не получится"
        text="В адресе нужны две даты вида /sovmestimost/13-07-1998/09-04-1992 — день, месяц и год через дефис. Проверьте ссылку или начните расчёт заново на главной."
      />
    );
  }

  const { matrix, view } = page;

  /* Сцена расчёта — только при первом открытии этой матрицы. */
  if (page.theatre.playing) {
    return <CalcTheatre matrix={matrix} onDone={page.theatre.finish} />;
  }
  const isLove = pageId === "sovmestimost";
  const isChild = pageId === "mama-rebenok";
  const labels = isLove ? ["Первый", "Второй"]
    : isChild ? ["Родитель", "Ребёнок"]
      : ["Первый партнёр", "Второй партнёр"];

  /* Три числа пары. У пары те же формулы, но читаются они иначе,
     чем в личной матрице, поэтому и подписи здесь свои. */
  const summary = [
    {
      value: matrix.purpose.personal.result,
      title: isLove ? "Отношения" : isChild ? "Ваша связь" : "Задача связки",
      hint: isLove
        ? "Ради чего вас свело и что вы отрабатываете вдвоём."
        : isChild
          ? "Что между вами происходит и какая задача у вас общая."
          : "Зачем вам общее дело и на чём оно держится.",
    },
    {
      value: matrix.purpose.social.result,
      title: "Слияние",
      hint: isLove
        ? "Объединение двух родов: что складывается, когда вы вместе."
        : "Что связка даёт в социуме и как её видят снаружи.",
    },
    {
      value: matrix.purpose.spiritual.result,
      title: "Гармония",
      hint: isLove
        ? "Зрелая стадия: к чему пара приходит, если проходит трение."
        : "Устойчивое состояние дела, когда роли разведены.",
    },
  ];

  return (
    <>
      <section style={{ ...S.section, paddingTop: 34, paddingBottom: 26 }}>
        <ResultHeader
          eyebrow={view.title}
          humanDates={page.humanDates}
          lead={isLove
            ? "Расчёт по двум датам. Матрица пары складывается из двух личных: одноимённые точки суммируются."
            : isChild
              ? "Расчёт по двум датам: вашей и ребёнка. Показывает, что между вами происходит и какой подход работает."
              : "Расчёт по двум датам. Это карта связки, а не оценка человека: она показывает, как складывается работа двоих."}
          reportKey={page.reportKey}
          isoDates={page.isoDates}
          questionsTotal={page.questionsTotal}
          questionsOpen={page.questionsOpen}
          backTo={`/${view.slug}`}
        />

        <TypeNote note={view.note} />

        <div style={S.purposeGrid}>
          {summary.map((item) => (
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

      {/* ОКТАГРАММА ПАРЫ И ЧАКРЫ */}
      <section style={{ ...S.section, background: C.bgAlt, paddingTop: 48 }}>
        <div style={S.eyebrow}>Схема пары</div>
        <h2 style={S.h2}>
          Две даты — <em style={S.h1em}>одна матрица</em>
        </h2>
        <div style={S.demoGrid}>
          <div className="card" style={S.demoCard}>
            <div style={S.demoHead}>
              <span style={S.infoLabel}>Октаграмма пары</span>
              <span style={S.demoDate}>{page.humanDates.join(" + ")}</span>
            </div>
            <Octagram
              matrix={matrix}
              showAge={false}
              emphasis={isLove ? "SW" : "SE"}
             
            />
          </div>

          <div className="card" style={S.demoCard}>
            <div style={S.demoHead}>
              <span style={S.infoLabel}>Энергополе пары</span>
              <span style={S.demoDate}>7 чакр · 3 колонки</span>
            </div>
            <ChakraTable chakras={matrix.chakras} />
          </div>
        </div>
      </section>

      {/* ЯДРА ПАРТНЁРОВ */}
      <section style={S.section}>
        <div style={S.eyebrow}>Из чего сложилась пара</div>
        <h2 style={S.h2}>Личные матрицы <em style={S.h1em}>каждого</em></h2>
        <p style={{ ...S.infoText, maxWidth: 660, margin: "-14px 0 22px" }}>
          Матрица пары — сумма одноимённых точек. Личные матрицы от этого
          не меняются: у каждого остаётся свой разбор, свой аркан дня и свой период жизни.
        </p>
        <PartnerCores partners={matrix.partners} labels={labels} />
      </section>

      <SectionsBlock
        sections={page.sections}
        spheres={page.spheresTotal}
        total={page.questionsTotal}
        open={page.questionsOpen}
        selfDate={page.urlDates[0]}
        humanDates={page.humanDates}
        unlocked={page.access.unlocked}
        lead={isLove
          ? "Числа пары посчитаны целиком. Под замком только трактовки."
          : isChild
            ? "Числа посчитаны целиком по обеим датам. Под замком только трактовки."
            : "Числа связки посчитаны целиком. Под замком только трактовки."}
      />

      {/* Полная матрица считается по одной дате, поэтому кнопок две:
          своя и второго человека. Это разные наборы дат, то есть
          разные разборы. */}
      <FullMatrixBlock
        urlDates={page.urlDates}
        secondTo={isChild ? `/detskaya/${page.urlDates[1]}` : `/matrica/${page.urlDates[1]}`}
        secondLabel={isChild ? "Матрица ребёнка" : "Матрица партнёра"}
      />

      <NextStepsBlock selfDate={page.urlDates[0]} background={C.bg} />
    </>
  );
}
