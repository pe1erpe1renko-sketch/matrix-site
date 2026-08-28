import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { RoundIcon } from "./Icons.jsx";
import DateFields from "./DateFields.jsx";
import { partsToUrlDate, urlDateToISO } from "../lib/urlDate.js";
import { useAccess } from "../lib/access.js";
import { PLAN_LIMITS } from "../lib/plans.js";
import { useIsPhone, TAP } from "../theme/responsive.js";

/**
 * КАРТОЧКА СЛЕДУЮЩЕГО ШАГА
 * ========================
 * Стоит в конце раскрытой сферы. Текст и адрес берутся из lib/nextSteps.js,
 * здесь только поведение.
 *
 * ДАТА ВВОДИТСЯ ЗДЕСЬ ЖЕ. Соблазн увести человека на форму велик, но
 * каждый лишний переход теряет половину людей: нажал — и сразу расчёт.
 *
 * ЛИМИТ ТАРИФА. Новая дата — это новый разбор, то есть единица лимита.
 * Если тариф разрешал разборы и они кончились, кнопка ведёт на тарифы
 * с пояснением, а не выдаёт ошибку после расчёта.
 * На бесплатном тарифе лимит нулевой изначально — там ничего не «кончалось»,
 * и посчитать новую дату можно как везде на сайте: числа считаются всегда,
 * под замком только трактовки.
 */
export default function NextStepCard({ step, selfDate }) {
  const isPhone = useIsPhone();
  const navigate = useNavigate();
  const location = useLocation();
  const { plan, limit, reports } = useAccess();
  const [date, setDate] = useState({ d: "", m: "", y: "" });

  const needsDate = Boolean(step.field);
  const urlDate = needsDate ? partsToUrlDate(date) : null;
  const filled = needsDate ? Boolean(date.d && date.m && /^\d{4}$/.test(date.y)) : true;
  const realDate = Boolean(urlDate && urlDateToISO(urlDate));
  const target = step.to(selfDate, urlDate);

  /* Карточка не зовёт туда, где человек уже стоит. */
  if (!needsDate && target === location.pathname) return null;

  /* Разборы кончились: считать новую дату некуда девать. */
  const exhausted = needsDate && limit > 0 && reports.length >= limit;

  const go = () => { if (filled && realDate) navigate(target); };

  return (
    <div className="stepCard" style={{
      ...S.stepCard,
      flexDirection: isPhone ? "column" : "row",
      padding: isPhone ? "16px 16px 18px" : "18px 20px",
    }}>
      <RoundIcon name={step.icon} accent={step.accent} size={isPhone ? 40 : 46} />

      <div style={{ flex: 1, minWidth: 0, width: "100%" }}>
        <div style={S.stepHead}>{step.title}</div>
        <p style={S.stepText}>{step.text}</p>

        {exhausted ? (
          <>
            <p style={S.stepNote}>
              На тарифе «{PLAN_LIMITS[plan].label}» открыто {reports.length} из {limit}{" "}
              {plural(limit, "разбор", "разбора", "разборов")}. Чтобы посчитать ещё одну дату,
              нужен тариф выше — уже открытые разборы при этом остаются.
            </p>
            <Link to="/tarify" className="btnOutline" style={{
              ...S.ctaSmall, marginTop: 12, minHeight: TAP, border: `1px solid ${C.border}`,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              color: C.white, width: isPhone ? "100%" : "auto",
            }}>Посмотреть тарифы</Link>
          </>
        ) : needsDate ? (
          <>
            <label style={S.stepFieldLabel}>{step.field}</label>
            <DateFields value={date} onChange={setDate} idPrefix={`step-${step.icon}-`} stack />
            {filled && !realDate && (
              <p style={{ ...S.stepNote, color: C.pink }}>Такой даты нет — проверьте день и месяц.</p>
            )}
            <button className={filled && realDate ? "btnGold" : undefined}
              disabled={!filled || !realDate}
              onClick={go}
              style={{
                ...S.ctaSmall, marginTop: 12, minHeight: TAP, width: isPhone ? "100%" : "auto",
                background: filled && realDate ? C.gold : C.disabled,
                color: filled && realDate ? C.ink : C.faint,
                cursor: filled && realDate ? "pointer" : "default",
              }}>
              {step.button}
            </button>
          </>
        ) : (
          <Link to={target} className="stepLink" style={{
            display: "inline-flex", alignItems: "center", gap: 9, marginTop: 14,
            minHeight: TAP, color: step.accent, fontSize: 14.5, fontWeight: 600,
            textDecoration: "none",
          }}>
            {step.button}
            <Arrow />
          </Link>
        )}
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={S.stepArrow} aria-hidden="true">
      <path d="M5 12h13M12.5 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function plural(n, one, few, many) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}
