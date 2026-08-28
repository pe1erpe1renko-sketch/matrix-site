import React from "react";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { ARCANA_NAMES } from "../lib/prompts.js";
import PageStub from "../components/PageStub.jsx";
import CalcTheatre from "../components/CalcTheatre.jsx";
import Octagram from "../components/Octagram.jsx";
import ResultHeader from "../components/ResultHeader.jsx";
import SectionsBlock from "../components/SectionsBlock.jsx";
import NextStepsBlock from "../components/NextStepsBlock.jsx";
import { useCalcPage } from "../components/useCalcPage.js";

/**
 * ФИНАНСЫ — /finansy/13-07-1998
 * ============================
 * Тот же расчёт, что и на /matrica, прочитанный с денежной стороны.
 * Отдельной оплаты не требует: платят за дату, а не за калькулятор —
 * купленный разбор по этой дате открывает и эту страницу.
 *
 * Октаграмма показана с акцентом на диагонали SE: это денежный канал,
 * вокруг него собрана вся страница.
 */
export default function FinansyResult() {
  const page = useCalcPage("finansy");

  if (!page.valid) {
    return (
      <PageStub
        badge="Неверная дата"
        title="Такую дату разобрать не получится"
        text="Дата в адресе пишется как 13-07-1998 — день, месяц и год через дефис. Проверьте ссылку или начните расчёт заново на главной."
      />
    );
  }

  const { matrix } = page;

  /* Сцена расчёта — только при первом открытии этой матрицы. */
  if (page.theatre.playing) {
    return <CalcTheatre matrix={matrix} onDone={page.theatre.finish} />;
  }
  const money = [
    { value: matrix.core.SE,            title: "Денежный канал",  hint: "Через что к вам приходят ресурсы." },
    { value: matrix.diagonals.SE.mid,   title: "Как его раскрыть", hint: "Действие, которое открывает канал." },
    { value: matrix.diagonals.SE.outer, title: "Финансовый блок",  hint: "Где канал перекрыт и что его закрывает." },
    { value: matrix.chakras.rows[4].physics, title: "Статус и владение", hint: "Отношения с деньгами, которые уже у вас." },
  ];

  return (
    <>
      <section style={{ ...S.section, paddingTop: 34, paddingBottom: 26 }}>
        <ResultHeader
          eyebrow="Финансы"
          humanDates={page.humanDates}
          lead="Денежный канал, способ его открыть и место, где он перекрыт. Сумм и сроков здесь нет: матрица показывает механизм, а не прогноз доходов."
          reportKey={page.reportKey}
          isoDates={page.isoDates}
          questionsTotal={page.questionsTotal}
          questionsOpen={page.questionsOpen}
          backTo="/finansy"
        />

        <div style={S.purposeGrid}>
          {money.map((item) => (
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
        <h2 style={S.h2}>Где на схеме <em style={S.h1em}>деньги</em></h2>
        <p style={{ ...S.infoText, maxWidth: 660, margin: "-14px 0 22px" }}>
          Денежная диагональ выделена: от угла SE к центру. Дальняя точка — блок,
          ближняя — способ раскрытия. Нажмите на любое число, чтобы прочитать, что оно значит.
        </p>
        <div className="card" style={{ ...S.demoCard, maxWidth: 700 }}>
          <div style={S.demoHead}>
            <span style={S.infoLabel}>Октаграмма · зона денег</span>
            <span style={S.demoDate}>{page.humanDates[0]}</span>
          </div>
          <Octagram matrix={matrix} emphasis="SE" />
        </div>
      </section>

      <SectionsBlock
        sections={page.sections}
        spheres={page.spheresTotal}
        total={page.questionsTotal}
        open={page.questionsOpen}
        selfDate={page.urlDates[0]}
        lead="Денежные числа посчитаны целиком — они ваши. Под замком только трактовки. Разбор открывается один раз на дату и действует на всех страницах, которые считаются по ней."
      />

      <NextStepsBlock selfDate={page.urlDates[0]} background={C.bg} />
    </>
  );
}
