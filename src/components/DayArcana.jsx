import React from "react";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { ARCANA_NAMES } from "../lib/prompts.js";
import { dailyTextKey } from "../lib/contentPositions.js";
import { useSlotText } from "./useSlotText.js";

/**
 * АРКАН ДНЯ
 * =========
 * ВНИМАНИЕ, ЭТО ДВА РАЗНЫХ ЧИСЛА:
 *   today.dayArcana — аркан на сегодня, меняется каждые сутки. Крупное.
 *   today.arcana    — аркан периода жизни, держится 2,5 года. Мелким снизу.
 * Перепутать их — значит показать человеку одно и то же число месяцами
 * и убить весь смысл ежедневного возврата.
 *
 * Ключ текста включает дату (dailyTextKey), иначе через три недели человек
 * получил бы текст, который уже читал. В конкретный день дата у всех одна,
 * поэтому разных сочетаний максимум 22 — не больше 22 генераций в сутки
 * на весь сервис.
 *
 * Имя в текст не подставляется: текст пишется на числа и общий для всех
 * с таким сочетанием. Имя вставляется шаблоном при выводе.
 */

const WEEKDAYS = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];

/* 27.5 → «27,5»: в русском тексте десятичная запятая, а не точка. */
const ru = (n) => String(n).replace(".", ",");

const humanDate = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["января","февраля","марта","апреля","мая","июня",
                  "июля","августа","сентября","октября","ноября","декабря"];
  return `${d} ${months[m - 1]} ${y}`;
};

export default function DayArcana({ today }) {
  const weekday = WEEKDAYS[new Date(`${today.date}T12:00:00`).getDay()];

  const { loading, text } = useSlotText({
    key: dailyTextKey(today.dayArcana, today.arcana, today.date),
    kind: "daily",
    slotLabel: "Энергия дня",
    sectionTitle: "Аркан дня",
    arcana: today.dayArcana,
    periodArcana: today.arcana,
    weekday,
    date: humanDate(today.date),
  });

  return (
    <div className="card" style={S.dayCard}>
      <div style={S.dayBigWrap}>
        <span style={S.dayBig}>{today.dayArcana}</span>
        <div style={S.dayArcName}>{ARCANA_NAMES[today.dayArcana]}</div>
        <div style={{ ...S.dayPeriod, marginTop: 6 }}>
          {weekday}, {humanDate(today.date)}
        </div>
      </div>

      <div>
        <div style={S.infoLabel}>Ваша энергия на сегодня</div>
        <p style={{ ...S.slotText, opacity: loading ? 0.45 : 1 }}>
          {loading ? "Загружаем прогноз на сегодня…" : text}
        </p>

        <div style={S.dayTomorrow}>
          Завтра — аркан {today.tomorrowArcana}
          <span style={{ color: C.muted }}> · {ARCANA_NAMES[today.tomorrowArcana]}</span>
        </div>

        <p style={S.dayPeriod}>
          Аркан периода жизни — {today.arcana} ({ARCANA_NAMES[today.arcana]}), он держится
          с {ru(today.from)} до {ru(today.to)} лет и сменится примерно через {formatYears(today.yearsToChange)}.
          Этот аркан входит в расчёт вашего аркана дня — поэтому у двух людей
          в одну и ту же дату числа разные.
        </p>
      </div>
    </div>
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
