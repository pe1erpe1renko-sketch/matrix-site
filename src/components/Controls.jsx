import React, { useState } from "react";
import { C, FONT } from "../theme/tokens.js";
import { S } from "../theme/styles.js";

/**
 * МЕЛКИЕ ЭЛЕМЕНТЫ КАБИНЕТА
 * =======================
 * Полоса лимита, переключатель, кнопка копирования, мини-октаграмма,
 * строка данных. Собраны вместе, потому что поодиночке это по десять
 * строк, а используются они во всех трёх вкладках сразу.
 */

/**
 * Полоса лимита. Максимум ВСЕГДА приходит из PLAN_LIMITS — чисел,
 * зашитых в разметку, здесь быть не должно.
 * При достижении лимита полоса краснеет.
 */
export function Meter({ label, now, max, wide }) {
  const infinite = !Number.isFinite(max);
  const pct = infinite ? 8 : Math.min(100, max === 0 ? 100 : (now / max) * 100);
  const full = !infinite && now >= max;

  return (
    <div style={{ minWidth: wide ? 0 : 170 }}>
      <div style={S.meterTop}>
        <span style={S.dimSm}>{label}</span>
        <span style={{ color: full ? C.pink : C.white, fontSize: 13, fontWeight: 600 }}>
          {now} из {infinite ? "∞" : max}
        </span>
      </div>
      <div style={S.track}>
        <div style={{ ...S.fill, width: pct + "%", background: full ? C.pink : C.gold }} />
      </div>
    </div>
  );
}

export function Switch({ on, onClick, label }) {
  return (
    <button onClick={onClick} aria-pressed={on} aria-label={label} style={{
      ...S.switchTrack,
      background: on ? C.lilacBtn : "rgba(10,8,23,0.7)",
      borderColor: on ? C.lilacBtn : C.border,
    }}>
      <span style={{ ...S.switchKnob, left: on ? 20 : 3, background: on ? C.ink : C.muted }} />
    </button>
  );
}

/**
 * Копирование в буфер. При отказе браузера текст всё равно можно выделить мышью.
 *
 * tipAlign — куда смотрит подпись под кнопкой. По умолчанию по центру;
 * "right" нужен там, где кнопка стоит у самого края узкой панели:
 * подпись шире кнопки и центром вылезала бы за край экрана.
 */
export function CopyButton({ value, small = true, tipAlign = "center" }) {
  const [done, setDone] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* браузер не дал доступ к буферу — текст выделяется вручную */
    }
    setDone(true);
    setTimeout(() => setDone(false), 1600);
  };

  return (
    <button className="iconCopy" style={small ? S.iconCopy : S.iconBtn}
      onClick={copy} aria-label="Копировать">
      {done ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M5 12.5 L10 17.5 L19 7" stroke={C.ok} strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="8.5" y="8.5" width="11.5" height="11.5" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M15.5 5.6A2 2 0 0 0 13.6 4H6a2 2 0 0 0-2 2v7.6a2 2 0 0 0 1.6 1.9"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
      <span className="tip" style={{
        ...S.tip,
        ...(tipAlign === "right"
          ? { left: "auto", right: 0, transform: "none" }
          : { left: "50%", right: "auto", transform: "translateX(-50%)" }),
      }}>
        {done ? "Скопировано" : "Копировать"}
      </span>
    </button>
  );
}

/** Схема матрицы в миниатюре: восемь точек и центральный аркан. */
export function MiniOcta({ core }) {
  const points = Array.from({ length: 8 }, (_, i) => {
    const a = (Math.PI / 4) * i - Math.PI / 2;
    return [46 + 34 * Math.cos(a), 46 + 34 * Math.sin(a)];
  });

  return (
    <svg viewBox="0 0 92 92" style={{ width: 76, height: 76, flexShrink: 0 }} aria-hidden="true">
      <polygon points={points.map((p) => p.join(",")).join(" ")} fill="none" stroke={C.border} />
      {points.map(([x, y], i) => (
        <g key={i}>
          <line x1={x} y1={y} x2="46" y2="46" stroke={C.border} strokeWidth="0.5" />
          <circle cx={x} cy={y} r="4.5" fill={C.bg} stroke={i % 2 ? C.borderHi : C.gold} strokeWidth="1" />
        </g>
      ))}
      <circle cx="46" cy="46" r="13" fill={C.cardHi} stroke={C.lilac} strokeWidth="1.2" />
      <text x="46" y="46" textAnchor="middle" dominantBaseline="central"
        fill={C.white} fontSize="14" fontFamily={FONT.serif}>{core.C}</text>
    </svg>
  );
}

/** Строка «название — значение — действие» в блоке учётных данных. */
export function Field({ label, value, action, onAction }) {
  return (
    <div style={S.field}>
      <span style={{ ...S.dimSm, minWidth: 76 }}>{label}</span>
      <span style={{ color: C.white, flex: 1, minWidth: 0, wordBreak: "break-word" }}>{value}</span>
      {action && <button className="link" style={S.linkBtn} onClick={onAction}>{action}</button>}
    </div>
  );
}

/** Обёртка модального окна: затемнение, закрытие по фону и по крестику. */
export function Modal({ title, lead, onClose, children, width }) {
  return (
    <div style={S.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className="card" style={{ ...S.modal, ...(width ? { width } : null) }}
        onClick={(e) => e.stopPropagation()}>
        <div style={S.modalHead}>
          <div>
            <div style={{ ...S.blockTitle, marginBottom: lead ? 8 : 0 }}>{title}</div>
            {lead}
          </div>
          <button className="btnGhost" style={S.closeBtn} onClick={onClose} aria-label="Закрыть">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Чекбокс с текстом. Используется в согласиях при регистрации. */
export function CheckRow({ checked, onToggle, children }) {
  return (
    <button type="button" style={S.checkRow} onClick={onToggle} aria-pressed={checked}>
      <span style={{
        ...S.checkBox,
        borderColor: checked ? C.lilacBtn : C.border,
        background: checked ? C.lilacBtn : "transparent",
      }}>
        {checked && (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <path d="M5 12.5 L10 17.5 L19 7" stroke={C.ink} strokeWidth="3"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span>{children}</span>
    </button>
  );
}
