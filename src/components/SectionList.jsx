import React, { useState } from "react";
import { Link } from "react-router-dom";
import { C, SURFACE } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { ARCANA_NAMES } from "../lib/prompts.js";
import { useSlotText } from "./useSlotText.js";

/**
 * РАЗДЕЛЫ РАЗБОРА
 * ===============
 * Все 25 разделов из карты позиций. Что открыто, а что под замком,
 * решает не этот компонент: признак locked приходит готовым из
 * buildSectionData(matrix, { unlocked }).
 *
 * Тексты грузятся по одному разделу за раз, в момент открытия. Грузить
 * все 51 позицию сразу незачем: человек читает по одному разделу,
 * а в рабочем режиме каждый незнакомый текст — это запрос к нейросети.
 *
 * Закрытый раздел текст НЕ запрашивает вообще. Иначе оплаченный контент
 * приезжал бы в браузер к неоплатившему и лежал бы в разметке.
 */
export default function SectionList({ sections, openId, onToggle }) {
  return (
    <div style={S.sectionsWrap}>
      {sections.map((section, index) => (
        <SectionItem
          key={section.id}
          section={section}
          number={index + 1}
          open={openId === section.id}
          onToggle={() => onToggle(section.id)}
        />
      ))}
    </div>
  );
}

function SectionItem({ section, number, open, onToggle }) {
  const { locked } = section;

  return (
    <div id={`section-${section.id}`} className="card" style={{
      ...S.sectionItem,
      borderColor: open ? C.borderHi : C.border,
      background: open ? SURFACE.cardHi : SURFACE.card,
      opacity: locked ? 0.82 : 1,
    }}>
      <button style={S.sectionHead} onClick={onToggle}
        aria-expanded={open} aria-controls={`body-${section.id}`}>
        <span style={{ ...S.sectionNum, color: locked ? C.muted : C.gold }}>
          {String(number).padStart(2, "0")}
        </span>
        <span>
          <span style={{ ...S.sectionTitle, color: locked ? C.text : C.white }}>
            {section.title}
          </span>
          <span style={S.sectionLead}>{section.lead}</span>
        </span>
        <span style={S.sectionSign}>
          {locked && <Lock />}
          <span style={{
            fontSize: 22, lineHeight: 1, color: open ? C.gold : C.muted,
            transform: open ? "rotate(45deg)" : "none", transition: "transform .2s ease",
          }}>+</span>
        </span>
      </button>

      {open && (
        locked ? <LockedBody section={section} />
        : section.note ? (
            /* Раздел уже показан в другом месте страницы — вместо повтора
               того же текста оставляем короткую отсылку. */
            <div id={`body-${section.id}`} style={S.sectionBody}>
              <p style={{ ...S.slotText, marginTop: 18 }}>{section.note}</p>
            </div>
          )
        : (
            <div id={`body-${section.id}`} style={S.sectionBody}>
              {section.slots.map((slot) => (
                <SlotText key={slot.id} slot={slot} section={section} />
              ))}
            </div>
          )
      )}
    </div>
  );
}

/** Одна позиция раздела: число, название, трактовка. */
function SlotText({ slot, section }) {
  const { loading, text } = useSlotText({
    key: slot.key,
    slotLabel: slot.label,
    arcana: slot.arcana,
    sectionTitle: section.title,
    sectionLead: section.lead,
  });

  return (
    <div style={S.slotBlock}>
      <div style={S.slotHead}>
        <span style={S.slotArcana}>{slot.arcana}</span>
        <span>
          <span style={S.slotLabel}>{slot.label}</span>{" "}
          <span style={S.slotArcName}>· {ARCANA_NAMES[slot.arcana]}</span>
        </span>
      </div>
      <p style={{ ...S.slotText, opacity: loading ? 0.45 : 1 }}>
        {loading ? "Загружаем текст…" : text}
      </p>
    </div>
  );
}

/**
 * Закрытый раздел. Числа показываем — они посчитаны и человеку принадлежат,
 * это его дата. Под замком только трактовка: за неё и берут деньги.
 */
function LockedBody({ section }) {
  return (
    <div style={S.lockNote}>
      <div style={{ flex: "1 1 300px" }}>
        <div style={{ color: C.white, fontSize: 14.5, marginBottom: 6 }}>
          {section.slots.map((slot) => `${slot.label} — аркан ${slot.arcana}`).join(" · ")}
        </div>
        <p style={{ ...S.purposeHint, maxWidth: 520 }}>
          Числа этого раздела посчитаны. Разбор откроется на любом платном тарифе —
          вместе с остальными двадцатью одним разделом и PDF.
        </p>
      </div>
      <Link to="/tarify" className="btnGold"
        style={{ ...S.ctaSmall, background: C.gold, color: C.ink, textAlign: "center" }}>
        Открыть разбор
      </Link>
    </div>
  );
}

function Lock() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-label="под замком">
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" stroke={C.muted} strokeWidth="1.6" />
      <path d="M8.5 10.5V7.8a3.5 3.5 0 0 1 7 0v2.7" stroke={C.muted} strokeWidth="1.6" />
    </svg>
  );
}
