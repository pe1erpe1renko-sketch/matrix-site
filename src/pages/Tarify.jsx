import React, { useState } from "react";
import { Link } from "react-router-dom";
import { C, SURFACE } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import {
  PLAN_LIMITS, PLAN_PRICE, PLAN_COPY, SUBSCRIPTION_PLANS, money,
  BOLT_SPEND, BOLT_FREE, BOLT_PACKS, COMPARE_COLUMNS, COMPARE_ROWS, PRICING_FAQ,
} from "../lib/plans.js";
import { PlanCard } from "../components/PlanCard.jsx";
import { Bolt } from "../components/Icons.jsx";
import { useAccess } from "../lib/access.js";
import { useBackPoint } from "../lib/returnTo.js";
import { useBolts } from "../lib/bolts.js";
import { usePeople, telegramUsed } from "../lib/people.js";
import { Meter } from "../components/Controls.jsx";
import BackToReport from "../components/BackToReport.jsx";
import { useIsPhone, TAP } from "../theme/responsive.js";

/**
 * ТАРИФЫ И ОПЛАТА — /tarify
 * =========================
 * Витрина и кабинет на одной странице: сверху текущий тариф со счётчиками,
 * ниже — за что вообще платят.
 *
 * ГЛАВНОЕ СООБЩЕНИЕ: платят за ДАТУ, а не за тип разбора. Одна оплаченная
 * дата открывается целиком. Это стоит в заголовке и повторяется в вопросах:
 * человек, который думает, что типы продаются по отдельности, не купит
 * ни одного.
 *
 * ПРО МОЛНИИ НАПИСАНО ПРЯМО. Молнии тратятся только на нейросеть; читать
 * свои разборы за них не нужно никогда. Без этой строки человек боится
 * нажимать кнопки, и тариф не спасает.
 *
 * Все числа приходят из lib/plans.js. Карточки рисует общий PlanCard —
 * тот же, что на главной.
 */

/* История платежей — пример разметки. Придёт с бэкенда вместе с чеками. */
const HISTORY = [
  { date: "24 августа 2026", subject: "Круг — продление", sum: "990 ₽" },
  { date: "24 июля 2026", subject: "Круг — продление", sum: "990 ₽" },
  { date: "24 июня 2026", subject: "Переход с «Пути»", sum: "990 ₽" },
  { date: "24 мая 2026", subject: "Путь — продление", sum: "590 ₽" },
];

const KEEP = [
  ["Открытые разборы", "остаются навсегда", true],
  ["Архив прогнозов", "остаётся навсегда", true],
  ["Неизрасходованные молнии", "живут ещё 30 дней", true],
  ["Даты сверх нового лимита", "останутся видны, но закроются", false],
  ["Аркан дня в Telegram", "перестанет приходить", false],
];

export default function Tarify() {
  const { plan } = useAccess();
  const { balance } = useBolts();
  const people = usePeople();
  const limits = PLAN_LIMITS[plan];
  const isPhone = useIsPhone();

  /* Витрина открывается на подписках: это основное предложение.
     Разовый разбор рядом, одним нажатием. */
  const [mode, setMode] = useState("sub");
  /* Какой тариф человек рассматривает: выбор карточки — намерение,
     оплата — действие. */
  const [selected, setSelected] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);
  /* Пришёл из разбора — обратная дорога едет дальше, в оформление:
     там она вторая ссылка «К разбору». */
  const back = useBackPoint();
  const carry = back ? { back } : undefined;

  return (
    <div style={S.cabinet}>
      <BackToReport />

      {/* ───── текущий тариф ───── */}
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
          <div style={S.planNowPrice}>{PLAN_PRICE[plan].short}</div>
          <div style={S.dimSm}>
            {limits.kind === "sub"
              ? "Следующее списание — 24 сентября 2026"
              : "Списаний нет"}
          </div>
        </div>

        <div style={{ flex: "2 1 360px", display: "grid", gap: 14 }}>
          <Meter label="Разборы" now={people.length} max={limits.reports} wide />
          <Meter label="Прогнозов в Telegram" now={telegramUsed(people)} max={limits.telegram} wide />
          <div>
            <div style={S.meterTop}>
              <span style={S.dimSm}>Молнии</span>
              <span style={{ color: C.gold, fontSize: 13, fontWeight: 600 }}>
                <Bolt size={12} /> {balance}
              </span>
            </div>
            <p style={{ ...S.dimSm, marginTop: 4 }}>
              Тариф даёт {limits.bolts || 0}
              {limits.kind === "sub" ? " в месяц" : " разово"}
            </p>
          </div>
        </div>
      </div>

      {/* ───── витрина ───── */}
      <section style={{ ...S.section, paddingLeft: 0, paddingRight: 0, paddingTop: 52 }}>
        <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto" }}>
          <div style={S.eyebrow}>Тарифы</div>
          <h2 style={S.h2}>Платите за дату, <em style={S.h1em}>а не за разделы</em></h2>
          <p style={{ ...S.infoText, margin: "-8px auto 0" }}>
            Одна оплаченная дата рождения открывается целиком — все двенадцать сфер,
            все девяносто два вопроса и все десять типов разбора по ней.
          </p>

          <div style={{ ...S.modeToggle, marginTop: 24 }}>
            {[["once", "Разово"], ["sub", "Подписка"]].map(([id, label]) => {
              const on = mode === id;
              return (
                <button key={id} style={{
                  ...S.modeBtn, minHeight: isPhone ? TAP : 0,
                  background: on ? C.gold : "transparent",
                  color: on ? C.ink : C.text,
                  fontWeight: on ? 600 : 400,
                }} onClick={() => setMode(id)}>{label}</button>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: 28 }}>
          {mode === "once" ? <OnceBlock carry={carry} /> : (
            <>
              <div style={S.plans}>
                {SUBSCRIPTION_PLANS.map((id) => (
                  <PlanCard key={id} id={id} layout="full"
                    chosen={selected === id} dimmed={selected !== null && selected !== id}
                    onSelect={setSelected}
                    cta={{
                      label: id === plan ? "Ваш тариф" : selected === id ? "Оформить" : "Выбрать",
                      to: `/checkout?plan=${id}`,
                      state: carry,
                      disabled: id === plan,
                      variant: PLAN_COPY[id].featured ? "lilac" : "outline",
                    }} />
                ))}
              </div>
              <ForeverBlock carry={carry} />
            </>
          )}
        </div>
      </section>

      {/* ───── молнии ───── */}
      <section style={{ ...S.section, paddingLeft: 0, paddingRight: 0 }}>
        <div style={S.eyebrow}>Молнии</div>
        <h2 style={S.h2}>Что это и зачем</h2>
        <p style={{ ...S.infoText, maxWidth: 700, margin: "-8px 0 8px" }}>
          Молнии нужны только там, где отвечает нейросеть, и только чтобы
          не упираться в лимит.
        </p>
        <p style={{ ...S.infoText, maxWidth: 700, margin: "0 0 24px", color: C.ok }}>
          За молнии никогда не берут: {BOLT_FREE.join(", ")}.
        </p>

        <div style={S.boltRow}>
          {BOLT_SPEND.map((s) => (
            <div key={s.what} className="card" style={S.boltCard}>
              <div style={S.boltN}><Bolt size={17} /> {s.n}</div>
              <div style={{ fontSize: 14 }}>{s.what}</div>
            </div>
          ))}
        </div>

        <div style={S.packs}>
          {BOLT_PACKS.map((p) => (
            <div key={p.id} className="card" style={{
              ...S.pack,
              borderColor: p.best ? C.gold : C.border,
              background: p.best ? "rgba(228,190,114,0.07)" : SURFACE.card,
            }}>
              {p.best && <span style={S.packBadge}>ВЫГОДНЕЕ</span>}
              <div style={S.packN}><Bolt size={17} /> {p.n}</div>
              <div style={{ fontSize: 17, color: C.gold, fontWeight: 600 }}>{money(p.price)} ₽</div>
              <div style={{ ...S.dimSm, marginBottom: 12 }}>{p.per}</div>
              <Link to={`/checkout?product=bolts&pack=${p.id}`} state={carry} className="btnOutline"
                style={{ ...S.btnSm, border: `1px solid ${C.border}`, color: C.white, minHeight: TAP,
                  display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                Купить
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ───── сравнение ───── */}
      <section style={{ ...S.section, paddingLeft: 0, paddingRight: 0 }}>
        <div style={S.eyebrow}>Сравнение</div>
        <h2 style={S.h2}>Что входит в каждый тариф</h2>
        <div className="hScroll" style={S.cmpWrap}>
          <div style={{ ...S.cmpRow, ...S.cmpHead }}>
            <span />
            {COMPARE_COLUMNS.map((id) => (
              <span key={id} style={{
                ...S.cmpHeadCell,
                color: PLAN_COPY[id] && PLAN_COPY[id].featured ? C.gold : C.text,
              }}>{id === "once" ? "Разово" : PLAN_LIMITS[id].label}</span>
            ))}
          </div>
          {COMPARE_ROWS.map((row) => (
            <div key={row[0]} className="cmpRow" style={S.cmpRow}>
              <span style={S.cmpName}>{row[0]}</span>
              {row.slice(1).map((value, i) => (
                <span key={COMPARE_COLUMNS[i]} style={{
                  ...S.cmpCell,
                  color: value === "—" ? C.muted : value === "✓" ? C.ok : C.white,
                  fontWeight: COMPARE_COLUMNS[i] === "circle" ? 600 : 400,
                }}>{value}</span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ───── вопросы ───── */}
      <section style={{ ...S.section, paddingLeft: 0, paddingRight: 0 }}>
        <div style={S.eyebrow}>Вопросы</div>
        <h2 style={S.h2}>Что обычно спрашивают</h2>
        <div style={S.faqWrap}>
          {PRICING_FAQ.map((f, i) => {
            const on = openFaq === i;
            return (
              <div key={f.q} className="card" style={{
                ...S.faqItem,
                borderColor: on ? C.borderHi : C.border,
                background: on ? SURFACE.cardHi : SURFACE.card,
              }}>
                <button style={{ ...S.faqQ, minHeight: TAP }} onClick={() => setOpenFaq(on ? -1 : i)}
                  aria-expanded={on}>
                  <span>{f.q}</span>
                  <span style={{ ...S.faqPlus, transform: on ? "rotate(45deg)" : "none", color: on ? C.gold : C.muted }}>+</span>
                </button>
                {on && <p style={S.faqA}>{f.a}</p>}
              </div>
            );
          })}
        </div>
      </section>

      {/* ───── что будет при отмене ───── */}
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
          Отменить подписку можно одной кнопкой в кабинете, без звонков и писем.
          Открытые разборы и архив прогнозов остаются у вас навсегда.
        </p>
      </div>

      {/* ───── история платежей ───── */}
      <div className="card" style={{ ...S.block, marginTop: 16 }}>
        <div style={S.blockTitle}>История платежей</div>
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

/* ---------------- Разовый разбор ---------------- */

function OnceBlock({ carry }) {
  const copy = PLAN_COPY.once;
  const price = PLAN_PRICE.once;

  return (
    <div className="card" style={S.onceWide}>
      <div style={{ flex: "1 1 320px", minWidth: 0 }}>
        <div style={S.themeTag}>{copy.theme}</div>
        <div style={S.planName}>{PLAN_LIMITS.once.label}</div>
        <div style={S.priceRow}>
          <span style={S.price}>{money(price.amount)}</span>
          <span style={S.priceUnit}>{price.unit}</span>
        </div>
        <div style={S.priceHint}>{price.hint}</div>
        <p style={S.planLead}>{copy.lead}</p>
        <Link to="/checkout?product=matrix" state={carry} className="btnGold"
          style={{ ...S.ctaSmall, background: C.gold, color: C.ink, display: "inline-flex",
            alignItems: "center", justifyContent: "center", minHeight: TAP }}>
          Купить за {money(price.amount)} ₽
        </Link>
      </div>

      <div style={{ flex: "1 1 320px", minWidth: 0 }}>
        {copy.marks.map(([text, on, hint]) => (
          <div key={text} style={S.onceMark}>
            <span style={{ ...S.markSign, color: on ? C.ok : C.muted }}>{on ? "✓" : "—"}</span>
            <span style={{ color: on ? C.text : C.muted }}>
              {text}
              {hint && <span style={{ ...S.dimSm, marginLeft: 6 }}>· {hint}</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Навсегда ---------------- */

function ForeverBlock({ carry }) {
  const copy = PLAN_COPY.forever;
  const price = PLAN_PRICE.forever;

  return (
    <div className="card" style={S.foreverWide}>
      <div style={{ flex: "1 1 300px", minWidth: 0 }}>
        <div style={{ ...S.themeTag, color: C.gold }}>{copy.theme}</div>
        <div style={S.planName}>{PLAN_LIMITS.forever.label}</div>
        <div style={S.priceRow}>
          <span style={S.price}>{money(price.amount)}</span>
          <span style={S.priceUnit}>{price.unit}</span>
        </div>
        <p style={S.planLead}>{copy.lead}</p>
      </div>

      <div style={{ flex: "1 1 260px", minWidth: 0 }}>
        {copy.items.map((x) => (
          <div key={x} style={S.li}><span style={S.uMark}>—</span><span>{x}</span></div>
        ))}
      </div>

      <Link to="/checkout?plan=forever" state={carry} className="btnGold"
        style={{ ...S.ctaSmall, background: C.gold, color: C.ink, alignSelf: "center",
          display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: TAP }}>
        Купить навсегда
      </Link>
    </div>
  );
}
