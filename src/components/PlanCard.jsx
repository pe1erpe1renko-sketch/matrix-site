import React, { createContext, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { C, SURFACE } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { PLAN_LIMITS, PLAN_PRICE, PLAN_COPY } from "../lib/plans.js";
import { useIsPhone, useReducedMotion, TAP } from "../theme/responsive.js";

/**
 * КАРТОЧКА ТАРИФА — одна на весь сайт
 * ===================================
 * Тарифы показываются в двух витринах: на главной (layout="full" и широкий
 * блок layout="wide") и в кабинете на /tarify (layout="compact").
 * Раньше это были две копии разной разметки, и правка в одной не доезжала
 * до другой. Теперь и вид, и поведение живут здесь.
 *
 * ПОЧЕМУ НАВЕДЕНИЕ СЧИТАЕТСЯ В JS, А НЕ В :hover
 * CLAUDE.md, раздел 8: активные состояния задаются встроенным стилем.
 * Встроенный стиль перебивает таблицу, поэтому правило .planCard:hover
 * с рамкой, тенью и подъёмом просто не сработало бы — их всё равно
 * перезаписывает inline. Состояние наведения держим состоянием React
 * и складываем с состоянием выбора в одном месте.
 *
 * НА ТЕЛЕФОНЕ подъём и приглушение выключены: наведения там нет,
 * а приглушённые соседние карточки только мешают читать.
 * Остаётся одна подсветка выбранной.
 */

const CardState = createContext({ chosen: false, lit: false, phone: false });

const TRANSITION =
  "transform .22s cubic-bezier(.4,0,.2,1), box-shadow .22s ease," +
  " border-color .18s ease, opacity .18s ease, background .18s ease, color .18s ease";

/** Фон выбранной карточки — один для всех витрин. */
const CHOSEN_BG = "rgba(31,24,65,0.92)";

export function PlanCard({
  id,
  layout = "full",
  chosen = false,
  dimmed = false,
  onSelect,
  accent = C.lilac,
  current = false,
  cta,
  detailsTo,
  detailsLabel = "Что входит полностью",
}) {
  const phone = useIsPhone();
  const calm = useReducedMotion();
  const [hover, setHover] = useState(false);

  /* Подсветка наведением — только там, где есть курсор. Фокус с клавиатуры
     считается тем же событием: иначе выбор с клавиатуры был бы невидим. */
  const lit = hover && !phone;
  /* Выбранная карточка не приглушается никогда — что бы ни передали сверху. */
  const quiet = dimmed && !chosen && !phone && !hover;

  const base = baseStyle(layout, PLAN_COPY[id]?.featured);
  const move = [];
  if (lit && !calm) move.push("translateY(-4px)");
  if (chosen && !phone && !calm) move.push("scale(1.025)");

  const select = () => onSelect && onSelect(id);

  return (
    <div
      className="planCard"
      role="button"
      tabIndex={0}
      aria-pressed={chosen}
      onClick={select}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(); }
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setHover(false); }}
      style={{
        ...base,
        borderColor: chosen ? accent : lit ? C.borderHi : base.borderColor || C.border,
        background: chosen ? CHOSEN_BG : base.background,
        boxShadow: chosen
          ? `0 24px 60px -26px ${accent}`
          : lit ? `0 22px 48px -28px ${accent}` : base.boxShadow || "none",
        transform: move.length ? move.join(" ") : "none",
        opacity: quiet ? 0.62 : 1,
        transition: calm ? "none" : TRANSITION,
        cursor: "pointer",
      }}
    >
      <CardState.Provider value={{ chosen, lit, phone }}>
        {layout === "wide"
          ? <WideBody id={id} cta={cta} detailsTo={detailsTo} detailsLabel={detailsLabel} />
          : layout === "compact"
            ? <CompactBody id={id} current={current} cta={cta} />
            : <FullBody id={id} cta={cta} detailsTo={detailsTo} detailsLabel={detailsLabel} />}
      </CardState.Provider>
    </div>
  );
}

/** Опора карточки до наведения и выбора — своя у каждой витрины. */
function baseStyle(layout, featured) {
  if (layout === "wide") return { ...S.onceRow };
  if (layout === "compact") {
    return { ...S.block, padding: "16px 18px", background: "rgba(10,8,23,0.4)", borderColor: C.border };
  }
  return {
    ...S.plan,
    borderColor: featured ? C.lilac : C.border,
    background: featured ? SURFACE.cardHi : SURFACE.card,
    boxShadow: featured ? `0 26px 70px -34px ${C.lilac}` : "none",
  };
}

/* ---------- три вида содержимого ---------- */

/** Главная, карточка подписки. */
function FullBody({ id, cta, detailsTo, detailsLabel }) {
  const copy = PLAN_COPY[id] || {};
  const price = PLAN_PRICE[id];
  return (
    <>
      <div style={S.badgeSlot}>
        {copy.badge && (
          <span style={{
            ...S.badge,
            background: copy.badgeSolid ? C.lilacBtn : "transparent",
            color: copy.badgeSolid ? C.ink : C.lilac, borderColor: C.lilac,
          }}>{copy.badge}</span>
        )}
      </div>
      <div style={S.planName}>{PLAN_LIMITS[id].label}</div>
      <div style={S.priceRow}>
        <span style={S.price}>{price.amount}</span><span style={S.priceUnit}>{price.unit}</span>
      </div>
      <p style={S.planLead}>{copy.lead}</p>
      <div style={{ flex: 1 }}>
        {(copy.items || []).map((x) => (
          <div key={x} style={S.li}><span style={S.uMark}>—</span><span>{x}</span></div>
        ))}
      </div>
      {detailsTo && <CardLink to={detailsTo} style={{ marginTop: 18 }}>{detailsLabel}</CardLink>}
      <PlanCta {...cta} style={{ width: "100%", marginTop: 12 }} />
    </>
  );
}

/** Главная, широкий блок разового разбора. */
function WideBody({ id, cta, detailsTo, detailsLabel }) {
  const { phone } = useContext(CardState);
  const copy = PLAN_COPY[id] || {};
  const price = PLAN_PRICE[id];
  return (
    <>
      <div style={{ flex: "1 1 280px" }}>
        <div style={S.planName}>{PLAN_LIMITS[id].label}</div>
        <div style={S.priceRow}>
          <span style={S.price}>{price.amount}</span><span style={S.priceUnit}>{price.unit}</span>
        </div>
        {price.hint && <div style={S.priceHint}>{price.hint}</div>}
        <p style={S.planLead}>{copy.lead}</p>
      </div>
      <div style={{ flex: "1 1 360px" }}>
        <div style={S.infoLabel}>Что откроется</div>
        {/* На телефоне две колонки рвут короткие строки на три уровня. */}
        <div style={{ ...S.onceList, ...(phone ? { gridTemplateColumns: "1fr" } : null) }}>
          {(copy.items || []).map((x) => (
            <div key={x} style={S.li}><span style={S.uMark}>—</span><span>{x}</span></div>
          ))}
        </div>
      </div>
      <div style={{ ...S.onceCtaWrap, ...(phone ? { width: "100%", alignItems: "stretch" } : null) }}>
        {detailsTo && <CardLink to={detailsTo}>{detailsLabel}</CardLink>}
        <PlanCta {...cta} />
      </div>
    </>
  );
}

/** Кабинет, список всех тарифов. */
function CompactBody({ id, current, cta }) {
  const limits = PLAN_LIMITS[id];
  return (
    <>
      <div style={{ color: C.white, fontSize: 15, marginBottom: 4 }}>
        {limits.label}
        {current && <span style={{ ...S.dimSm, color: C.gold, marginLeft: 8 }}>текущий</span>}
      </div>
      <div style={{ color: C.gold, fontSize: 14, marginBottom: 10 }}>{PLAN_PRICE[id].short}</div>
      <div style={S.dimSm}>
        Матриц: {Number.isFinite(limits.matrices) ? limits.matrices : "без счёта"}<br />
        Наставник: {limits.messages
          ? (Number.isFinite(limits.messages) ? `${limits.messages} в день` : "без ограничений")
          : "—"}<br />
        Telegram: {limits.telegram || "—"}
      </div>
      <PlanCta {...cta} style={{ width: "100%", marginTop: 12 }} />
    </>
  );
}

/* ---------- кнопка и ссылка внутри карточки ---------- */

/**
 * Кнопка карточки. Ярче, когда карточка выбрана, и ещё чуть ярче
 * при наведении на карточку целиком — нажимать можно куда угодно,
 * но кнопка должна показывать, что она главное действие.
 *
 * Сжатие при нажатии оставлено классу .planBtn: transform здесь
 * встроенным стилем не задаётся, иначе :active было бы перебито.
 */
export function PlanCta({ label, to, onClick, disabled = false, variant = "outline", style }) {
  const { chosen, lit } = useContext(CardState);

  const filled =
    disabled ? null
      : chosen || variant === "gold" ? { bg: lit ? C.goldHi : C.gold, glow: C.gold, ink: C.ink }
        : variant === "lilac" ? { bg: lit ? C.lilac : C.lilacBtn, glow: C.lilac, ink: C.ink }
          : null;

  const look = {
    ...S.ctaSmall,
    ...style,
    minHeight: TAP,
    cursor: disabled ? "default" : "pointer",
    transition: "background .18s ease, box-shadow .18s ease, border-color .18s ease, color .18s ease",
    border: filled || disabled ? "none" : `1px solid ${lit ? C.lilac : C.border}`,
    background: filled ? filled.bg : "transparent",
    color: disabled ? C.muted : filled ? filled.ink : C.white,
    fontWeight: filled ? 600 : 500,
    boxShadow: filled ? `0 ${lit ? 18 : 12}px ${lit ? 40 : 30}px -14px ${filled.glow}` : "none",
    textAlign: "center",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
  };

  /* Ссылка на главной, кнопка в кабинете — разметка одна. */
  if (to && !disabled) {
    return <Link to={to} className="planBtn" style={look} onClick={(e) => e.stopPropagation()}>{label}</Link>;
  }
  return (
    <button className="planBtn" type="button" disabled={disabled} style={look}
      onClick={(e) => { e.stopPropagation(); if (onClick) onClick(); }}>
      {label}
    </button>
  );
}

/** Второстепенная ссылка карточки: «Что входит полностью». */
function CardLink({ to, style, children }) {
  const { lit } = useContext(CardState);
  return (
    <Link to={to} className="link" style={{ ...S.link, ...style, color: lit ? C.goldHi : C.lilac }}
      onClick={(e) => e.stopPropagation()}>{children}</Link>
  );
}
