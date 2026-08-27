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

  side: {
    background: "rgba(13,10,30,0.9)", backdropFilter: "blur(12px)",
    borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column",
    position: "sticky", top: 0, height: "100vh",
    transition: "width .24s cubic-bezier(.4,0,.2,1)", flexShrink: 0, zIndex: 5,
  },
  sideTop: {
    display: "flex", alignItems: "center", padding: "0 16px",
    borderBottom: `1px solid ${C.border}`, height: 74,
  },
  logo: { display: "flex", alignItems: "center", gap: 11 },
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
  sideBottom: { padding: 14, borderTop: `1px solid ${C.border}` },
  loginBtn: {
    width: "100%", padding: "12px 14px", borderRadius: R.md,
    fontSize: 14.5, fontFamily: "inherit", border: "none",
  },

  main: { flex: 1, minWidth: 0, position: "relative", zIndex: 2 },
  section: { padding: "62px 52px", position: "relative" },

  heroGrid: {
    display: "grid", width: "100%",
    gridTemplateColumns: "minmax(300px, 1fr) minmax(330px, 440px)",
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
  tabs: { display: "flex", flexWrap: "wrap", gap: 7 },
  chip: {
    padding: "7px 13px", borderRadius: R.pill, fontSize: 12.5,
    border: "1px solid", fontFamily: "inherit", transition: "all .16s ease",
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
    width: "100%", padding: "10px 13px", borderRadius: R.md,
    background: "rgba(10,8,23,0.72)", border: `1px solid ${C.border}`,
    color: C.white, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box",
  },
  dateRow: { display: "grid", gridTemplateColumns: "1fr 1.1fr 1fr", gap: 8 },
  select: {
    width: "100%", padding: "10px 9px", borderRadius: R.md,
    background: "rgba(10,8,23,0.72)", border: `1px solid ${C.border}`,
    color: C.white, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box",
  },
  genderRow: { display: "flex", gap: 6 },
  gender: {
    width: 42, padding: "10px 0", borderRadius: R.md, fontSize: 13.5,
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
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))",
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

  layerRow: { display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 6 },
  layerChip: {
    display: "flex", alignItems: "center", gap: 7,
    padding: "6px 12px", borderRadius: R.pill, fontSize: 11.5,
    border: "1px solid", fontFamily: "inherit", transition: "all .16s ease",
  },
  layerDot: {
    width: 7, height: 7, borderRadius: 4, border: "1px solid",
    flexShrink: 0, transition: "all .16s ease",
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
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))", gap: 16,
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
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(158px, 1fr))", gap: 12,
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
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
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
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
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
    borderTop: `1px solid ${C.border}`, padding: "50px 52px 36px",
    background: "rgba(15,11,32,0.92)",
  },
  footGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 36 },
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
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14,
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
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14,
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

  /* 25 разделов */
  sectionsWrap: { display: "flex", flexDirection: "column", gap: 10 },
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
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(70px, 1fr))",
    gap: 8, marginTop: 14,
  },
  coreCell: {
    borderRadius: R.sm, border: `1px solid ${C.border}`, padding: "9px 4px",
    textAlign: "center", background: "rgba(10,8,23,0.45)",
  },
  coreCode: { display: "block", fontSize: 10, color: C.muted, letterSpacing: "0.08em" },
  coreVal: { display: "block", fontFamily: FONT.serif, fontSize: 20, color: C.white, marginTop: 3 },
};
