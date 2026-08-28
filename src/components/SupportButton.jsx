import React, { useState, useEffect, useRef } from "react";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { useAccount } from "../lib/account.js";
import { TAP } from "../theme/responsive.js";

/**
 * ПОДДЕРЖКА
 * =========
 * Три способа связи — это выпадающая панель под значком, а не окно
 * на весь экран: три ссылки не стоят затемнения и полной остановки
 * страницы. Человек глянул, куда писать, и вернулся к своему делу.
 *
 * ID АККАУНТА в первой строке: назвав номер, человек находится в поддержке
 * сразу, без «уточните почту, с которой вы регистрировались». Гостю эту
 * строку не показываем — заполнить её нечем.
 *
 * Закрывается тремя способами: нажатием вне панели, клавишей Esc
 * и повторным нажатием на значок.
 */

const WAYS = [
  { name: "Telegram", value: "@matrika_support", note: "отвечаем быстрее всего", href: "https://t.me/matrika_support" },
  { name: "MAX", value: "@matrika", note: "", href: null },
  { name: "Почта", value: "help@matrika.ru", note: "для чеков и возвратов", href: "mailto:help@matrika.ru" },
];

export default function SupportButton() {
  const account = useAccount();
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const wrap = useRef(null);

  /* Появление задаём состоянием, а не классом: прозрачность и сдвиг
     стоят во встроенном стиле, а его правило из таблицы не перебьёт. */
  useEffect(() => {
    if (!open) { setShown(false); return undefined; }
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /*
   * Нажатие мимо панели закрывает её. Слушаем документ, а не кладём
   * поверх страницы прозрачную заглушку: в шапке стоит размытие фона
   * (backdrop-filter), а оно делает шапку системой координат для всего
   * position: fixed внутри неё — заглушка растянулась бы по шапке,
   * а не по экрану. Заодно значок остаётся открытым для нажатия,
   * и повторное нажатие честно закрывает панель.
   */
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (wrap.current && !wrap.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  return (
    <div ref={wrap} style={{ position: "relative" }}>
      <button className="iconBtn" style={S.iconBtn} aria-label="Поддержка"
        aria-expanded={open} onClick={() => setOpen(!open)}>
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9.2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9.3 9.2a2.8 2.8 0 1 1 3.5 2.7c-.5.15-.8.6-.8 1.1v.6"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="16.6" r="1.05" fill="currentColor" />
        </svg>
        {!open && <span className="tip" style={S.tip}>Поддержка</span>}
      </button>

      {open && (
        <div style={{
          ...S.supPanel,
          opacity: shown ? 1 : 0,
          transform: shown ? "translateY(0)" : "translateY(-8px)",
        }}>
          <div style={S.blockTitle}>Поддержка</div>

          {account.signedIn && account.id && (
            <p style={{ ...S.hint, margin: "0 0 12px" }}>
              Назовите ID аккаунта <b style={{ color: C.gold }}>{account.id}</b> — так найдём вас сразу.
            </p>
          )}

          {WAYS.map((way) => {
            const content = (
              <>
                <span style={{ color: C.white, fontSize: 14, minWidth: 66, textAlign: "left" }}>{way.name}</span>
                <span style={{ color: C.lilac, fontSize: 13.5, flex: 1, textAlign: "left", minWidth: 0 }}>
                  {way.value}
                </span>
              </>
            );
            const style = { ...S.supRow, marginBottom: 8, minHeight: TAP, padding: "10px 13px" };
            return way.href ? (
              <a key={way.name} className="supRow" style={style} href={way.href}
                target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>{content}</a>
            ) : (
              <div key={way.name} className="supRow" style={style}>{content}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}
