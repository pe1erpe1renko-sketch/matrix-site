import React from "react";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { PLAN_LIMITS, PLAN_ORDER } from "../lib/plans.js";
import { useAccess, setPlan } from "../lib/access.js";
import { usePeople, telegramUsed } from "../lib/people.js";
import { useConversations, messagesToday } from "../lib/conversations.js";
import { toISODate } from "../lib/matrixEngine.js";
import { Meter } from "../components/Controls.jsx";
import { useIsPhone, TAP } from "../theme/responsive.js";
import { useState } from "react";

/**
 * ТАРИФЫ И ОПЛАТА — /tarify
 * =========================
 * Текущий тариф, три счётчика с полосами и история платежей.
 *
 * Все числа приходят из PLAN_LIMITS: цены и лимиты зафиксированы
 * в CLAUDE.md, раздел 4, и в разметке им делать нечего.
 *
 * Кнопки перехода пока переключают тариф на месте — это заглушка вместо
 * оплаты. Настоящий платёж придёт в задаче 5 (payment.js).
 */

const PRICES = {
  free: "0 ₽", once: "490 ₽ разово", path: "590 ₽/мес",
  circle: "990 ₽/мес", unlimited: "1790 ₽/мес",
};

/* История платежей — пример разметки. Придёт с бэкенда вместе с чеками. */
const HISTORY = [
  { date: "24 августа 2026", subject: "Близкий круг — продление", sum: "990 ₽" },
  { date: "24 июля 2026", subject: "Близкий круг — продление", sum: "990 ₽" },
  { date: "24 июня 2026", subject: "Переход со «Своего пути»", sum: "990 ₽" },
  { date: "24 мая 2026", subject: "Свой путь — продление", sum: "590 ₽" },
];

const KEEP = [
  ["Архив прогнозов", "остаётся навсегда", true],
  ["Купленные разборы", "остаются навсегда", true],
  ["Матрицы сверх лимита", "останутся видны, но закроются", false],
  ["Аркан дня в Telegram", "перестанет приходить", false],
  ["ИИ-наставник", "станет недоступен", false],
];

export default function Tarify() {
  const { plan } = useAccess();
  const people = usePeople();
  const { list } = useConversations();
  const limits = PLAN_LIMITS[plan];
  const isPhone = useIsPhone();
  /* Какой тариф человек сейчас рассматривает. Это не то же самое, что
     текущий тариф: выбор карточки — намерение, оплата — действие. */
  const [selected, setSelected] = useState(plan);

  const askedToday = messagesToday(list, toISODate(new Date()));
  const nextPlan = PLAN_ORDER[Math.min(PLAN_ORDER.indexOf(plan) + 1, PLAN_ORDER.length - 1)];
  const canUpgrade = nextPlan !== plan;

  return (
    <div style={S.cabinet}>
      <div style={S.head}>
        <div>
          <div style={S.eyebrow}>Тарифы и оплата</div>
          <h1 style={S.cabH1}>Ваш тариф</h1>
        </div>
      </div>

      <div className="card" style={S.planNow}>
        <div style={{ flex: "1 1 240px" }}>
          <div style={S.planBadge}>ТЕКУЩИЙ</div>
          <div style={S.planNowName}>{limits.label}</div>
          <div style={S.planNowPrice}>{PRICES[plan]}</div>
          <div style={S.dimSm}>
            {plan === "free"
              ? "Бесплатный доступ, списаний нет"
              : "Следующее списание — 24 сентября 2026"}
          </div>
        </div>

        <div style={{ flex: "2 1 360px", display: "grid", gap: 14 }}>
          <Meter label="Матрицы судьбы" now={people.length} max={limits.matrices} wide />
          <Meter label="Прогнозов в Telegram" now={telegramUsed(people)} max={limits.telegram} wide />
          <Meter label="Сообщений наставнику сегодня" now={askedToday} max={limits.messages} wide />
        </div>

        <div style={{ ...S.planBtns, ...(isPhone ? { marginLeft: 0, width: "100%" } : null) }}>
          {canUpgrade && (
            <button className="btnGold" style={{ ...S.btn, background: C.gold, color: C.ink }}
              onClick={() => setPlan(nextPlan)}>
              Перейти на «{PLAN_LIMITS[nextPlan].label}»
            </button>
          )}
          {plan !== "free" && (
            <button className="btnGhost" style={S.btnSm} onClick={() => setPlan("free")}>
              Отменить подписку
            </button>
          )}
        </div>
      </div>

      <div className="card" style={{ ...S.block, marginTop: 16, borderColor: C.borderHi }}>
        <div style={S.blockTitle}>Что будет при отмене</div>
        <div style={S.keepList}>
          {KEEP.map(([what, result, keeps]) => (
            <div key={what} style={S.keepRow}>
              <span style={{ ...S.dot, background: keeps ? C.ok : C.pink }} />
              <span style={{ color: C.white }}>{what}</span>
              <span style={S.dimSm}>— {result}</span>
            </div>
          ))}
        </div>
        <p style={S.hint}>
          При понижении тарифа матрицы не удаляются. Открытыми остаются столько,
          сколько положено новому тарифу, а какие именно — выбираете вы
          в разделе «Мои матрицы».
        </p>
      </div>

      <div className="card" style={{ ...S.block, marginTop: 16 }}>
        <div style={S.blockTitle}>Все тарифы</div>
        <div style={S.half}>
          {PLAN_ORDER.map((id) => {
            const item = PLAN_LIMITS[id];
            const current = id === plan;
            const chosen = id === selected;
            /* На телефоне подъём и приглушение убраны: на маленьком экране
               это мешает читать, а наведения там всё равно нет. */
            const dimmed = !isPhone && !chosen;

            return (
              <div key={id} className={isPhone ? "planCard" : "planCard planCardLift"}
                role="button" tabIndex={0}
                aria-pressed={chosen}
                onClick={() => setSelected(id)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelected(id); } }}
                style={{
                  ...S.block,
                  padding: "16px 18px",
                  borderColor: chosen ? C.lilac : C.border,
                  background: chosen ? "rgba(31,24,65,0.9)" : "rgba(10,8,23,0.4)",
                  boxShadow: chosen ? `0 20px 54px -26px ${C.lilac}` : "none",
                  transform: chosen && !isPhone ? "scale(1.025)" : "none",
                  opacity: dimmed ? 0.62 : 1,
                }}>
                <div style={{ color: C.white, fontSize: 15, marginBottom: 4 }}>
                  {item.label}
                  {current && <span style={{ ...S.dimSm, color: C.gold, marginLeft: 8 }}>текущий</span>}
                </div>
                <div style={{ color: C.gold, fontSize: 14, marginBottom: 10 }}>{PRICES[id]}</div>
                <div style={S.dimSm}>
                  Матриц: {Number.isFinite(item.matrices) ? item.matrices : "без счёта"}<br />
                  Наставник: {item.messages ? (Number.isFinite(item.messages) ? `${item.messages} в день` : "без ограничений") : "—"}<br />
                  Telegram: {item.telegram || "—"}
                </div>
                <button className={`planBtn ${current ? "btnGhost" : chosen ? "btnGold" : "btnOutline"}`}
                  disabled={current}
                  style={{
                    ...S.btnSm, width: "100%", marginTop: 12,
                    border: current || chosen ? "none" : `1px solid ${C.border}`,
                    background: chosen && !current ? C.gold : "transparent",
                    color: current ? C.muted : chosen ? C.ink : C.white,
                    fontWeight: chosen ? 600 : 500,
                    boxShadow: chosen && !current ? `0 12px 30px -14px ${C.gold}` : "none",
                  }}
                  onClick={(e) => { e.stopPropagation(); setPlan(id); }}>
                  {current ? "Текущий" : chosen ? "Перейти на этот тариф" : "Выбрать"}
                </button>
              </div>
            );
          })}
        </div>
        <p style={S.hint}>
          Здесь кнопки переключают тариф сразу — это заглушка вместо оплаты.
          Настоящий платёж подключается отдельно.
        </p>
      </div>

      <div className="card" style={{ ...S.block, marginTop: 16 }}>
        <div style={S.blockTitle}>История платежей</div>
        {/* На телефоне строка таблицы не помещается и рвётся на четыре
            уровня — вместо неё карточка на каждый платёж. */}
        {HISTORY.map((row) => (isPhone ? (
          <div key={row.date} style={S.histCard}>
            <div style={{ color: C.white }}>{row.subject}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span style={{ color: C.gold, fontWeight: 600, fontSize: 16 }}>{row.sum}</span>
              <span style={{ color: C.ok, fontSize: 12.5 }}>оплачено</span>
              <span style={{ ...S.dimSm, marginLeft: "auto" }}>{row.date}</span>
            </div>
            <button className="link" style={{ ...S.linkBtn, alignSelf: "flex-start", minHeight: TAP }}>чек</button>
          </div>
        ) : (
          <div key={row.date} style={S.histRow}>
            <span style={{ color: C.muted, minWidth: 150 }}>{row.date}</span>
            <span style={{ flex: 1, color: C.white, minWidth: 180 }}>{row.subject}</span>
            <span style={{ color: C.ok, fontSize: 12.5 }}>оплачено</span>
            <span style={{ color: C.gold, fontWeight: 600 }}>{row.sum}</span>
            <button className="link" style={S.linkBtn}>чек</button>
          </div>
        )))}
      </div>
    </div>
  );
}
