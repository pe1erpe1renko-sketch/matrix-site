import React, { useState } from "react";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { ARCANA_NAMES } from "../lib/prompts.js";
import PageStub from "../components/PageStub.jsx";
import CalcTheatre from "../components/CalcTheatre.jsx";
import DayArcana from "../components/DayArcana.jsx";
import MonthCalendar from "../components/MonthCalendar.jsx";
import AgeTimeline from "../components/AgeTimeline.jsx";
import ResultHeader from "../components/ResultHeader.jsx";
import SectionsBlock from "../components/SectionsBlock.jsx";
import NextStepsBlock from "../components/NextStepsBlock.jsx";
import FullMatrixBlock from "../components/FullMatrixBlock.jsx";
import { useCalcPage } from "../components/useCalcPage.js";

/**
 * ПРОГНОЗ — /prognoz/13-07-1998
 * ============================
 * Четыре масштаба на одном экране, переключаются без перезагрузки:
 *   День          — аркан на сегодня и на завтра
 *   Месяц         — календарь, у каждого дня свой аркан
 *   Личный год    — аркан текущего календарного года
 *   Период жизни  — возрастная шкала и сколько до смены
 *
 * Считается по той же дате, что и общая матрица, поэтому отдельной оплаты
 * не требует: платят за дату, а не за калькулятор.
 *
 * ВНИМАНИЕ, ЧЕТЫРЕ РАЗНЫХ ЧИСЛА:
 *   today.dayArcana      — сегодня, меняется каждые сутки
 *   today.tomorrowArcana — завтра
 *   today.yearArcana     — личный год, меняется с календарным годом
 *   today.arcana         — период жизни, держится 2,5 года
 */

/* Четыре временных масштаба, от короткого к длинному:
   сутки → месяц → календарный год → отрезок жизни в 2,5 года. */
const LEVELS = [
  { id: "day",    label: "День" },
  { id: "month",  label: "Месяц" },
  { id: "year",   label: "Личный год" },
  { id: "period", label: "Период жизни" },
];

/* 27.5 → «27,5»: в русском тексте десятичная запятая, а не точка. */
const ru = (n) => String(n).replace(".", ",");

export default function PrognozResult() {
  const page = useCalcPage("prognoz");
  const [level, setLevel] = useState("day");

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
  const { today } = matrix;

  return (
    <>
      <section style={{ ...S.section, paddingTop: 34, paddingBottom: 26 }}>
        <ResultHeader
          eyebrow="Прогноз"
          humanDates={page.humanDates}
          lead="Четыре масштаба: сутки, месяц, календарный год и отрезок жизни в 2,5 года. Все считаются лично — в аркан дня входит ваш текущий период, а в аркан года день и месяц вашего рождения."
          reportKey={page.reportKey}
          isoDates={page.isoDates}
          questionsTotal={page.questionsTotal}
          questionsOpen={page.questionsOpen}
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

        {level === "year" && <PersonalYear today={today} />}

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
        spheres={page.spheresTotal}
        total={page.questionsTotal}
        open={page.questionsOpen}
        selfDate={page.urlDates[0]}
        humanDates={page.humanDates}
        unlocked={page.access.unlocked}
        lead="Аркан дня и период открыты бесплатно. Разбор следующего отрезка — на платном тарифе."
      />

      <FullMatrixBlock urlDates={page.urlDates} />

      <NextStepsBlock selfDate={page.urlDates[0]} background={C.bg} />
    </>
  );
}

/**
 * ЛИЧНЫЙ ГОД
 * ==========
 * Аркан года считает движок от дня и месяца рождения, поэтому меняется он
 * В ДЕНЬ РОЖДЕНИЯ, а не первого января: год у каждого свой. Дату следующей
 * смены движок отдаёт готовой — today.yearChangeDate.
 *
 * Не путать с двумя соседними числами: аркан дня меняется каждые сутки,
 * аркан периода жизни держится 2,5 года. Здесь третий масштаб.
 */
function PersonalYear({ today }) {
  const change = humanDate(today.yearChangeDate);
  const daysLeft = daysUntil(today.date, today.yearChangeDate);

  return (
    <div className="card" style={S.dayCard}>
      <div style={S.dayBigWrap}>
        <span style={S.dayBig}>{today.yearArcana}</span>
        <div style={S.dayArcName}>{ARCANA_NAMES[today.yearArcana]}</div>
        <div style={{ ...S.dayPeriod, marginTop: 6 }}>до {change}</div>
      </div>

      <div>
        <div style={S.infoLabel}>Энергия текущего личного года</div>
        <p style={S.slotText}>
          Аркан {today.yearArcana} ({ARCANA_NAMES[today.yearArcana]}) ведёт вас
          до {change}. Он считается от дня и месяца вашего рождения, поэтому
          личный год у каждого свой: он начинается не первого января,
          а в ваш день рождения.
        </p>

        <div style={S.dayTomorrow}>
          Следующий личный год начнётся {change}
          <span style={{ color: C.muted }}> · через {daysLeft} {plural(daysLeft, "день", "дня", "дней")}</span>
        </div>

        <p style={S.dayPeriod}>
          Разбор года — в сфере «Личный год» ниже на странице. Это третий масштаб
          рядом с арканом дня, который меняется каждые сутки, и арканом периода
          жизни, который держится 2,5 года.
        </p>
      </div>
    </div>
  );
}

const MONTHS_GEN = ["января","февраля","марта","апреля","мая","июня",
                    "июля","августа","сентября","октября","ноября","декабря"];

/** '2027-07-13' → «13 июля 2027». */
function humanDate(iso) {
  const [y, m, d] = String(iso).split("-").map(Number);
  return `${d} ${MONTHS_GEN[m - 1]} ${y}`;
}

/** Сколько суток осталось между двумя ISO-датами. */
function daysUntil(fromISO, toISO) {
  const day = 24 * 60 * 60 * 1000;
  const diff = Date.parse(`${toISO}T00:00:00Z`) - Date.parse(`${fromISO}T00:00:00Z`);
  return Math.max(0, Math.round(diff / day));
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
