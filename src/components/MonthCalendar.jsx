import React from "react";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { dayArcana } from "../lib/matrixEngine.js";
import { ARCANA_NAMES } from "../lib/prompts.js";

/**
 * КАЛЕНДАРЬ АРКАНОВ НА МЕСЯЦ
 * ==========================
 * У каждого дня свой аркан: dayArcana(дата, аркан текущего периода).
 * Аркан периода в формуле обязателен — без него календарь был бы
 * одинаковым у всех людей на планете.
 *
 * Числа считает движок, здесь только раскладка по неделям.
 * Неделя начинается с понедельника.
 */

const WEEK = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];
const MONTHS = ["январь","февраль","март","апрель","май","июнь",
                "июль","август","сентябрь","октябрь","ноябрь","декабрь"];

const pad = (n) => String(n).padStart(2, "0");

export default function MonthCalendar({ today }) {
  const [year, month, todayDay] = today.date.split("-").map(Number);

  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  /* getUTCDay(): воскресенье = 0. Приводим к понедельнику = 0. */
  const firstWeekday = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;

  const cells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const iso = `${year}-${pad(month)}-${pad(day)}`;
      return { day, iso, arcana: dayArcana(iso, today.arcana), isToday: day === todayDay };
    }),
  ];

  return (
    <div>
      <div style={{ ...S.infoLabel, marginBottom: 14 }}>
        {MONTHS[month - 1]} {year} · период под арканом {today.arcana}
      </div>

      <div style={S.calGrid}>
        {WEEK.map((w) => <div key={w} style={S.calHead}>{w}</div>)}

        {cells.map((cell, i) => cell === null
          ? <div key={"empty" + i} />
          : (
            <div key={cell.iso} style={{
              ...S.calCell,
              borderColor: cell.isToday ? C.gold : C.border,
              background: cell.isToday ? "rgba(228,190,114,0.12)" : "rgba(10,8,23,0.4)",
            }} title={`${cell.day} ${MONTHS[month - 1]} — аркан ${cell.arcana}, ${ARCANA_NAMES[cell.arcana]}`}>
              <span style={{ ...S.calDay, color: cell.isToday ? C.gold : C.muted }}>{cell.day}</span>
              <span style={{ ...S.calArc, color: cell.isToday ? C.goldHi : C.white }}>{cell.arcana}</span>
            </div>
          ))}
      </div>

      <p style={{ ...S.purposeHint, marginTop: 16 }}>
        Число в клетке — аркан этого дня лично для вас. В расчёт входит аркан
        вашего текущего периода жизни, поэтому у другого человека календарь
        на тот же месяц будет другим. Сегодняшний день выделен золотом.
      </p>
    </div>
  );
}
