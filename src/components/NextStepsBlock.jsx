import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { C, SURFACE } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { RoundIcon } from "./Icons.jsx";
import DateFields from "./DateFields.jsx";
import { NEXT_PEOPLE } from "../lib/nextSteps.js";
import { partsToUrlDate, urlDateToISO } from "../lib/urlDate.js";
import { useAccess } from "../lib/access.js";
import { backToReport } from "../lib/returnTo.js";
import { PLAN_LIMITS } from "../lib/plans.js";
import { useIsPhone, TAP } from "../theme/responsive.js";

/**
 * КОНЕЦ РАЗБОРА: КОГО ПОСМОТРИМ ДАЛЬШЕ
 * ====================================
 * Последнее, что человек видит, дочитав разбор. Не список разделов
 * сайта, а список людей вокруг него: матрица считается по любой дате
 * рождения, своей или чужой.
 *
 * Плитка раскрывает поле даты под собой, повторное нажатие сворачивает.
 * Раскрыта всегда одна — иначе внизу выросла бы стопка одинаковых форм
 * и стало бы непонятно, какая из них к какой плитке.
 *
 * @param {string} selfDate — своя дата в виде ДД-ММ-ГГГГ: нужна тем
 *        переходам, которые считаются по двум датам.
 */
export default function NextStepsBlock({ selfDate, background = C.bgAlt }) {
  const isPhone = useIsPhone();
  const navigate = useNavigate();
  const location = useLocation();
  const { plan, limit, reports } = useAccess();
  const [openId, setOpenId] = useState(null);
  const [date, setDate] = useState({ d: "", m: "", y: "" });

  const chosen = NEXT_PEOPLE.find((p) => p.id === openId);
  const urlDate = partsToUrlDate(date);
  const filled = Boolean(date.d && date.m && /^\d{4}$/.test(date.y));
  const realDate = Boolean(urlDate && urlDateToISO(urlDate));
  const exhausted = limit > 0 && reports.length >= limit;

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
    setDate({ d: "", m: "", y: "" });
  };

  return (
    <section style={{ ...S.section, background }}>
      <div style={S.eyebrow}>Конец разбора</div>
      <h2 style={S.h2}>Кого посмотрим <em style={S.h1em}>дальше?</em></h2>
      <p style={{ ...S.infoText, maxWidth: 660, margin: "-14px 0 26px" }}>
        Матрица считается по любой дате рождения — своей или чужой.
      </p>

      <div style={S.nextTiles}>
        {NEXT_PEOPLE.map((person) => (
          <Tile key={person.id} person={person} open={openId === person.id}
            onToggle={() => toggle(person.id)} />
        ))}
      </div>

      {chosen && (
        <div style={{ ...S.nextForm, padding: isPhone ? "16px 16px 18px" : "18px 20px" }}>
          {exhausted ? (
            <>
              <div style={S.stepHead}>Разборы по тарифу кончились</div>
              <p style={S.stepNote}>
                На тарифе «{PLAN_LIMITS[plan].label}» открыто {reports.length} из {limit}.
                Чтобы посчитать ещё одну дату, нужен тариф выше — уже открытые разборы
                при этом остаются.
              </p>
              <button className="btnOutline" onClick={() => navigate("/tarify", { state: backToReport(location) })} style={{
                ...S.ctaSmall, marginTop: 12, minHeight: TAP, border: `1px solid ${C.border}`,
                background: "transparent", color: C.white, width: isPhone ? "100%" : "auto",
              }}>Посмотреть тарифы</button>
            </>
          ) : (
            <>
              <label style={{ ...S.stepFieldLabel, marginTop: 0 }}>{chosen.field}</label>
              <div style={{
                display: "flex", gap: 12, alignItems: "flex-end",
                flexDirection: isPhone ? "column" : "row",
              }}>
                <div style={{ flex: 1, minWidth: 0, width: "100%" }}>
                  <DateFields value={date} onChange={setDate} idPrefix={`next-${chosen.id}-`} stack />
                </div>
                <button className={filled && realDate ? "btnGold" : undefined}
                  disabled={!filled || !realDate}
                  onClick={() => navigate(chosen.to(selfDate, urlDate))}
                  style={{
                    ...S.ctaSmall, minHeight: TAP, width: isPhone ? "100%" : "auto",
                    background: filled && realDate ? C.gold : C.disabled,
                    color: filled && realDate ? C.ink : C.faint,
                    cursor: filled && realDate ? "pointer" : "default",
                  }}>Посчитать</button>
              </div>
              {filled && !realDate && (
                <p style={{ ...S.stepNote, color: C.pink }}>Такой даты нет — проверьте день и месяц.</p>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}

/**
 * Плитка человека. Наведение считается в JS: рамка и подсветка заданы
 * встроенным стилем, а он перебивает :hover из таблицы стилей
 * (CLAUDE.md, раздел 8) — правило просто не сработало бы.
 */
function Tile({ person, open, onToggle }) {
  const [hover, setHover] = useState(false);
  const lit = hover || open;

  return (
    <button className="nextTile" style={{
      ...S.nextTile,
      minHeight: TAP + 20,
      borderColor: open ? person.accent : lit ? C.borderHi : C.border,
      background: open ? SURFACE.cardHi : lit ? "rgba(31,24,65,0.6)" : SURFACE.card,
      boxShadow: open ? `0 18px 44px -26px ${person.accent}` : "none",
      color: C.white,
    }}
      aria-expanded={open}
      onClick={onToggle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}>
      <RoundIcon name={person.icon} accent={person.accent} size={42} />
      <span style={{ minWidth: 0, flex: 1 }}>
        <span style={{ ...S.nextTileName, display: "block", color: open ? C.white : C.text }}>
          {person.name}
        </span>
        <span style={{ ...S.nextTileSub, display: "block" }}>{person.sub}</span>
      </span>
      <span style={{
        color: open ? person.accent : C.muted, fontSize: 19, lineHeight: 1,
        transition: "transform .18s ease, color .18s ease",
        transform: open ? "rotate(45deg)" : "none", flexShrink: 0,
      }}>+</span>
    </button>
  );
}
