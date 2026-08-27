import React from "react";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { PLAN_ORDER, PLAN_LIMITS, sectionsOpen, SECTIONS_TOTAL } from "../lib/plans.js";

/**
 * DEV-ПЕРЕКЛЮЧАТЕЛЬ ТАРИФА
 * ========================
 * Служебный инструмент для проверки доступов на предпросмотре: видно,
 * что открыто на бесплатном тарифе и что появляется после оплаты,
 * без входа и без оплаты.
 *
 * Оформлен пунктиром и подписан явно, чтобы его не приняли за элемент
 * сайта. УБРАТЬ, когда появится настоящая авторизация: тариф придёт
 * с бэкенда, а не из переключателя в браузере.
 */
export default function DevPlanSwitch({ plan, onChange }) {
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
          }} onClick={() => onChange(id)}>
            {PLAN_LIMITS[id].label}
          </button>
        );
      })}

      <p style={S.devHint}>
        Переключатель для проверки доступов, на сайте его не будет.
        Сейчас открыто разделов: {sectionsOpen(plan)} из {SECTIONS_TOTAL}.
      </p>
    </div>
  );
}
