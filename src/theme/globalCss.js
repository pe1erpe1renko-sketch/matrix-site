/**
 * ГЛОБАЛЬНЫЕ СТИЛИ
 * ================
 * Только то, что нельзя выразить встроенным стилем: :hover, :focus,
 * анимации, псевдоэлементы, медиазапросы, подключение шрифтов.
 *
 * ВАЖНО (CLAUDE.md, раздел «Дизайн»): активные состояния сюда НЕ добавлять.
 * Встроенный стиль перебивает класс, и подсветка просто не сработает —
 * эта ошибка уже была один раз.
 *
 * Вставляется один раз в макете (components/Layout.jsx).
 */

import { C } from "./tokens.js";

export const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,600&family=Inter:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; }
html, body, button, input, select, a, label { cursor: none; }
::placeholder { color: ${C.faint}; }

.star { position: absolute; border-radius: 50%; background: ${C.star}; animation: tw 6s ease-in-out infinite; }
@keyframes tw { 0%, 100% { opacity: .22; } 50% { opacity: 1; } }

.fly { position: absolute; inset: 0; animation: fly linear infinite; }
@keyframes fly { from { transform: translateY(0); } to { transform: translateY(-100%); } }

.spinA { animation: rotA linear infinite; }
.spinB { animation: rotB linear infinite; }
@keyframes rotA { to { transform: rotate(360deg); } }
@keyframes rotB { to { transform: rotate(-360deg); } }

.collapseBtn:hover { border-color: ${C.lilac}; color: ${C.lilac}; background: rgba(183,156,232,0.09); }
.chip:hover { border-color: ${C.borderHi}; }
.gender:hover { border-color: ${C.borderHi}; }
.arcTile:hover { border-color: ${C.gold}; background: rgba(31,24,65,0.9); transform: translateY(-2px); }
.arcTile:hover span:first-child { opacity: .42; }
.chk:hover { background: rgba(183,156,232,0.05); }
.undRow:hover { background: rgba(183,156,232,0.05); padding-left: 12px; }
.undRow:first-child { border-top: none; }
.octaPt { transition: opacity .16s ease; }
.octaPt:hover { opacity: .92; }

.btnGold:hover { background: ${C.goldHi} !important; box-shadow: 0 12px 36px -14px ${C.gold}; }
.btnLilac { background: ${C.lilacBtn}; color: ${C.ink}; font-weight: 600; }
.btnLilac:hover { background: ${C.lilac}; box-shadow: 0 12px 36px -14px ${C.lilac}; }
.btnOutline { background: transparent; border: 1px solid ${C.border}; color: ${C.white}; }
.btnOutline:hover { border-color: ${C.lilac}; }

.link:hover { color: ${C.goldHi}; }
.footLink:hover { color: ${C.gold}; }
.card:hover { border-color: ${C.borderHi}; }

.fld:focus { outline: none; border-color: ${C.lilac}; }
button:focus-visible, .fld:focus-visible { outline: 2px solid ${C.lilac}; outline-offset: 2px; }

@media (prefers-reduced-motion: reduce) { .spinA, .spinB, .star, .fly { animation: none; } }
@media (pointer: coarse) { html, body, button, input, select, a, label { cursor: auto; } }

a { color: inherit; text-decoration: none; }
`;
