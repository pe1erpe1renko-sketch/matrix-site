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

/* ---- кабинет ---- */
.iconBtn:hover, .iconCopy:hover { border-color: ${C.lilac}; color: ${C.lilac}; }
.iconBtn:hover .tip, .iconCopy:hover .tip, .exitBtn:hover .tip { opacity: 1; }
.exitBtn:hover { color: ${C.white}; }
.supRow:hover { border-color: ${C.lilac}; background: rgba(31,24,65,0.9); }
.histItem:hover { border-color: ${C.lilac}; background: rgba(31,24,65,0.9); }
.inAct:hover { background: rgba(228,190,114,0.26); color: ${C.goldHi}; }
.addCard:hover { border-color: ${C.gold}; color: ${C.gold}; background: rgba(228,190,114,.04); }
.delBtn:hover { background: rgba(230,138,176,0.18); border-color: ${C.pink}; color: #F5A8C4; box-shadow: 0 0 26px -4px rgba(230,138,176,0.6); }
.btnGhost { background: transparent; color: ${C.muted}; }
.btnGhost:hover { color: ${C.white}; }
.socialBtn:hover { border-color: ${C.lilac}; }
.qRow:hover { border-color: ${C.lilac}; background: rgba(31,24,65,0.72); }
.sphere:hover { border-color: ${C.borderHi}; }

/* ---- мобильный режим ---- */

/*
 * ОТСТУПЫ ЧЕРЕЗ ПЕРЕМЕННЫЕ.
 * Вёрстка на встроенных стилях, а их медиазапросом не перекрыть. Зато
 * встроенный стиль может СОСЛАТЬСЯ на переменную — и вот её значение
 * медиазапрос уже меняет. Так все секции сужаются на телефоне разом,
 * без правки каждой страницы.
 */
:root {
  --secX: 52px;   /* боковой отступ секции */
  --secY: 62px;   /* верх и низ секции */
  --cabY: 40px;   /* кабинет сверху */
  --cabB: 64px;   /* кабинет снизу */
  --chatX: 24px;  /* поля чата */
  --appTop: 0px;  /* высота мобильной шапки: на десктопе её нет */
}
@media (max-width: 1024px) {
  :root { --secX: 30px; --secY: 48px; --cabY: 30px; --cabB: 48px; --chatX: 18px; }
}
@media (max-width: 640px) {
  :root { --secX: 16px; --secY: 34px; --cabY: 20px; --cabB: 36px; --chatX: 12px; --appTop: 56px; }
}

/* Полоса прокрутки у боковых лент только мешает: лента и так очевидна. */
.hScroll::-webkit-scrollbar { display: none; }
.hScroll > * { flex-shrink: 0; }

/* Страница целиком вбок не ездит. Прокручиваются только те блоки,
   которым это осмысленно — им проставлен overflow-x на самом блоке. */
html, body { max-width: 100%; overflow-x: hidden; }

/* Схема матрицы: жесты забирает компонент, браузер не должен
   одновременно скроллить страницу под пальцем. */
.octaStage { touch-action: none; }

/* На тач-устройствах курсор системный, свой не рисуем. */
@media (pointer: coarse) {
  html, body, button, input, select, a, label, textarea { cursor: auto; }
}

@media (max-width: 640px) {
  /* Полосы-индикаторы в чакральной таблице на телефоне скрыты:
     места мало, числа важнее. */
  .chkGauge { display: none !important; }

  /*
   * Палец — не курсор: цель меньше 44 пикселей по высоте нажимается
   * с промахом. Высоту задаём классом, а не встроенным стилем: min-height
   * во встроенных стилях кнопок не выставлен, поэтому перебивать нечего
   * и правило срабатывает.
   */
  .chip, .btnGold, .btnOutline, .btnGhost, .socialBtn, .inAct, .delBtn, .link {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  /* Ссылка внутри строки состояния остаётся по левому краю. */
  .link { justify-content: flex-start; }
}
`;
