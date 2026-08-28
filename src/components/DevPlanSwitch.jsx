import React from "react";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { PLAN_ORDER, PLAN_LIMITS } from "../lib/plans.js";
import { useAccess, setPlan, unlockReport, lockReport } from "../lib/access.js";

/**
 * DEV-ПЕРЕКЛЮЧАТЕЛЬ ДОСТУПОВ
 * =========================
 * Служебный инструмент для предпросмотра: можно выбрать тариф и открыть
 * разбор, не заводя вход и не платя.
 *
 * Здесь же видно главное правило: платят за дату, а не за калькулятор.
 * Откройте разбор на /matrica/13-07-1998 и перейдите на /finansy/13-07-1998 —
 * он уже открыт, единица лимита не тратится второй раз. А /detskaya
 * по другой дате останется закрытой: это другой разбор.
 *
 * Оформлен пунктиром и подписан явно, чтобы его не приняли за элемент сайта.
 * УБРАТЬ вместе с появлением настоящей авторизации и оплаты.
 */
export default function DevPlanSwitch({ reportKey, dates, questionsTotal, questionsOpen }) {
  const { plan, reports, limit, unlocked, canUnlockMore } = useAccess(reportKey);
  const limitLabel = Number.isFinite(limit) ? limit : "∞";

  return (
    <div style={S.devBar}>
      <span style={S.devLabel}>Служебное · тариф</span>

      {PLAN_ORDER.map((id) => {
        const on = plan === id;
        return (
          <button key={id} className="chip" style={{
            ...S.chip,
            background: on ? C.lilacBtn : "transparent",
            borderColor: on ? C.lilacBtn : C.border,
            color: on ? C.ink : C.text,
            fontWeight: on ? 600 : 400,
          }} onClick={() => setPlan(id)}>
            {PLAN_LIMITS[id].label}
          </button>
        );
      })}

      <span style={{ ...S.devDivider }} />

      {unlocked ? (
        <button className="chip" style={{
          ...S.chip, background: "transparent", borderColor: C.gold, color: C.gold,
        }} onClick={() => lockReport(reportKey)}>
          Разбор открыт — закрыть
        </button>
      ) : (
        <button className="chip" disabled={!canUnlockMore} style={{
          ...S.chip,
          background: canUnlockMore ? C.gold : "transparent",
          borderColor: canUnlockMore ? C.gold : C.border,
          color: canUnlockMore ? C.ink : C.muted,
          fontWeight: canUnlockMore ? 600 : 400,
        }} onClick={() => unlockReport(reportKey)}>
          {canUnlockMore ? "Открыть разбор по этим датам" : "Лимит тарифа исчерпан"}
        </button>
      )}

      <p style={S.devHint}>
        Разборов открыто: {reports.length} из {limitLabel}. Этот разбор считается
        по {dates.length > 1 ? "датам" : "дате"} {dates.join(" и ")} — на этом же наборе дат
        работают все страницы, которые из него считаются.
        Вопросов открыто: {questionsOpen} из {questionsTotal}.
      </p>
    </div>
  );
}
