/**
 * ОБЩИЙ СЛОВАРЬ СТИЛЕЙ
 * ====================
 * Один объект на весь сайт: макет, меню, подвал, типографика, карточки.
 * Компоненты берут отсюда готовые куски и не заводят свои копии — иначе
 * золото на кнопке в одном месте разойдётся с золотом в другом.
 *
 * Все значения собраны из токенов (theme/tokens.js). Голых цветов и
 * размеров скругления здесь быть не должно.
 */

import { C, R, FONT, SURFACE } from "./tokens.js";

export const S = {
  root: {
    display: "flex", minHeight: "100vh", background: C.bg, color: C.text,
    fontFamily: FONT.sans,
    fontSize: 15, lineHeight: 1.6, position: "relative",
  },

  curDot: {
    position: "fixed", left: 0, top: 0, width: 7, height: 7, borderRadius: "50%",
    background: C.gold, pointerEvents: "none", zIndex: 9999,
  },
  curRing: {
    position: "fixed", left: 0, top: 0, width: 34, height: 34, borderRadius: "50%",
    border: `1px solid ${C.lilac}`, opacity: 0.55, pointerEvents: "none", zIndex: 9998,
  },

  sky: { position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" },
  skyLayer: { position: "absolute", inset: -90, willChange: "transform" },
  tunnelWrap: {
    position: "absolute", left: "50%", top: "42%",
    width: "min(84vh, 720px)", height: "min(84vh, 720px)",
    transform: "translate(-50%,-50%)", willChange: "transform",
  },
  tunnelSvg: { width: "100%", height: "100%", position: "relative", zIndex: 2 },
  glow: {
    position: "absolute", inset: "22%", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(183,156,232,0.13), transparent 68%)",
    filter: "blur(26px)", zIndex: 1,
  },

  /**
   * Меню закреплено намертво: position: fixed, а не sticky.
   * Sticky здесь не работает — у body стоит overflow-x: hidden (страховка
   * от горизонтальной прокрутки на телефоне), а это делает body
   * прокручиваемым контейнером и ломает прилипание к окну.
   *
   * Содержимое справа отодвигается на ширину меню (S.main → marginLeft).
   */
  side: {
    background: "rgba(13,10,30,0.9)", backdropFilter: "blur(12px)",
    borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column",
    position: "fixed", left: 0, top: 0, bottom: 0,
    transition: "width .24s cubic-bezier(.4,0,.2,1)", flexShrink: 0, zIndex: 5,
  },
  /* Логотип приклеен сверху, карточка пользователя снизу: прокручивается
     только список пунктов между ними (S.nav с overflowY: auto). */
  sideTop: {
    display: "flex", alignItems: "center", padding: "0 16px",
    borderBottom: `1px solid ${C.border}`, height: 74, flexShrink: 0,
  },
  logo: { display: "flex", alignItems: "center", gap: 11, minHeight: 44 },
  logoText: { fontSize: 19, fontWeight: 600, color: C.white, letterSpacing: "0.24em", lineHeight: 1 },
  collapse: {
    background: "transparent", border: `1px solid ${C.border}`, color: C.muted,
    width: 32, height: 32, borderRadius: R.sm, display: "flex",
    alignItems: "center", justifyContent: "center",
    transition: "all .18s ease", flexShrink: 0,
  },
  nav: { padding: "14px 12px", flex: 1, overflowY: "auto", overflowX: "hidden" },
  navItem: {
    display: "flex", alignItems: "center", gap: 12, width: "100%",
    padding: "11px 13px", border: "none", borderRadius: R.md,
    fontSize: 14.5, textAlign: "left", fontFamily: "inherit", marginBottom: 3,
    transition: "background .16s ease, color .16s ease",
  },
  navLbl: { whiteSpace: "nowrap", overflow: "hidden" },
  divider: { height: 1, background: C.border, margin: "14px 12px" },
  sideBottom: { padding: 14, borderTop: `1px solid ${C.border}`, flexShrink: 0 },
  loginBtn: {
    width: "100%", padding: "12px 14px", borderRadius: R.md,
    fontSize: 14.5, fontFamily: "inherit", border: "none",
  },

  main: { flex: 1, minWidth: 0, position: "relative", zIndex: 2 },
  section: { padding: "var(--secY) var(--secX)", position: "relative" },

  heroGrid: {
    display: "grid", width: "100%",
    gridTemplateColumns: "minmax(0, 1fr) minmax(330px, 440px)",
    gap: 56, alignItems: "center",
  },

  eyebrow: {
    fontSize: 11.5, letterSpacing: "0.18em", textTransform: "uppercase",
    color: C.gold, marginBottom: 14, fontWeight: 500,
  },
  h1: {
    fontFamily: FONT.serif,
    fontSize: "clamp(32px, 3.8vw, 50px)", lineHeight: 1.1,
    color: C.white, margin: "0 0 20px", fontWeight: 600,
  },
  h1em: { color: C.gold, fontStyle: "italic" },
  h2: {
    fontFamily: FONT.serif,
    fontSize: "clamp(23px, 2.4vw, 32px)", lineHeight: 1.24,
    color: C.white, margin: "0 0 28px", fontWeight: 600, maxWidth: 860,
  },
  h3: {
    fontFamily: FONT.serif,
    fontSize: 22, color: C.white, margin: "46px 0 24px", fontWeight: 600,
  },
  heroLead: { maxWidth: 450, margin: "0 0 26px", color: C.text, fontSize: 14.5 },

  stats: { display: "flex", gap: 38, flexWrap: "wrap" },
  statN: { fontFamily: FONT.serif, fontSize: 28, color: C.gold, lineHeight: 1 },
  statL: { fontSize: 12, color: C.muted, marginTop: 7, maxWidth: 124 },

  form: {
    background: "rgba(23,18,47,0.9)", backdropFilter: "blur(18px)",
    border: `1px solid ${C.border}`, borderRadius: R.xl, padding: "24px 24px 26px",
    boxShadow: "0 30px 80px -40px rgba(0,0,0,0.9)",
  },
  formTitle: { fontFamily: FONT.serif, fontSize: 21, color: C.white, marginBottom: 4 },
  formSub: { fontSize: 13, color: C.muted, marginBottom: 16 },
  tabs: { display: "flex", flexWrap: "wrap", gap: 8 },
  chip: {
    padding: "7px 13px", borderRadius: R.pill, fontSize: 12.5,
    border: "1px solid", fontFamily: "inherit", transition: "all .16s ease",
    /* Фон обязателен: без него браузер рисует кнопке системный светло-серый,
       и на тёмном фоне вылезает белая плашка. */
    background: "transparent",
  },
  personLabel: {
    fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase",
    color: C.lilac, marginBottom: 2,
  },
  nameRow: { display: "flex", gap: 10, alignItems: "flex-end" },
  fieldLabel: {
    display: "block", fontSize: 10.5, letterSpacing: "0.13em",
    textTransform: "uppercase", color: C.muted, margin: "11px 0 6px",
  },
  input: {
    width: "100%", padding: "11px 13px", borderRadius: R.md, minHeight: 44,
    background: "rgba(10,8,23,0.72)", border: `1px solid ${C.border}`,
    color: C.white, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box",
  },
  dateRow: { display: "grid", gridTemplateColumns: "1fr 1.1fr 1fr", gap: 8 },
  select: {
    width: "100%", padding: "11px 9px", borderRadius: R.md, minHeight: 44,
    background: "rgba(10,8,23,0.72)", border: `1px solid ${C.border}`,
    color: C.white, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box",
  },
  genderRow: { display: "flex", gap: 8 },
  gender: {
    width: 44, minHeight: 44, padding: "10px 0", borderRadius: R.md, fontSize: 13.5,
    border: "1px solid", fontFamily: "inherit", transition: "all .16s ease",
  },
  cta: {
    width: "100%", marginTop: 20, padding: "14px 18px", borderRadius: R.md,
    fontSize: 15, fontWeight: 600, fontFamily: "inherit", border: "none",
    transition: "all .16s ease",
  },
  ctaSmall: {
    padding: "13px 24px", borderRadius: R.md, fontSize: 14.5,
    fontWeight: 600, fontFamily: "inherit", border: "none",
  },
  formNote: {
    display: "flex", gap: 8, alignItems: "flex-start",
    fontSize: 12, color: C.muted, marginTop: 12, lineHeight: 1.5,
  },

  undGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
    gap: 52, alignItems: "start",
  },
  undAside: {
    borderLeft: `2px solid ${C.gold}`, paddingLeft: 18,
  },
  undList: { listStyle: "none", margin: 0, padding: 0 },
  undRow: {
    display: "flex", gap: 20, alignItems: "flex-start",
    padding: "20px 14px 20px 4px", borderTop: `1px solid ${C.border}`,
    borderRadius: R.sm, transition: "background .18s ease, padding-left .18s ease",
  },
  undNum: {
    fontFamily: FONT.serif, color: C.gold,
    fontSize: 22, lineHeight: 1.1, flexShrink: 0, opacity: 0.9, minWidth: 34,
  },
  undTxt: { fontSize: 15.5, color: C.text, lineHeight: 1.55 },
  uMark: { color: C.gold, flexShrink: 0 },

  layerRow: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 6 },
  layerChip: {
    display: "flex", alignItems: "center", gap: 7,
    padding: "6px 12px", borderRadius: R.pill, fontSize: 11.5,
    border: "1px solid", fontFamily: "inherit", transition: "all .16s ease",
  },
  layerDot: {
    width: 7, height: 7, borderRadius: 4, border: "1px solid",
    flexShrink: 0, transition: "all .16s ease",
  },
  /* Сцена схемы строго квадратная: иначе при зуме она то вытягивается,
     то сплющивается, и точки уезжают из-под пальца. */
  octaStage: {
    width: "100%", aspectRatio: "1 / 1", overflow: "hidden",
    borderRadius: R.md, position: "relative",
  },
  zoomRow: { display: "flex", alignItems: "center", gap: 8, marginTop: 10 },
  zoomBtn: {
    width: 44, height: 44, borderRadius: R.md, flexShrink: 0,
    background: "rgba(10,8,23,0.6)", border: `1px solid ${C.border}`,
    color: C.white, fontSize: 20, lineHeight: 1, fontFamily: "inherit",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  octaPanel: {
    marginTop: 14, padding: "16px 18px", borderRadius: R.lg,
    background: "rgba(10,8,23,0.55)", border: `1px solid ${C.border}`,
    minHeight: 104,
  },
  octaPanelTop: { display: "flex", alignItems: "center", gap: 14, marginBottom: 10 },
  octaVal: {
    fontFamily: FONT.serif, fontSize: 30,
    color: C.gold, lineHeight: 1, minWidth: 40, textAlign: "center",
  },
  octaTitle: { color: C.white, fontSize: 15.5, fontWeight: 500 },
  octaArc: { color: C.lilac, fontSize: 12.5, marginTop: 2 },
  octaHint: { margin: 0, color: C.text, fontSize: 13.5, lineHeight: 1.5 },

  infoLabel: {
    fontSize: 11.5, letterSpacing: "0.15em", textTransform: "uppercase",
    color: C.gold, marginBottom: 11,
  },
  infoText: { margin: 0, color: C.text, fontSize: 14.5 },

  demoGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))", gap: 16,
  },
  demoCard: {
    background: "rgba(23,18,46,0.78)", border: `1px solid ${C.border}`,
    borderRadius: R.xl, padding: "22px 24px 22px",
    display: "flex", flexDirection: "column",
    transition: "border-color .18s ease, background .18s ease",
  },
  demoHead: {
    display: "flex", justifyContent: "space-between",
    alignItems: "baseline", marginBottom: 14, gap: 12, flexWrap: "wrap",
    flex: "0 0 auto",
  },
  demoDate: { fontSize: 11.5, color: C.muted, letterSpacing: "0.04em" },

  chkRow: {
    display: "grid",
    gridTemplateColumns: "minmax(150px, 210px) minmax(70px, 1fr) 46px 46px 46px",
    alignItems: "center", padding: "6px 0", gap: 14,
  },
  chkName: { display: "flex", alignItems: "center", gap: 11 },
  chkBar: { width: 3, height: 30, borderRadius: 2, flexShrink: 0 },
  chkGauge: { display: "flex", flexDirection: "column", gap: 4, minWidth: 0 },
  chkTrack: {
    display: "block", height: 4, borderRadius: 2,
    background: "rgba(183,156,232,0.12)", overflow: "hidden",
  },
  chkFill: { display: "block", height: "100%", borderRadius: 2, opacity: 0.85 },
  chkLegend: { display: "flex", gap: 12, flexWrap: "wrap" },
  chkLeg: {
    display: "flex", alignItems: "center", gap: 5,
    fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: C.muted,
  },
  chkLegDot: { width: 7, height: 3, borderRadius: 2, display: "block" },
  chkHead: {
    fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase",
    color: C.muted, textAlign: "center",
  },
  chkVal: {
    textAlign: "center", fontSize: 18, color: C.white,
    fontFamily: FONT.serif,
  },

  arcGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 158px), 1fr))", gap: 12,
  },
  arcTile: {
    position: "relative", overflow: "hidden",
    minHeight: 92, padding: "16px 16px 14px",
    borderRadius: R.lg, background: "rgba(23,18,46,0.66)",
    border: `1px solid ${C.border}`,
    display: "flex", alignItems: "flex-end",
    transition: "all .18s ease",
  },
  arcGhost: {
    position: "absolute", top: -6, right: 10,
    fontFamily: FONT.serif,
    fontSize: 54, lineHeight: 1, color: C.gold, opacity: 0.16,
    pointerEvents: "none", transition: "opacity .18s ease",
  },
  arcTileName: {
    fontSize: 14, color: C.white, position: "relative", zIndex: 2,
    lineHeight: 1.3, fontWeight: 500,
  },

  flowWrap: { position: "relative" },
  flowLine: {
    position: "absolute", left: 40, right: 40, top: 34, height: 1,
    background: `linear-gradient(90deg, ${C.border}, ${C.borderHi}, ${C.gold})`,
    opacity: 0.5,
  },
  flow: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))",
    gap: 16, position: "relative",
  },
  flowCard: {
    display: "flex", flexDirection: "column", alignItems: "flex-start",
    padding: "0 22px 22px", borderRadius: R.lg,
    background: "rgba(23,18,46,0.82)", border: `1px solid ${C.border}`,
    transition: "border-color .18s ease, transform .18s ease",
  },
  flowNum: {
    width: 44, height: 44, borderRadius: "50%", border: "1.5px solid",
    background: C.bg, display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: FONT.serif, fontSize: 19,
    marginTop: -22, marginBottom: 14,
  },
  flowArt: {
    width: "100%", marginBottom: 16, borderRadius: R.md,
    background: "rgba(10,8,23,0.45)", padding: "10px 6px",
  },
  artSvg: { width: "100%", height: "auto", display: "block" },
  flowMeta: {
    marginTop: 14, fontSize: 11.5, letterSpacing: "0.08em",
    textTransform: "uppercase", padding: "6px 12px",
    border: "1px solid", borderRadius: R.pill,
  },
  stepTitle: {
    fontFamily: FONT.serif,
    fontSize: 19, color: C.white, marginBottom: 10,
  },
  forever: { fontSize: 13, color: C.muted, marginTop: 24, textAlign: "center" },

  onceRow: {
    display: "flex", flexWrap: "wrap", gap: 38, padding: "30px 32px",
    background: "rgba(31,24,65,0.75)", border: `1px solid ${C.border}`,
    borderRadius: R.xl, alignItems: "flex-start",
    transition: "border-color .18s ease, background .18s ease",
  },
  onceList: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 22px" },
  li: { display: "flex", gap: 10, fontSize: 14, padding: "4px 0" },
  onceCtaWrap: {
    display: "flex", flexDirection: "column", gap: 12,
    marginLeft: "auto", alignItems: "flex-end", alignSelf: "flex-end",
  },
  link: {
    background: "none", border: "none", color: C.lilac, fontSize: 13.5,
    fontFamily: "inherit", textDecoration: "underline",
    textUnderlineOffset: 3, padding: 0, transition: "color .15s ease",
  },

  plans: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
    gap: 17, alignItems: "stretch",
  },
  plan: {
    flexDirection: "column", gap: 0, padding: "24px 26px 28px", display: "flex",
    border: "1px solid", borderRadius: R.xl,
    transition: "border-color .18s ease, background .18s ease",
  },
  badgeSlot: { height: 28, marginBottom: 6 },
  badge: {
    fontSize: 10.5, letterSpacing: "0.13em", padding: "5px 12px",
    borderRadius: R.pill, border: "1px solid", fontWeight: 600,
  },
  planName: { fontFamily: FONT.serif, fontSize: 21, color: C.white },
  priceRow: { display: "flex", alignItems: "baseline", gap: 8, marginTop: 9 },
  price: { fontFamily: FONT.serif, fontSize: 42, color: C.white, lineHeight: 1 },
  priceUnit: { fontSize: 14, color: C.muted },
  priceHint: { fontSize: 12.5, color: C.gold, marginTop: 7 },
  planLead: { fontSize: 14, color: C.text, margin: "15px 0 17px" },

  faqWrap: { display: "flex", flexDirection: "column", gap: 10, maxWidth: 880 },
  faqItem: {
    border: "1px solid", borderRadius: R.lg, padding: "4px 22px 4px",
    transition: "border-color .18s ease, background .18s ease",
  },
  faqQ: {
    width: "100%", background: "none", border: "none", color: C.white,
    fontSize: 15.5, fontFamily: "inherit", textAlign: "left",
    padding: "18px 0", display: "flex", justifyContent: "space-between",
    alignItems: "center", gap: 18, fontWeight: 500,
  },
  faqPlus: { fontSize: 22, lineHeight: 1, transition: "transform .2s ease, color .2s ease", flexShrink: 0 },
  faqA: { margin: "0 0 20px", color: C.text, fontSize: 14.5, maxWidth: 760 },

  finalCta: {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "48px 40px 52px", borderRadius: R.xl,
    background: "rgba(31,24,65,0.78)", border: `1px solid ${C.borderHi}`,
    transition: "border-color .18s ease",
  },

  footer: {
    borderTop: `1px solid ${C.border}`, padding: "44px var(--secX) 32px",
    background: "rgba(15,11,32,0.92)",
  },
  footGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: 36 },
  footTitle: {
    fontSize: 11.5, letterSpacing: "0.15em", textTransform: "uppercase",
    color: C.gold, marginBottom: 15,
  },
  footLink: { fontSize: 14, color: C.text, padding: "5px 0", transition: "color .15s ease" },
  footBottom: {
    marginTop: 38, paddingTop: 22, borderTop: `1px solid ${C.border}`,
    fontSize: 12.5, color: C.muted,
  },

  /* ---------- страницы-заглушки ---------- */

  stubWrap: {
    display: "flex", flexDirection: "column", alignItems: "center",
    textAlign: "center", padding: "70px 40px 76px", borderRadius: R.xl,
    background: SURFACE.card, border: `1px solid ${C.border}`,
    maxWidth: 720, margin: "0 auto",
  },
  stubBadge: {
    fontSize: 11.5, letterSpacing: "0.15em", textTransform: "uppercase",
    color: C.lilac, border: `1px solid ${C.lilac}`, borderRadius: R.pill,
    padding: "6px 15px", marginBottom: 22,
  },
  stubTitle: {
    fontFamily: FONT.serif, fontSize: "clamp(26px, 2.6vw, 34px)",
    color: C.white, margin: "0 0 14px", fontWeight: 600, lineHeight: 1.2,
  },
  stubText: {
    margin: "0 auto", color: C.text, fontSize: 14.5, maxWidth: 480,
  },
  stubDate: {
    fontFamily: FONT.serif, fontSize: 30, color: C.gold,
    margin: "22px 0 4px", lineHeight: 1,
  },
  stubDateLbl: {
    fontSize: 11.5, letterSpacing: "0.14em", textTransform: "uppercase",
    color: C.muted,
  },
  stubActions: { display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28, justifyContent: "center" },

  /* ---------- страница результата ---------- */

  resultHead: {
    display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-end",
    justifyContent: "space-between", marginBottom: 26,
  },
  resultDate: {
    fontFamily: FONT.serif, fontSize: "clamp(28px, 3vw, 40px)",
    color: C.white, margin: "0 0 6px", fontWeight: 600, lineHeight: 1.1,
  },

  /* аркан дня */
  dayCard: {
    display: "grid", gridTemplateColumns: "minmax(190px, 240px) minmax(260px, 1fr)",
    gap: 30, alignItems: "start", padding: "28px 32px", borderRadius: R.xl,
    background: SURFACE.cardHi, border: `1px solid ${C.borderHi}`,
  },
  dayBigWrap: { textAlign: "center" },
  dayBig: {
    fontFamily: FONT.serif, fontSize: 96, lineHeight: 1,
    color: C.gold, display: "block",
  },
  dayArcName: { color: C.white, fontSize: 17, marginTop: 8 },
  dayTomorrow: {
    marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.border}`,
    fontSize: 13.5, color: C.text,
  },
  dayPeriod: {
    marginTop: 10, fontSize: 12.5, color: C.muted, lineHeight: 1.5,
  },

  /* предназначения */
  purposeGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: 14,
  },
  purposeCard: {
    padding: "20px 22px 22px", borderRadius: R.lg,
    background: SURFACE.card, border: `1px solid ${C.border}`,
    transition: "border-color .18s ease",
  },
  purposeVal: {
    fontFamily: FONT.serif, fontSize: 40, color: C.gold, lineHeight: 1, display: "block",
  },
  purposeTitle: { color: C.white, fontSize: 16, fontWeight: 500, margin: "12px 0 6px" },
  purposeHint: { color: C.muted, fontSize: 13, margin: 0, lineHeight: 1.5 },
  purposeFormula: {
    marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.border}`,
    fontSize: 12, color: C.text,
  },

  /* родовые программы */
  lineGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 14,
  },
  lineCard: {
    padding: "22px 24px", borderRadius: R.lg,
    background: SURFACE.card, border: `1px solid ${C.border}`,
  },
  lineRow: {
    display: "flex", alignItems: "center", gap: 14,
    padding: "10px 0", borderTop: `1px solid ${C.border}`,
  },
  lineVal: {
    fontFamily: FONT.serif, fontSize: 24, color: C.lilac,
    minWidth: 38, textAlign: "center", lineHeight: 1,
  },
  lineValStrong: {
    fontFamily: FONT.serif, fontSize: 30, color: C.gold,
    minWidth: 38, textAlign: "center", lineHeight: 1,
  },
  lineLbl: { fontSize: 14, color: C.text },

  /* ---------- разбор: сферы и вопросы ---------- */
  sectionsWrap: { display: "flex", flexDirection: "column", gap: 14 },
  sphere: {
    border: "1px solid", borderRadius: R.xl, overflow: "hidden",
    transition: "border-color .18s ease, background .18s ease",
  },
  /* Свёрнутая сфера — не строка таблицы, а карточка: заголовок серифом,
     подзаголовок обычным текстом, счётчик справа. По ней хочется нажать. */
  sphereHead: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: 16, width: "100%", background: "none", border: "none",
    fontFamily: "inherit", textAlign: "left",
  },
  sphereTitle: {
    display: "block", fontFamily: FONT.serif, fontSize: 20, color: C.white,
    fontWeight: 600, lineHeight: 1.2,
  },
  sphereLead: {
    display: "block", marginTop: 5, color: C.muted, fontSize: 13, lineHeight: 1.45,
  },
  sphereRight: { display: "flex", alignItems: "center", gap: 12, flexShrink: 0 },
  sphereCount: {
    fontSize: 11.5, letterSpacing: "0.06em", color: C.gold, whiteSpace: "nowrap",
    border: `1px solid ${C.border}`, borderRadius: R.pill, padding: "5px 11px",
  },
  sphereChevron: {
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "transform .22s ease, color .18s ease",
  },
  qList: { display: "flex", flexDirection: "column", gap: 6 },
  qRow: {
    display: "flex", alignItems: "center", gap: 12, width: "100%",
    padding: "10px 12px", borderRadius: R.md, border: "1px solid",
    fontFamily: "inherit", textAlign: "left", transition: "all .16s ease",
  },
  qLocked: { borderColor: C.border, background: "transparent", opacity: 0.72 },
  qArcana: {
    width: 30, height: 30, borderRadius: 9, border: "1px solid", flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: FONT.serif, fontSize: 15, lineHeight: 1,
  },
  qLabel: { flex: 1, minWidth: 0, fontSize: 15, lineHeight: 1.35 },
  qSign: { fontSize: 20, lineHeight: 1, flexShrink: 0, transition: "transform .2s ease" },
  qAnswer: {
    borderLeft: `2px solid ${C.gold}`, margin: "8px 0 12px 14px",
  },
  qAnswerTop: { color: C.lilac, fontSize: 12.5, marginBottom: 8 },
  sectionItem: {
    border: "1px solid", borderRadius: R.lg, overflow: "hidden",
    transition: "border-color .18s ease, background .18s ease",
  },
  sectionHead: {
    width: "100%", background: "none", border: "none", fontFamily: "inherit",
    textAlign: "left", padding: "17px 22px", display: "flex",
    alignItems: "center", gap: 16,
  },
  sectionNum: {
    fontFamily: FONT.serif, fontSize: 15, minWidth: 26,
    flexShrink: 0, textAlign: "center",
  },
  sectionTitle: { display: "block", fontSize: 15.5, fontWeight: 500, lineHeight: 1.35 },
  sectionLead: { display: "block", fontSize: 12.5, color: C.muted, marginTop: 3, lineHeight: 1.45 },
  sectionSign: { marginLeft: "auto", flexShrink: 0, display: "flex", alignItems: "center", gap: 10 },
  sectionBody: { padding: "0 22px 20px", borderTop: `1px solid ${C.border}` },
  slotBlock: { marginTop: 18 },
  slotHead: { display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 },
  slotArcana: {
    fontFamily: FONT.serif, fontSize: 22, color: C.gold, lineHeight: 1,
  },
  slotLabel: { color: C.white, fontSize: 14.5, fontWeight: 500 },
  slotArcName: { color: C.lilac, fontSize: 12.5 },
  slotText: {
    margin: 0, color: C.text, fontSize: 14.5, lineHeight: 1.62,
    whiteSpace: "pre-line", maxWidth: 760,
  },
  lockNote: {
    display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center",
    padding: "18px 22px 20px", borderTop: `1px solid ${C.border}`,
  },

  /* DEV-переключатель тарифа */
  devBar: {
    display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10,
    padding: "12px 18px", borderRadius: R.md, marginBottom: 26,
    background: "rgba(10,8,23,0.66)", border: `1px dashed ${C.borderHi}`,
  },
  devLabel: {
    fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase",
    color: C.lilac, marginRight: 4,
  },
  devHint: { fontSize: 12, color: C.muted, width: "100%", margin: 0 },
  devDivider: { width: 1, height: 22, background: C.border, margin: "0 4px" },

  /* ---------- тематические страницы ---------- */

  notice: {
    display: "flex", gap: 14, alignItems: "flex-start",
    padding: "16px 20px", borderRadius: R.lg, marginBottom: 24,
    background: "rgba(183,156,232,0.08)", border: `1px solid ${C.lilac}`,
  },
  noticeText: { margin: 0, color: C.text, fontSize: 13.5, lineHeight: 1.55 },

  /* переключатель уровней прогноза */
  switchRow: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 },

  /* календарь месяца */
  calGrid: {
    display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 6,
  },
  calHead: {
    fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase",
    color: C.muted, textAlign: "center", paddingBottom: 6,
  },
  calCell: {
    border: "1px solid", borderRadius: R.sm, padding: "8px 4px 9px",
    textAlign: "center", minHeight: 58,
    display: "flex", flexDirection: "column", justifyContent: "center", gap: 3,
  },
  calDay: { fontSize: 11, color: C.muted, lineHeight: 1 },
  calArc: { fontFamily: FONT.serif, fontSize: 19, lineHeight: 1 },

  /* ядра партнёров */
  coreGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 70px), 1fr))",
    gap: 8, marginTop: 14,
  },
  coreCell: {
    borderRadius: R.sm, border: `1px solid ${C.border}`, padding: "9px 4px",
    textAlign: "center", background: "rgba(10,8,23,0.45)",
  },
  coreCode: { display: "block", fontSize: 10, color: C.muted, letterSpacing: "0.08em" },
  coreVal: { display: "block", fontFamily: FONT.serif, fontSize: 20, color: C.white, marginTop: 3 },

  /* ═══════════ ЛИЧНЫЙ КАБИНЕТ ═══════════ */

  cabinet: { padding: "var(--cabY) var(--secX) var(--cabB)" },
  head: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    gap: 20, flexWrap: "wrap", marginBottom: 26,
  },
  cabH1: { fontFamily: FONT.serif, fontSize: 34, color: C.white, margin: 0, fontWeight: 600 },
  cabH2: { fontFamily: FONT.serif, fontSize: 24, color: C.white, margin: 0, fontWeight: 600 },
  sub: { color: C.muted, fontSize: 14, marginTop: 8, maxWidth: 560 },
  dim: { color: C.muted, fontSize: 14 },
  dimSm: { color: C.muted, fontSize: 12.5 },
  hint: { fontSize: 12.5, color: C.muted, margin: "11px 0 0", lineHeight: 1.5 },

  cabTabs: { display: "flex", gap: 4, borderBottom: `1px solid ${C.border}`, marginBottom: 26, flexWrap: "wrap" },
  cabTab: {
    background: "none", border: "none", borderBottom: "2px solid transparent",
    padding: "12px 18px", fontSize: 15, fontFamily: "inherit",
    transition: "all .16s ease", marginBottom: -1,
  },

  rowBetween: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    gap: 20, flexWrap: "wrap", marginBottom: 22,
  },
  meters: { display: "flex", gap: 26, flexWrap: "wrap" },
  meterTop: { display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 6 },
  track: { height: 5, borderRadius: 3, background: "rgba(183,156,232,.14)", overflow: "hidden" },
  fill: { height: "100%", borderRadius: 3, transition: "width .3s ease" },

  /* карточки матриц */
  pGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 330px), 1fr))", gap: 16 },
  pCard: {
    background: SURFACE.card, border: "1px solid", borderRadius: R.xl,
    padding: 20, display: "flex", flexDirection: "column", gap: 16, transition: "all .18s ease",
  },
  pTop: { display: "flex", gap: 14, alignItems: "flex-start" },
  pName: {
    color: C.white, fontSize: 18, fontFamily: FONT.serif,
    display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
  },
  selfTag: {
    fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: C.gold,
    border: `1px solid ${C.gold}`, borderRadius: R.pill, padding: "2px 8px",
  },
  lockTag: {
    fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: C.muted,
    border: `1px solid ${C.border}`, borderRadius: R.pill, padding: "2px 8px",
  },
  pMeta: { color: C.muted, fontSize: 12.5, marginTop: 3 },
  pArc: { display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" },
  arcChip: {
    width: 28, height: 28, borderRadius: 8, border: `1px solid ${C.border}`, color: C.text,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 13, fontFamily: FONT.serif,
  },
  pBtns: { display: "flex", gap: 8, flexWrap: "wrap" },
  addCard: {
    border: `1.5px dashed ${C.border}`, background: "transparent", borderRadius: R.xl,
    padding: 24, display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", gap: 8, color: C.muted, fontFamily: "inherit",
    fontSize: 14.5, minHeight: 200, transition: "all .18s ease",
  },
  addPlus: { fontSize: 30, color: C.borderHi, lineHeight: 1 },

  /* телеграм в карточке */
  tgBox: {
    background: "rgba(10,8,23,.5)", border: `1px solid ${C.border}`,
    borderRadius: R.md, padding: "12px 14px",
  },
  tgHead: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 },
  tgTitle: { display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: C.white },
  tgLink: { display: "flex", alignItems: "center", gap: 10, marginTop: 10, flexWrap: "wrap" },
  code: {
    fontSize: 11.5, color: C.lilac, background: "rgba(183,156,232,.1)",
    padding: "5px 9px", borderRadius: 7, fontFamily: "ui-monospace, Menlo, monospace",
    wordBreak: "break-all",
  },
  tgStatus: {
    display: "flex", alignItems: "center", gap: 8, marginTop: 9,
    fontSize: 12, color: C.muted, flexWrap: "wrap",
  },
  dot: { width: 7, height: 7, borderRadius: 4, flexShrink: 0 },
  switchTrack: {
    width: 40, height: 22, borderRadius: R.pill, border: "1px solid",
    position: "relative", transition: "all .18s ease", flexShrink: 0,
  },
  switchKnob: { position: "absolute", top: 2, width: 16, height: 16, borderRadius: "50%", transition: "left .18s ease" },

  /* лента прогнозов */
  feedDay: { fontSize: 11.5, letterSpacing: ".14em", textTransform: "uppercase", color: C.gold, marginBottom: 12 },
  feedGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))", gap: 14 },
  feedCard: { background: SURFACE.card, border: "1px solid", borderRadius: R.lg, padding: 18, transition: "all .18s ease" },
  feedTop: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10 },
  feedArc: {
    width: 42, height: 42, borderRadius: 12, border: `1px solid ${C.gold}`, color: C.gold,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 19, fontFamily: FONT.serif, flexShrink: 0,
  },
  feedWho: { color: C.white, fontSize: 15 },
  feedText: { margin: 0, fontSize: 13.5, color: C.text },
  archiveNote: {
    display: "flex", gap: 10, alignItems: "center", padding: "12px 16px",
    borderRadius: R.md, marginBottom: 20, fontSize: 13,
    background: "rgba(95,192,140,0.08)", border: `1px solid ${C.ok}`, color: C.text,
  },

  /* вкладка «Данные» */
  two: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))", gap: 16, alignItems: "start" },
  /* 280px — минимум, при котором подпись в поле не заезжает под кнопку
     «Активировать»: она внутри поля, а не рядом с ним. */
  half: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 16 },
  block: { background: SURFACE.card, border: `1px solid ${C.border}`, borderRadius: R.xl, padding: "22px 24px", transition: "all .18s ease" },
  blockHead: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap", marginBottom: 18 },
  blockTitle: { fontSize: 11.5, letterSpacing: ".15em", textTransform: "uppercase", color: C.gold, marginBottom: 16 },
  blockTitle2: { fontSize: 11.5, letterSpacing: ".15em", textTransform: "uppercase", color: C.gold, margin: "24px 0 14px" },
  field: { display: "flex", alignItems: "center", gap: 14, padding: "11px 0", borderBottom: `1px solid ${C.border}`, flexWrap: "wrap" },
  socials: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: 9 },
  social: {
    border: "1px solid", borderRadius: R.md, padding: "11px 13px", display: "flex",
    justifyContent: "space-between", alignItems: "center", gap: 8, fontSize: 13.5,
    background: "transparent", fontFamily: "inherit", transition: "all .16s ease",
  },
  idPill: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "5px 6px 5px 13px", borderRadius: R.pill,
    background: "rgba(10,8,23,0.7)", border: "1px solid rgba(228,190,114,0.38)",
  },
  idLabel: { fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: C.muted },
  idValue: { fontFamily: "monospace", fontSize: 14.5, letterSpacing: "0.05em", color: C.gold, lineHeight: 1, userSelect: "text" },
  inWrap: { position: "relative", display: "flex", alignItems: "center" },
  inField: {
    width: "100%", padding: "12px 126px 12px 14px", borderRadius: 12,
    background: "rgba(10,8,23,0.7)", border: `1px solid ${C.border}`,
    color: C.white, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box",
  },
  inAct: {
    position: "absolute", right: 5, top: "50%", transform: "translateY(-50%)",
    padding: "7px 14px", borderRadius: R.pill, border: "none",
    background: "rgba(228,190,114,0.14)", color: C.gold,
    fontSize: 12.5, fontWeight: 600, fontFamily: "inherit",
    whiteSpace: "nowrap", transition: "all .18s ease",
  },
  inIcon: { position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)" },
  refLink: {
    width: "100%", padding: "12px 46px 12px 14px", borderRadius: 12,
    background: "rgba(10,8,23,0.7)", border: "1px solid rgba(228,190,114,0.35)",
    color: C.gold, fontFamily: "monospace", fontSize: 13, boxSizing: "border-box",
    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", userSelect: "text",
  },
  refGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: 26, alignItems: "start" },
  refStats: { display: "flex", gap: 26, flexWrap: "wrap" },
  refNum: { display: "block", fontFamily: FONT.serif, fontSize: 24, color: C.gold, lineHeight: 1, marginBottom: 4 },
  delWrap: { display: "flex", justifyContent: "center", marginTop: 22 },
  delBtn: {
    padding: "10px 22px", borderRadius: R.pill,
    background: "rgba(230,138,176,0.08)", border: "1px solid rgba(230,138,176,0.4)",
    color: C.pink, fontSize: 13.5, fontFamily: "inherit",
    boxShadow: "0 0 18px -6px rgba(230,138,176,0.45)", transition: "all .2s ease",
  },

  /* тарифы */
  planNow: {
    display: "flex", flexWrap: "wrap", gap: 32, background: "rgba(31,24,65,.78)",
    border: `1px solid ${C.lilac}`, borderRadius: R.xl, padding: "26px 28px",
    alignItems: "flex-start", boxShadow: `0 26px 70px -40px ${C.lilac}`,
  },
  planBadge: {
    fontSize: 10, letterSpacing: ".14em", color: C.lilac, border: `1px solid ${C.lilac}`,
    borderRadius: R.pill, padding: "3px 10px", display: "inline-block", marginBottom: 12,
  },
  planNowName: { fontFamily: FONT.serif, fontSize: 26, color: C.white },
  planNowPrice: { fontSize: 20, color: C.gold, marginTop: 4, marginBottom: 8 },
  planBtns: { display: "flex", flexDirection: "column", gap: 10, marginLeft: "auto" },
  keepList: { display: "flex", flexDirection: "column", gap: 10 },
  keepRow: { display: "flex", alignItems: "center", gap: 10, fontSize: 14, flexWrap: "wrap" },
  histRow: {
    display: "flex", alignItems: "center", gap: 14, padding: "12px 0",
    borderBottom: `1px solid ${C.border}`, fontSize: 14, flexWrap: "wrap",
  },

  /* наставник */
  /* dvh, а не vh: на iOS адресная строка съедает часть vh, и поле ввода
     уезжает под клавиатуру. dvh считает живую высоту окна.
     height задан дважды намеренно — первая строка запасная для браузеров
     без dvh, вторая перекрывает её там, где dvh поддерживается. */
  chatPage: {
    display: "flex", flexDirection: "column", position: "relative",
    /* Из высоты окна вычитается мобильная шапка: на телефоне чат живёт
       под ней, и без вычитания поле ввода уезжает за нижний край. */
    height: "calc(100vh - var(--appTop))",
    minHeight: "calc(100dvh - var(--appTop))",
    maxHeight: "calc(100dvh - var(--appTop))",
  },
  chatTop: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: 16, padding: "16px var(--chatX)", flexShrink: 0,
  },
  chatTabs: { display: "flex", gap: 4 },
  chatTab: {
    padding: "8px 16px", borderRadius: R.pill, border: "none",
    fontSize: 13.5, fontFamily: "inherit", transition: "all .16s ease",
  },
  counter: { marginLeft: "auto", fontSize: 12.5 },
  chatCenter: { flex: 1, overflowY: "auto", padding: "28px var(--chatX) 20px", width: "100%", maxWidth: 820, margin: "0 auto" },
  chatH2: { fontFamily: FONT.serif, fontSize: 22, color: C.white, margin: "0 0 18px", fontWeight: 600 },
  intro: { textAlign: "center", padding: "26px 0 10px" },
  introIcon: {
    width: 62, height: 62, borderRadius: "50%", margin: "0 auto 20px",
    background: "rgba(228,190,114,0.1)", border: "1px solid rgba(228,190,114,0.35)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  introTitle: { fontFamily: FONT.serif, fontSize: 34, color: C.white, margin: "0 0 8px", fontWeight: 600 },
  introSub: { color: C.gold, fontSize: 15, marginBottom: 22 },
  introText: { maxWidth: 620, margin: "0 auto 14px", color: C.text, fontSize: 14.5, lineHeight: 1.65 },
  thread: { display: "flex", flexDirection: "column", gap: 14 },
  msg: { maxWidth: "78%", padding: "12px 16px", borderRadius: R.lg, border: "1px solid", fontSize: 14.5, whiteSpace: "pre-line" },
  histItem: {
    display: "flex", alignItems: "center", gap: 16, width: "100%",
    padding: "16px 18px", marginBottom: 10, borderRadius: 16,
    background: SURFACE.card, border: `1px solid ${C.border}`,
    fontFamily: "inherit", transition: "all .16s ease", textAlign: "left",
  },
  histTitle: { color: C.white, fontSize: 15, marginBottom: 5 },
  histLast: { color: C.muted, fontSize: 12.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  histMeta: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, flexShrink: 0 },
  histAbout: { fontSize: 11, color: C.lilac, border: `1px solid ${C.borderHi}`, borderRadius: R.pill, padding: "2px 9px" },
  composer: { flexShrink: 0, padding: "0 var(--chatX) 18px" },
  composerInner: { width: "100%", maxWidth: 820, margin: "0 auto" },
  aboutRow: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 10 },
  hints: { display: "flex", gap: 8, flexWrap: "wrap", margin: "14px 0" },
  inputBox: {
    display: "flex", alignItems: "flex-end", gap: 10, padding: 8,
    borderRadius: 20, background: "rgba(23,18,46,0.9)", border: `1px solid ${C.border}`,
  },
  chatArea: {
    flex: 1, background: "transparent", border: "none", resize: "none",
    color: C.white, fontSize: 15, fontFamily: "inherit", lineHeight: 1.5,
    padding: "10px 12px", maxHeight: 180, overflowY: "auto",
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: "50%", border: "none",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  chatNote: { fontSize: 11.5, color: C.muted, textAlign: "center", marginTop: 11 },

  /* модалки, подсказки, кнопки */
  overlay: {
    position: "fixed", inset: 0, background: "rgba(6,4,14,0.78)",
    backdropFilter: "blur(6px)", display: "flex",
    alignItems: "center", justifyContent: "center", padding: 24, zIndex: 100,
  },
  modal: { width: "min(520px, 100%)", padding: "26px 28px", borderRadius: R.xl, background: C.bgAlt, border: `1px solid ${C.borderHi}`, maxHeight: "90vh", overflowY: "auto" },
  modalHead: { display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 18 },
  closeBtn: { background: "transparent", border: `1px solid ${C.border}`, color: C.muted, width: 32, height: 32, borderRadius: R.sm, flexShrink: 0 },
  supRow: {
    display: "flex", alignItems: "center", gap: 14, width: "100%",
    padding: "14px 16px", marginBottom: 9, borderRadius: R.md,
    background: "rgba(23,18,46,0.7)", border: `1px solid ${C.border}`,
    fontFamily: "inherit", transition: "all .16s ease",
  },
  iconBtn: {
    position: "relative", background: "transparent", border: `1px solid ${C.border}`,
    color: C.muted, width: 38, height: 38, borderRadius: R.md,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, transition: "all .18s ease",
  },
  iconCopy: {
    position: "relative", background: "transparent", border: `1px solid ${C.border}`,
    color: C.muted, width: 28, height: 28, borderRadius: R.pill,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, transition: "all .18s ease",
  },
  exitBtn: {
    position: "relative", background: "transparent", border: "none", color: C.muted,
    width: 30, height: 30, borderRadius: R.sm,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, transition: "all .18s ease",
  },
  tip: {
    position: "absolute", bottom: "calc(100% + 8px)", right: 0, maxWidth: "60vw",
    background: C.cardHi, border: `1px solid ${C.borderHi}`, color: C.white,
    fontSize: 11.5, padding: "5px 10px", borderRadius: R.sm,
    whiteSpace: "nowrap", pointerEvents: "none", opacity: 0, transition: "opacity .16s ease",
  },
  btn: { padding: "12px 20px", borderRadius: R.md, fontSize: 14.5, fontWeight: 600, fontFamily: "inherit", border: "none", textAlign: "center" },
  btnSm: { padding: "9px 15px", borderRadius: R.md, fontSize: 13.5, fontWeight: 500, fontFamily: "inherit", border: "none", textAlign: "center" },
  linkBtn: {
    background: "none", border: "none", color: C.lilac, fontSize: 12.5,
    fontFamily: "inherit", textDecoration: "underline", textUnderlineOffset: 3, padding: 0,
  },
  userCard: { display: "flex", alignItems: "center", gap: 11 },
  avatar: {
    width: 38, height: 38, borderRadius: "50%", background: C.lilacBtn, color: C.ink,
    display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, flexShrink: 0,
  },
  userName: { color: C.white, fontSize: 14.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  userPlan: { color: C.gold, fontSize: 12 },
  checkRow: { display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13, color: C.text, marginTop: 12, textAlign: "left", background: "none", border: "none", fontFamily: "inherit", padding: 0, width: "100%" },
  checkBox: { width: 18, height: 18, borderRadius: 5, border: "1px solid", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 },

  /* ---------- сцена расчёта ---------- */

  theatre: {
    display: "flex", alignItems: "center", gap: 36, flexWrap: "wrap",
    justifyContent: "center", width: "100%", maxWidth: 820, margin: "0 auto",
  },
  theatreSteps: { display: "flex", flexDirection: "column", gap: 16, minWidth: 240 },
  theatreStep: {
    display: "flex", alignItems: "flex-start", gap: 12,
    fontSize: 15, lineHeight: 1.4, transition: "opacity .4s ease, color .4s ease",
  },
  theatreDot: {
    width: 9, height: 9, borderRadius: "50%", border: "1px solid",
    flexShrink: 0, marginTop: 6, transition: "all .3s ease",
  },
  theatreTrack: {
    display: "block", height: 2, marginTop: 8, borderRadius: 2,
    background: "rgba(183,156,232,0.16)", overflow: "hidden",
  },
  theatreFill: { display: "block", height: "100%", borderRadius: 2, background: C.gold },

  /* ═══════════ ТЕЛЕФОН ═══════════ */

  /* На телефоне макет колонкой: шапка сверху, содержимое под ней.
     Меню выезжает поверх и в поток не попадает. */
  rootPhone: {
    display: "flex", flexDirection: "column", minHeight: "100vh",
    background: C.bg, color: C.text, fontFamily: FONT.sans,
    fontSize: 15, lineHeight: 1.6, position: "relative",
    width: "100%", overflowX: "hidden",
  },
  topBar: {
    display: "grid", gridTemplateColumns: "44px 1fr auto", alignItems: "center",
    gap: 8, height: 56, padding: "0 10px", position: "sticky", top: 0, zIndex: 20,
    background: "rgba(13,10,30,0.94)", backdropFilter: "blur(12px)",
    borderBottom: `1px solid ${C.border}`,
  },
  topBtn: {
    width: 44, height: 44, borderRadius: R.md, border: "none",
    background: "transparent", color: C.text,
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  topActions: { display: "flex", alignItems: "center", gap: 6 },
  /**
   * Десктоп: своей шапки нет, поэтому блок висит поверх содержимого.
   * Подложка обязательна: при прокрутке под кнопками проезжает текст,
   * и без неё они читаются как случайно наложенные, а не как накладные.
   */
  topFloat: {
    position: "fixed", top: 14, right: 16, zIndex: 15,
    display: "flex", alignItems: "center", gap: 6,
    padding: 5, borderRadius: R.pill,
    background: "rgba(13,10,30,0.86)", backdropFilter: "blur(10px)",
    border: `1px solid ${C.border}`,
  },
  backdrop: {
    position: "fixed", inset: 0, zIndex: 40,
    background: "rgba(6,4,14,0.7)", backdropFilter: "blur(3px)",
    transition: "opacity .22s ease",
  },
  drawer: {
    position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 41,
    width: "min(288px, 86vw)", display: "flex", flexDirection: "column",
    background: "rgba(13,10,30,0.98)", borderRight: `1px solid ${C.border}`,
    transition: "transform .24s cubic-bezier(.4,0,.2,1)", willChange: "transform",
  },
  drawerTop: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 10px 0 16px", height: 56, borderBottom: `1px solid ${C.border}`, flexShrink: 0,
  },

  /* Карточка платежа вместо строки таблицы. */
  histCard: {
    border: `1px solid ${C.border}`, borderRadius: R.md, padding: "14px 16px",
    marginBottom: 10, display: "flex", flexDirection: "column", gap: 6,
  },
  /* ---- исследовательские переходы ----
     Карточка в конце сферы и блок «кого посмотрим дальше». */

  stepCard: {
    display: "flex", gap: 16, alignItems: "flex-start",
    marginTop: 12, padding: "18px 20px", borderRadius: R.lg,
    border: `1px solid ${C.border}`, background: "rgba(10,8,23,0.45)",
  },
  stepHead: { fontFamily: FONT.serif, fontSize: 17.5, color: C.white, lineHeight: 1.3 },
  stepText: { fontSize: 14, color: C.text, lineHeight: 1.6, margin: "8px 0 0" },
  stepFieldLabel: {
    display: "block", fontSize: 10.5, letterSpacing: "0.13em",
    textTransform: "uppercase", color: C.muted, margin: "16px 0 7px",
  },
  stepNote: { fontSize: 12.5, color: C.muted, marginTop: 10, lineHeight: 1.5 },
  stepArrow: { transition: "transform .16s ease", flexShrink: 0 },

  nextTiles: {
    display: "grid", gap: 12,
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))",
  },
  nextTile: {
    display: "flex", alignItems: "center", gap: 13, textAlign: "left",
    padding: "14px 16px", borderRadius: R.lg, border: "1px solid",
    fontFamily: "inherit", width: "100%",
    transition: "border-color .18s ease, background .18s ease, box-shadow .18s ease",
  },
  nextTileName: { fontSize: 15.5, fontWeight: 600, lineHeight: 1.25 },
  nextTileSub: { fontSize: 12.5, color: C.muted, marginTop: 2 },
  nextForm: {
    marginTop: 14, padding: "18px 20px", borderRadius: R.lg,
    border: `1px solid ${C.borderHi}`, background: SURFACE.cardHi,
  },
  /* Кнопка возврата к разбору вверху страницы, куда человека увели. */
  backLink: {
    display: "inline-flex", alignItems: "center", gap: 10,
    padding: "11px 18px", borderRadius: R.pill, marginBottom: 18,
    border: `1px solid ${C.gold}`, background: "rgba(228,190,114,0.10)",
    color: C.white, fontSize: 14.5, fontWeight: 600, fontFamily: "inherit",
    transition: "background .18s ease, box-shadow .18s ease",
  },

  /* Строка последних расчётов над формой на главной. */
  recentRow: {
    display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8,
    margin: "16px 0 4px",
  },
  recentChip: {
    display: "inline-flex", alignItems: "center", gap: 2,
    borderRadius: R.pill, border: `1px solid ${C.border}`,
    background: "rgba(10,8,23,0.5)", overflow: "hidden",
  },
  recentDate: {
    padding: "7px 4px 7px 12px", fontSize: 13, color: C.text,
    fontFamily: "inherit", background: "none", border: "none",
    transition: "color .16s ease",
  },
  recentDrop: {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 26, alignSelf: "stretch", padding: 0,
    background: "none", border: "none", color: C.faint,
    fontSize: 15, lineHeight: 1, fontFamily: "inherit",
    transition: "color .16s ease",
  },
  /* Плашка-предупреждение вверху разбора: детская, здоровье, мама и ребёнок. */
  typeNote: {
    display: "flex", gap: 12, alignItems: "flex-start",
    padding: "13px 16px", borderRadius: R.md, margin: "0 0 20px",
    border: `1px solid rgba(230,138,176,0.4)`, background: "rgba(230,138,176,0.08)",
    color: C.text, fontSize: 13.5, lineHeight: 1.55, maxWidth: 760,
  },
  typeNoteMark: {
    width: 20, height: 20, flexShrink: 0, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    background: C.pink, color: C.ink, fontSize: 13, fontWeight: 700,
  },

  /* «Показать всю матрицу» — внизу каждого разбора, кроме самой матрицы. */
  fullMatrix: {
    display: "flex", flexWrap: "wrap", gap: 26, alignItems: "center",
    padding: "28px 30px", borderRadius: R.xl,
    border: `1px solid ${C.gold}`, background: "rgba(228,190,114,0.07)",
  },
  fullMatrixCta: {
    display: "flex", flexDirection: "column", gap: 10,
    marginLeft: "auto", minWidth: 240,
  },
  /* Карусель типов разбора в форме расчёта. */
  calcCarousel: { position: "relative", margin: "0 -4px 4px" },
  calcTrack: {
    display: "flex", flexWrap: "nowrap", gap: 8,
    overflowX: "auto", overflowY: "hidden",
    padding: "2px 4px 8px",
    scrollbarWidth: "none", WebkitOverflowScrolling: "touch",
    scrollSnapType: "x proximity", scrollPaddingLeft: 4,
  },
  calcTab: {
    display: "inline-flex", alignItems: "center", flexShrink: 0,
    padding: "9px 17px", borderRadius: R.pill, border: "1px solid",
    fontSize: 15, fontFamily: "inherit", whiteSpace: "nowrap",
    scrollSnapAlign: "start",
    transition: "background .16s ease, border-color .16s ease, color .16s ease",
  },
  calcFade: {
    position: "absolute", top: 0, bottom: 8, width: 42,
    pointerEvents: "none", transition: "opacity .2s ease",
  },
  calcArrow: {
    position: "absolute", top: "50%", marginTop: -20,
    width: 32, height: 32, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "rgba(13,10,30,0.92)", border: `1px solid ${C.border}`,
    color: C.white, fontFamily: "inherit", padding: 0,
    transition: "opacity .18s ease, border-color .16s ease",
  },
  /* Пейволл под списком сфер: говорит про дату, а не про раздел. */
  paywall: {
    display: "flex", flexWrap: "wrap", gap: 22, alignItems: "center",
    marginTop: 18, padding: "22px 24px", borderRadius: R.xl,
    border: `1px solid ${C.borderHi}`, background: SURFACE.cardHi,
  },
  paywallTitle: { fontFamily: FONT.serif, fontSize: 20, color: C.white, lineHeight: 1.3 },
};
