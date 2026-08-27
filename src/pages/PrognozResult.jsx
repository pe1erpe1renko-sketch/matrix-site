import React, { useState } from "react";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { ARCANA_NAMES } from "../lib/prompts.js";
import PageStub from "../components/PageStub.jsx";
import DayArcana from "../components/DayArcana.jsx";
import MonthCalendar from "../components/MonthCalendar.jsx";
import AgeTimeline from "../components/AgeTimeline.jsx";
import ResultHeader from "../components/ResultHeader.jsx";
import SectionsBlock from "../components/SectionsBlock.jsx";
import { useCalcPage } from "../components/useCalcPage.js";

/**
 * ПРОГНОЗ — /prognoz/13-07-1998
 * ============================
 * Три уровня на одном экране, переключаются без перезагрузки:
 *   День          — аркан на сегодня и на завтра
 *   Месяц         — календарь, у каждого дня свой аркан
 *   Период жизни  — возрастная шкала и сколько до смены
 *
 * Считается по той же дате, что и общая матрица, поэтому отдельной оплаты
 * не требует: платят за дату, а не за калькулятор.
 *
 * ВНИМАНИЕ, ТРИ РАЗНЫХ ЧИСЛА:
 *   today.dayArcana      — сегодня, меняется каждые сутки
 *   today.tomorrowArcana — завтра
 *   today.arcana         — период жизни, держится 2,5 года
 */

const LEVELS = [
  { id: "day",    label: "День" },
  { id: "month",  label: "Месяц" },
  { id: "period", label: "Период жизни" },
];

/* 27.5 → «27,5»: в русском тексте десятичная запятая, а не точка. */
const ru = (n) => String(n).replace(".", ",");

export default function PrognozResult() {
  const page = useCalcPage("prognoz");
  const [level, setLevel] = useState("day");
  const [openSection, setOpenSection] = useState(page.view.sections[0].id);

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
  const { today } = matrix;

  return (
    <>
      <section style={{ ...S.section, paddingTop: 34, paddingBottom: 26 }}>
        <ResultHeader
          eyebrow="Прогноз"
          humanDates={page.humanDates}
          lead="Три уровня: сутки, месяц и период жизни. Аркан дня считается лично — в формулу входит ваш текущий период, поэтому у двух людей в одну дату числа разные."
          reportKey={page.reportKey}
          isoDates={page.isoDates}
          sectionsTotal={page.sectionsTotal}
          sectionsOpen={page.sectionsOpen}
          backTo="/prognoz"
        />

        <div style={S.switchRow}>
          {LEVELS.map((item) => {
            const on = level === item.id;
            return (
              <button key={item.id} className="chip" style={{
                ...S.chip,
                padding: "9px 18px", fontSize: 13.5,
                background: on ? C.gold : "transparent",
                borderColor: on ? C.gold : C.border,
                color: on ? C.ink : C.text,
                fontWeight: on ? 600 : 400,
                boxShadow: on ? `0 8px 22px -10px ${C.gold}` : "none",
              }} onClick={() => setLevel(item.id)}>
                {item.label}
              </button>
            );
          })}
        </div>

        {level === "day" && <DayArcana today={today} />}

        {level === "month" && (
          <div className="card" style={{ ...S.demoCard, padding: "26px 28px 24px" }}>
            <MonthCalendar today={today} />
          </div>
        )}

        {level === "period" && (
          <div className="card" style={{ ...S.demoCard, padding: "30px 32px 26px" }}>
            <AgeTimeline timeline={matrix.timeline} age={today.age} />
            <div style={{ ...S.dayTomorrow, marginTop: 20, borderTop: "none", paddingTop: 0 }}>
              Сейчас вами управляет аркан {today.arcana}
              <span style={{ color: C.muted }}> · {ARCANA_NAMES[today.arcana]}</span>
            </div>
            <p style={{ ...S.infoText, marginTop: 10, maxWidth: 760 }}>
              Вам {Math.floor(today.age)} — это отрезок от {ru(today.from)} до {ru(today.to)} лет.
              До смены периода {formatYears(today.yearsToChange)}: дальше пойдёт
              аркан {today.nextArcana} ({ARCANA_NAMES[today.nextArcana]}).
              Шкала дробится на отрезки по два с половиной года — из неё берётся
              аркан периода, который участвует в расчёте вашего аркана дня.
            </p>
          </div>
        )}
      </section>

      <SectionsBlock
        sections={page.sections}
        total={page.sectionsTotal}
        open={page.sectionsOpen}
        openId={openSection}
        onToggle={(id) => setOpenSection(openSection === id ? null : id)}
        lead="Аркан дня и период открыты бесплатно. Разбор следующего отрезка — на платном тарифе."
      />
    </>
  );
}

/** «1,88» → «1 год 11 месяцев». Дробные годы человеку ничего не говорят. */
function formatYears(years) {
  const months = Math.max(0, Math.round(years * 12));
  const y = Math.floor(months / 12);
  const m = months % 12;
  const parts = [];
  if (y > 0) parts.push(`${y} ${plural(y, "год", "года", "лет")}`);
  if (m > 0) parts.push(`${m} ${plural(m, "месяц", "месяца", "месяцев")}`);
  return parts.length ? parts.join(" ") : "меньше месяца";
}

function plural(n, one, few, many) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}
