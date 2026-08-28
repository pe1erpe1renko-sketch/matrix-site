import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { C, R, SURFACE } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { ARCANA_NAMES } from "../lib/prompts.js";
import { useIsPhone, TAP } from "../theme/responsive.js";
import { useSlotText } from "./useSlotText.js";
import ArcanaImage from "./ArcanaImage.jsx";
import { stepForSphere } from "../lib/nextSteps.js";
import { backToReport } from "../lib/returnTo.js";
import { noteLockHit } from "../lib/hints.js";
import NextStepCard from "./NextStepCard.jsx";

/**
 * РАЗБОР: СФЕРЫ И ВОПРОСЫ
 * =======================
 * Два уровня раскрытия, и на каждом открыт РОВНО ОДИН элемент.
 *
 * СФЕРЫ свёрнуты по умолчанию. Человек видит всю карту разбора на одном
 * экране — двенадцать заголовков — и выбирает, что ему интересно. Если
 * раскрыть всё сразу, до последней сферы пришлось бы листать девяносто
 * два вопроса.
 *
 * ВОПРОСЫ внутри сферы тоже раскрываются по одному. Нажал вопрос —
 * получил ответ именно на него; нажал другой — предыдущий свернулся.
 *
 * ДОСТУП СЧИТАЕТСЯ ПО ВОПРОСУ, а не по сфере: в платной сфере первый
 * вопрос открыт всегда, чтобы человек попробовал везде.
 *
 * Закрытый вопрос текст НЕ запрашивает вообще. Иначе оплаченный контент
 * приезжал бы в браузер неоплатившему и лежал бы в разметке.
 *
 * В конце раскрытой сферы стоит карточка следующего шага: дочитал про
 * отношения — считаем совместимость. В свёрнутой сфере её нет, иначе
 * список сфер превратился бы в список предложений.
 *
 * @param {string} [selfDate] — дата этой страницы в виде ДД-ММ-ГГГГ.
 *        Без неё переходы, которые считаются по двум датам, собрать
 *        не из чего, и карточки не показываются.
 */
export default function SectionList({ sections, openId, onToggle, selfDate }) {
  return (
    <div style={S.sectionsWrap}>
      {sections.map((section) => (
        <Sphere
          key={section.id}
          section={section}
          open={openId === section.id}
          onToggle={() => onToggle(section.id)}
          selfDate={selfDate}
        />
      ))}
    </div>
  );
}

function Sphere({ section, open, onToggle, selfDate }) {
  const isPhone = useIsPhone();
  const firstOpen = section.slots.find((slot) => !slot.locked);
  const [questionId, setQuestionId] = useState(firstOpen ? firstOpen.id : null);

  const openCount = section.slots.filter((slot) => !slot.locked).length;
  const allOpen = openCount === section.slots.length;
  const step = selfDate ? stepForSphere(section.id) : null;

  return (
    <section id={`section-${section.id}`} className="sphere" style={{
      ...S.sphere,
      borderColor: open ? C.borderHi : C.border,
      background: open ? SURFACE.cardHi : SURFACE.card,
    }}>
      <button style={{ ...S.sphereHead, padding: isPhone ? "16px 16px" : "18px 22px" }}
        onClick={onToggle} aria-expanded={open}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <span style={S.sphereTitle}>{section.title}</span>
          <span style={S.sphereLead}>{section.lead}</span>
        </div>

        <span style={S.sphereRight}>
          <span style={S.sphereCount}>
            {allOpen
              ? `${section.slots.length} ${plural(section.slots.length, "вопрос", "вопроса", "вопросов")}`
              : `${openCount} из ${section.slots.length}`}
          </span>
          <span style={{
            ...S.sphereChevron,
            transform: open ? "rotate(180deg)" : "none",
            color: open ? C.gold : C.muted,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 9.5 L12 15.5 L18 9.5" stroke="currentColor" strokeWidth="1.9"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>
      </button>

      {open && (
        <div style={{ ...S.qList, padding: isPhone ? "0 12px 14px" : "0 18px 16px" }}>
          {section.slots.map((slot) => (
            <Question
              key={slot.id}
              slot={slot}
              section={section}
              sectionId={section.id}
              open={questionId === slot.id}
              onToggle={() => setQuestionId(questionId === slot.id ? null : slot.id)}
              isPhone={isPhone}
            />
          ))}
          {step && <NextStepCard step={step} selfDate={selfDate} sectionId={section.id} />}
        </div>
      )}
    </section>
  );
}

/**
 * Один вопрос. Открытый — кнопка, раскрывающая ответ.
 * Закрытый — ссылка на пейволл: число показываем, трактовку нет.
 */
function Question({ slot, section, sectionId, open, onToggle, isPhone }) {
  const location = useLocation();

  if (slot.locked) {
    /* Уводим на тарифы вместе с обратной дорогой: человек вернётся
       в эту же сферу, а не в начало разбора. */
    return (
      <Link to="/tarify" state={backToReport(location, sectionId)}
        onClick={noteLockHit}
        className="qRow" style={{ ...S.qRow, ...S.qLocked, minHeight: TAP }}>
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
        background: open ? "rgba(10,8,23,0.5)" : "transparent",
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
  /* Тип промпта и его поля пришли готовыми из lib/pageSections.js:
     компонент не решает, каким промптом писать текст. */
  const { loading, text } = useSlotText({
    key: slot.key,
    kind: slot.kind,
    pairKind: slot.pairKind,
    aspect: slot.aspect,
    yearArcana: slot.yearArcana,
    periodArcana: slot.periodArcana,
    year: slot.year,
    slotLabel: slot.label,
    arcana: slot.arcana,
    sectionTitle: section.title,
    sectionLead: section.lead,
  });

  return (
    <div style={{ ...S.qAnswer, padding: isPhone ? "12px 14px 16px" : "14px 18px 18px" }}>
      <div style={S.qAnswerBody}>
        {/* Картинка внутри раскрытого ответа: в свёрнутых сферах её нет
            намеренно — двенадцать карт подряд превратились бы в кашу. */}
        <ArcanaImage arcana={slot.arcana} radius={R.md} numberSize={22}
          style={{ width: isPhone ? 64 : 84 }} />
        <div style={{ minWidth: 0 }}>
          <div style={S.qAnswerTop}>
            Аркан {slot.arcana} — {ARCANA_NAMES[slot.arcana]}
          </div>
          <p style={{ ...S.slotText, opacity: loading ? 0.45 : 1 }}>
            {loading ? "Загружаем ответ…" : text}
          </p>
        </div>
      </div>
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

function plural(n, one, few, many) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}
