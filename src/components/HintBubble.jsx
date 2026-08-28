import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { Spark } from "./Icons.jsx";
import { useIsPhone, TAP } from "../theme/responsive.js";
import { useHintContext, useHintState, pickHint, markShown } from "../lib/hints.js";

/**
 * ОБЛАЧКО-ПОДСКАЗКА
 * =================
 * Карточка справа внизу с одной мыслью по матрице и переходом дальше.
 * Живёт в макете, но появляется только там, где страница сообщила о себе
 * (lib/hints.js, setHintContext): в кабинете, чате и на тарифах никто
 * ничего не сообщает, и подсказки там не бывает.
 *
 * ПОДСКАЗКА НЕ ПЕРЕБИВАЕТ ЧТЕНИЕ. Пока человек прокручивает страницу —
 * молчим. Первая появляется через 90 секунд и только после десяти секунд
 * без прокрутки. Следующая — не раньше чем через пять минут и только
 * если человек за это время что-то делал. Больше трёх за день не бывает.
 *
 * Для проверки на предпросмотре есть ?hint=now — тогда ожидание
 * пропускается и подсказка появляется сразу.
 */

const FIRST_DELAY = 90_000;      // сколько человек читает, прежде чем его трогать
const STILL_FOR = 10_000;        // сколько он должен не прокручивать
const NEXT_DELAY = 300_000;      // пауза между подсказками
const FORM_DELAY = 120_000;      // застрявшая форма на главной
const MAX_PER_DAY = 3;

export default function HintBubble() {
  const ctx = useHintContext();
  const state = useHintState();
  const isPhone = useIsPhone();

  const [hint, setHint] = useState(null);
  const [shown, setShown] = useState(false);   // для плавного появления

  /* Замок на одно срабатывание. Отметка «показано» меняет состояние
     хранилища, эффект перезапускается — и без замка успевал бы сжечь
     подряд несколько подсказок, показав только последнюю. */
  const firing = useRef(false);
  const openedAt = useRef(Date.now());
  const lastScroll = useRef(Date.now());
  const lastAction = useRef(Date.now());
  const lastHintAt = useRef(0);

  const now = useRef(Date.now());
  const key = ctx ? ctx.key : null;
  const instant = typeof window !== "undefined" && window.location.search.includes("hint=now");

  /* Новая страница — отсчёт заново. */
  useEffect(() => {
    openedAt.current = Date.now();
    lastScroll.current = Date.now();
    firing.current = false;
    setHint(null);
    setShown(false);
  }, [key]);

  /* Прокрутка означает «человек ещё читает», нажатия — «человек живой». */
  useEffect(() => {
    const onScroll = () => { lastScroll.current = Date.now(); lastAction.current = Date.now(); };
    const onAction = () => { lastAction.current = Date.now(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("click", onAction);
    window.addEventListener("keydown", onAction);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("click", onAction);
      window.removeEventListener("keydown", onAction);
    };
  }, []);

  const ready = Boolean(ctx) && !state.off && state.count < MAX_PER_DAY && !hint;

  useEffect(() => {
    if (!ready) return undefined;

    const tick = () => {
      const t = Date.now();
      now.current = t;
      const first = lastHintAt.current === 0;
      const delay = ctx.kind === "form" ? FORM_DELAY : FIRST_DELAY;

      const waited = t - openedAt.current >= delay;
      const still = t - lastScroll.current >= STILL_FOR;
      const paused = t - lastHintAt.current >= NEXT_DELAY;
      const active = lastAction.current > lastHintAt.current;

      const due = instant || (first ? waited && still : paused && active && still);
      if (!due) return;
      if (ctx.kind === "form" && ctx.touched) return;   // форму уже заполняют

      if (firing.current) return;
      const picked = pickHint(ctx, state);
      if (!picked) return;

      firing.current = true;
      lastHintAt.current = t;
      markShown(picked.id);
      setHint(picked);
      requestAnimationFrame(() => setShown(true));
    };

    const timer = setInterval(tick, 2000);
    tick();
    return () => clearInterval(timer);
  }, [ready, ctx, state, instant]);

  /* Ушли со страницы расчёта — облачко уходит вместе с ней.
     Именно по пропаже контекста, а не по смене адреса: сброс по адресу
     срабатывал и при первом появлении, и подсказка сгорала, не показавшись. */
  useEffect(() => {
    if (!ctx) { setHint(null); setShown(false); firing.current = false; }
  }, [ctx]);

  if (!hint) return null;

  const close = () => {
    setShown(false);
    setTimeout(() => { setHint(null); firing.current = false; }, 220);
  };

  const goAnchor = () => {
    const node = document.getElementById(hint.cta.anchor);
    if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
    close();
  };

  return (
    <aside style={{
      ...S.hintCard,
      ...(isPhone ? { left: 16, right: 16, width: "auto", bottom: 16 } : null),
      opacity: shown ? 1 : 0,
      transform: shown ? "translateY(0)" : "translateY(16px)",
    }}>
      <button className="hintClose" onClick={close} aria-label="Больше не показывать эту подсказку"
        style={S.hintClose}>×</button>

      <div style={S.hintBody}>
        <span style={S.hintIcon}>
          {hint.arcana ? <span style={S.hintNum}>{hint.arcana}</span> : <Spark size={17} />}
        </span>
        <div style={{ minWidth: 0 }}>
          <p style={S.hintText}>{hint.text}</p>
          {hint.cta && (hint.cta.anchor ? (
            <button className="link" style={{ ...S.link, marginTop: 12, minHeight: TAP, textAlign: "left" }}
              onClick={goAnchor}>{hint.cta.label} →</button>
          ) : (
            <Link to={hint.cta.to} onClick={close} className="link"
              style={{ ...S.link, display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, minHeight: TAP }}>
              {hint.cta.label} →
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
