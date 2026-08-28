import React, { useState } from "react";
import { Link } from "react-router-dom";
import { C, SURFACE } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { ARCANA_NAMES } from "../lib/prompts.js";
import { useIsPhone, TAP } from "../theme/responsive.js";
import { useSlotText } from "./useSlotText.js";

/**
 * РАЗБОР: СФЕРЫ И ВОПРОСЫ
 * =======================
 * Сфера — крупный блок, внутри неё список вопросов кнопками.
 * Нажатие раскрывает ответ именно на этот вопрос.
 *
 * ПОЧЕМУ ТАК, А НЕ СТЕНОЙ ТЕКСТА: длинную статью читают один раз
 * и закрывают. Список вопросов хочется прокликать целиком, потому что
 * каждый следующий заголовок звучит как «это про меня». Поэтому
 * заголовки вопросов крупные и читаются как вопросы, а не как рубрики.
 *
 * ДОСТУП СЧИТАЕТСЯ ПО ВОПРОСУ, а не по сфере: в платной сфере первый
 * вопрос открыт всегда, чтобы человек попробовал везде.
 *
 * Закрытый вопрос текст НЕ запрашивает вообще. Иначе оплаченный контент
 * приезжал бы в браузер неоплатившему и лежал бы в разметке.
 *
 * Открытый ответ грузится в момент раскрытия: в рабочем режиме каждый
 * незнакомый текст — это запрос к нейросети, тянуть все 92 сразу незачем.
 */
export default function SectionList({ sections }) {
  return (
    <div style={S.sectionsWrap}>
      {sections.map((section) => <Sphere key={section.id} section={section} />)}
    </div>
  );
}

function Sphere({ section }) {
  const isPhone = useIsPhone();
  /* Первый доступный вопрос раскрыт сразу: иначе сфера выглядит
     как список ссылок, и непонятно, что внутри вообще есть текст. */
  const firstOpen = section.slots.find((slot) => !slot.locked);
  const [openId, setOpenId] = useState(firstOpen ? firstOpen.id : null);

  const openCount = section.slots.filter((slot) => !slot.locked).length;

  return (
    <section id={`section-${section.id}`} className="card" style={S.sphere}>
      <div style={S.sphereHead}>
        <div style={{ minWidth: 0 }}>
          <h3 style={S.sphereTitle}>{section.title}</h3>
          <p style={S.sphereLead}>{section.lead}</p>
        </div>
        <span style={S.sphereCount}>
          {openCount} из {section.slots.length}
        </span>
      </div>

      <div style={S.qList}>
        {section.slots.map((slot) => (
          <Question
            key={slot.id}
            slot={slot}
            section={section}
            open={openId === slot.id}
            onToggle={() => setOpenId(openId === slot.id ? null : slot.id)}
            isPhone={isPhone}
          />
        ))}
      </div>
    </section>
  );
}

/**
 * Один вопрос. Открытый — кнопка, раскрывающая ответ.
 * Закрытый — ссылка на пейволл: число показываем, трактовку нет.
 */
function Question({ slot, section, open, onToggle, isPhone }) {
  if (slot.locked) {
    return (
      <Link to="/tarify" className="qRow" style={{ ...S.qRow, ...S.qLocked, minHeight: TAP }}>
        <span style={{ ...S.qArcana, color: C.muted, borderColor: C.border }}>{slot.arcana}</span>
        <span style={{ ...S.qLabel, color: C.text }}>{slot.label}</span>
        <Lock />
      </Link>
    );
  }

  return (
    <div>
      <button className="qRow" style={{
        ...S.qRow, minHeight: TAP,
        background: open ? SURFACE.cardHi : "transparent",
        borderColor: open ? C.borderHi : C.border,
      }} onClick={onToggle} aria-expanded={open}>
        <span style={{
          ...S.qArcana,
          color: open ? C.ink : C.gold,
          background: open ? C.gold : "transparent",
          borderColor: C.gold,
        }}>{slot.arcana}</span>
        <span style={{ ...S.qLabel, color: open ? C.white : C.text, fontWeight: open ? 600 : 400 }}>
          {slot.label}
        </span>
        <span style={{
          ...S.qSign,
          color: open ? C.gold : C.muted,
          transform: open ? "rotate(45deg)" : "none",
        }}>+</span>
      </button>

      {open && <Answer slot={slot} section={section} isPhone={isPhone} />}
    </div>
  );
}

function Answer({ slot, section, isPhone }) {
  const { loading, text } = useSlotText({
    key: slot.key,
    slotLabel: slot.label,
    arcana: slot.arcana,
    sectionTitle: section.title,
    sectionLead: section.lead,
  });

  return (
    <div style={{ ...S.qAnswer, padding: isPhone ? "12px 14px 16px" : "14px 18px 18px" }}>
      <div style={S.qAnswerTop}>
        Аркан {slot.arcana} — {ARCANA_NAMES[slot.arcana]}
      </div>
      <p style={{ ...S.slotText, opacity: loading ? 0.45 : 1 }}>
        {loading ? "Загружаем ответ…" : text}
      </p>
    </div>
  );
}

function Lock() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      style={{ flexShrink: 0 }} aria-label="под замком">
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" stroke={C.muted} strokeWidth="1.6" />
      <path d="M8.5 10.5V7.8a3.5 3.5 0 0 1 7 0v2.7" stroke={C.muted} strokeWidth="1.6" />
    </svg>
  );
}
