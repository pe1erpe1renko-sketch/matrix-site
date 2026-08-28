import React from "react";
import { C } from "../theme/tokens.js";

/**
 * ИКОНКИ МЕНЮ
 * ===========
 * Ключ = id страницы из routes.js. Добавили страницу — добавьте иконку
 * с тем же id, иначе пункт меню отрисуется без значка.
 *
 * Все иконки рисуются currentColor: цвет задаёт родитель, поэтому
 * активный пункт золотится сам, без отдельных вариантов иконки.
 */
export const Ic = {
  matrica: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none">
      <path d="M12 2 L14.2 9.8 L22 12 L14.2 14.2 L12 22 L9.8 14.2 L2 12 L9.8 9.8 Z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </svg>
  ),
  finansy: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 17V7h3a3 3 0 0 1 0 6h-4" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  sovmestimost: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none">
      <path d="M12 20s-7-4.4-7-9.2A4 4 0 0 1 12 8a4 4 0 0 1 7 2.8C19 15.6 12 20 12 20Z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  /* рукопожатие: два предплечья + сцепка + пальцы */
  biznes: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none">
      <path d="M1.8 10.2 L5.6 7.4 L9.4 10.2" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22.2 10.2 L18.4 7.4 L14.6 10.2" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.4 10.2 L12 12.8 L14.6 10.2 L12 7.6 Z" stroke="currentColor"
        strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10.6 14 L13 16.4 M13.4 13.2 L15.6 15.4" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  /* соска */
  detskaya: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="13.2" rx="6.4" ry="4.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="5.4" r="3.1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 8.5v2.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9.6 17.4c0 1.7 1.1 2.8 2.4 2.8s2.4-1.1 2.4-2.8" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  prognoz: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none">
      <path d="M20 14.5A8 8 0 1 1 10.2 4a6.5 6.5 0 0 0 9.8 10.5Z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M17 4.2l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7z" fill="currentColor" />
    </svg>
  ),
  chat: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none">
      <path d="M20 12.5c0 3.6-3.6 6.5-8 6.5-1 0-2-.15-2.9-.42L4.5 20l1.2-3.2C4.05 15.6 3 14.15 3 12.5 3 8.9 6.6 6 11 6s9 2.9 9 6.5Z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  tarify: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none">
      <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.5 10h19" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 14.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  /* Значок телеграм-прогноза в карточке матрицы. */
  tg: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none">
      <path d="M21 4.5 2.8 11.3c-.9.3-.9 1.5 0 1.8l4.6 1.4 1.7 5c.3.8 1.3 1 1.9.4l2.5-2.4 4.5 3.3c.7.5 1.6.1 1.8-.7L22.6 5.6c.2-.9-.7-1.5-1.6-1.1Z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  /* два человека — родители, друг */
  people: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8.2" r="3.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.8 19.4c0-3.4 2.8-5.8 6.2-5.8s6.2 2.4 6.2 5.8" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16.4 5.4a3.2 3.2 0 0 1 0 6.2" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" />
      <path d="M17.4 13.9c2.4.5 3.8 2.6 3.8 5.5" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" />
    </svg>
  ),
  /* календарь — личный год */
  calendar: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none">
      <rect x="3.2" y="5" width="17.6" height="15.4" rx="2.6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.2 9.6h17.6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 3.2v3.4M16 3.2v3.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="14.6" r="1.5" fill="currentColor" />
    </svg>
  ),
  profil: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4.8 20c0-3.9 3.2-6.6 7.2-6.6s7.2 2.7 7.2 6.6" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

/*
 * Псевдонимы: у типа разбора свой id, а рисунок тот же.
 * Деньги — бывшие «Финансы», род — две фигуры, как у «двух человек».
 */
Ic.dengi = Ic.finansy;
Ic.rod = Ic.people;
Ic["mama-rebenok"] = Ic.detskaya;
Ic.karma = Ic.prognoz;
Ic.zdorovie = Ic.matrica;
Ic.prednaznachenie = Ic.matrica;

/**
 * Круглый значок в цвете акцента: исследовательские карточки и плитки
 * «кого посмотрим дальше». Цвет один на обводку, фон и саму иконку —
 * так значок читается на тёмном фоне и не спорит с золотом кнопки.
 */
export function RoundIcon({ name, accent, size = 46 }) {
  const Glyph = Ic[name] || Ic.matrica;
  return (
    <span aria-hidden="true" style={{
      width: size, height: size, flexShrink: 0, borderRadius: "50%",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: `${accent}1F`, border: `1px solid ${accent}59`, color: accent,
    }}>
      <Glyph width={size * 0.48} height={size * 0.48} />
    </span>
  );
}

/** Звезда логотипа. Она же — маркер в мелких подписях. */
export function Spark({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ flexShrink: 0, display: "block" }}>
      <path d="M8 0 L9.6 6.4 L16 8 L9.6 9.6 L8 16 L6.4 9.6 L0 8 L6.4 6.4 Z" fill={C.gold} />
    </svg>
  );
}
