import React, { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { CALC_NAV } from "../routes.js";
import { useIsPhone, TAP } from "../theme/responsive.js";

/**
 * КАРУСЕЛЬ ТИПОВ РАЗБОРА
 * ======================
 * Одиннадцать типов в одну строку: десять разборов в порядке CALC_TYPES
 * (он выстроен по спросу) и прогноз последним. В две строки они не
 * помещаются, а перенос превратил бы форму в стену вкладок.
 *
 * ЧТО ПОКАЗЫВАЕТ, ЧТО ЛЕНТУ МОЖНО ЛИСТАТЬ. Затухание у того края,
 * за которым ещё есть вкладки, и стрелки на десктопе. Без этого человек
 * видит обрезанное слово и не понимает, что делать.
 *
 * ВКЛАДКА = АДРЕС. Каждая вкладка — обычная ссылка, поэтому работает
 * «назад», ссылку можно переслать, и меню с каруселью не расходятся.
 *
 * Подсветка выбранного задана встроенным стилем: классом её задавать
 * нельзя, встроенные стили перебивают таблицу (CLAUDE.md, раздел 8).
 */
export default function CalcCarousel({ active }) {
  const isPhone = useIsPhone();
  const scroller = useRef(null);
  const [edge, setEdge] = useState({ left: false, right: true });
  const [hover, setHover] = useState(false);

  const measure = useCallback(() => {
    const node = scroller.current;
    if (!node) return;
    const max = node.scrollWidth - node.clientWidth;
    setEdge({ left: node.scrollLeft > 4, right: node.scrollLeft < max - 4 });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  /* Выбранная вкладка подъезжает в видимую часть: человек пришёл
     по прямой ссылке на /prednaznachenie и должен увидеть, где он. */
  useEffect(() => {
    const node = scroller.current;
    if (!node) return;
    const current = node.querySelector('[aria-current="page"]');
    if (!current) return;
    const left = current.offsetLeft - node.clientWidth / 2 + current.offsetWidth / 2;
    node.scrollTo({ left: Math.max(0, left), behavior: "auto" });
    measure();
  }, [active, measure]);

  const nudge = (direction) => {
    const node = scroller.current;
    if (!node) return;
    node.scrollBy({ left: direction * Math.max(180, node.clientWidth * 0.7), behavior: "smooth" });
  };

  return (
    <div style={S.calcCarousel}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>

      <div ref={scroller} className="hScroll" style={S.calcTrack} onScroll={measure}>
        {CALC_NAV.map((c) => {
          const on = c.id === active;
          return (
            <Link key={c.id} to={c.path} className="calcTab"
              aria-current={on ? "page" : undefined}
              style={{
                ...S.calcTab,
                minHeight: isPhone ? TAP : 40,
                background: on ? C.gold : "transparent",
                borderColor: on ? C.gold : C.border,
                color: on ? C.ink : C.text,
                fontWeight: on ? 600 : 400,
                boxShadow: on ? `0 8px 22px -10px ${C.gold}` : "none",
              }}>{c.short}</Link>
          );
        })}
      </div>

      {/* Затухание у края, за которым ещё есть вкладки. */}
      <span aria-hidden="true" style={{ ...S.calcFade, left: 0, opacity: edge.left ? 1 : 0,
        background: `linear-gradient(90deg, ${C.cardHi}, rgba(31,24,65,0))` }} />
      <span aria-hidden="true" style={{ ...S.calcFade, right: 0, opacity: edge.right ? 1 : 0,
        background: `linear-gradient(270deg, ${C.cardHi}, rgba(31,24,65,0))` }} />

      {/* Стрелки только там, где есть курсор: пальцем лента листается сама. */}
      {!isPhone && (
        <>
          <Arrow side="left" show={hover && edge.left} onClick={() => nudge(-1)} />
          <Arrow side="right" show={hover && edge.right} onClick={() => nudge(1)} />
        </>
      )}
    </div>
  );
}

function Arrow({ side, show, onClick }) {
  return (
    <button className="calcArrow" aria-label={side === "left" ? "Предыдущие типы" : "Следующие типы"}
      tabIndex={-1}
      onClick={onClick}
      style={{
        ...S.calcArrow,
        [side]: -6,
        opacity: show ? 1 : 0,
        pointerEvents: show ? "auto" : "none",
      }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        style={{ transform: side === "left" ? "rotate(180deg)" : "none" }}>
        <path d="M9 5.5 L15.5 12 L9 18.5" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
