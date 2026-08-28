import React, { useState, useEffect } from "react";
import { C, FONT } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { useIsPhone } from "../theme/responsive.js";

/**
 * СЦЕНА РАСЧЁТА
 * =============
 * Короткий момент перед выдачей результата: строки появляются одна
 * за другой, а октаграмма собирается — сначала контур, потом линии,
 * потом числа по одному.
 *
 * ЗАЧЕМ. Расчёт занимает миллисекунды, и мгновенно вывалившийся экран
 * из шестидесяти чисел не читается как работа. Две с половиной секунды
 * показывают, что именно посчитано, и дают числам появиться по порядку.
 *
 * ЖЁСТКИЕ РАМКИ: сцена длится 2,5 секунды и не показывается второй раз
 * для той же матрицы (см. useCalcTheatre). Красивое, но повторяющееся
 * ожидание превращается в задержку.
 *
 * Числа НАСТОЯЩИЕ, из готовой матрицы: к концу сцены схема собрана ровно
 * такой, какой человек увидит её в результате.
 */

const STEPS = [
  "Соединяюсь с полем вашей матрицы…",
  "Рассчитываю центральный аркан…",
  "Раскладываю числа по точкам октаграммы…",
  "Собираю чакральную таблицу…",
];

export const STEP_MS = 700;
export const TOTAL_MS = STEPS.length * STEP_MS;   // 2800 мс от первой строки до конца

const ORDER = ["W", "NW", "N", "NE", "E", "SE", "S", "SW"];
const ANG = { W: 180, NW: 135, N: 90, NE: 45, E: 0, SE: -45, S: -90, SW: -135 };
const CX = 150, CY = 150, R0 = 104;

const at = (dir, k = 1) => {
  const a = (ANG[dir] * Math.PI) / 180;
  return [CX + R0 * k * Math.cos(a), CY - R0 * k * Math.sin(a)];
};

export default function CalcTheatre({ matrix, onDone }) {
  const isPhone = useIsPhone();
  const step = useTicker(STEPS.length, STEP_MS);

  useEffect(() => {
    const timer = setTimeout(onDone, TOTAL_MS);
    return () => clearTimeout(timer);
  }, [onDone]);

  /* Числа появляются по одному во второй половине сцены — к финалу
     схема собрана целиком. */
  const shown = Math.min(8, Math.max(0, Math.round(((step + 1) / STEPS.length) * 8)));

  return (
    <section style={{ ...S.section, minHeight: "70vh", display: "flex", alignItems: "center" }}>
      <div style={S.theatre}>
        <svg viewBox="0 0 300 300" style={{ width: isPhone ? 210 : 270, height: "auto", flexShrink: 0 }}
          aria-hidden="true">
          {/* Подложка: на фоне крутится воронка из октаграмм, и без неё
              собираемая схема с ней сливается. */}
          <circle cx={CX} cy={CY} r={R0 + 26} fill="rgba(10,8,23,0.72)" />
          <circle cx={CX} cy={CY} r={R0 + 26} fill="none" stroke={C.border} strokeWidth="0.8" opacity="0.5" />

          {/* контур появляется сразу */}
          <polygon points={ORDER.map((k) => at(k).join(",")).join(" ")}
            fill="none" stroke={C.borderHi} strokeWidth="1.3"
            style={{ opacity: step >= 0 ? 1 : 0, transition: "opacity .5s ease" }} />

          {/* линии — со второго шага */}
          <g style={{ opacity: step >= 1 ? 1 : 0, transition: "opacity .6s ease" }}>
            {ORDER.map((k, i) => {
              const [x, y] = at(k);
              const [x2, y2] = at(ORDER[(i + 3) % 8]);
              return (
                <g key={k}>
                  <line x1={x} y1={y} x2={CX} y2={CY} stroke={C.borderHi} strokeWidth="0.9" />
                  <line x1={x} y1={y} x2={x2} y2={y2} stroke={C.borderHi} strokeWidth="0.7" opacity="0.55" />
                </g>
              );
            })}
          </g>

          {/* центр — со второго шага, он же «центральный аркан» из строки */}
          <g style={{ opacity: step >= 1 ? 1 : 0, transition: "opacity .5s ease" }}>
            <circle cx={CX} cy={CY} r="24" fill={C.cardHi} stroke={C.white} strokeWidth="1.4" />
            <text x={CX} y={CY} textAnchor="middle" dominantBaseline="central"
              fill={C.white} fontSize="20" fontFamily={FONT.serif}>{matrix.core.C}</text>
          </g>

          {/* числа по одному */}
          {ORDER.map((k, i) => {
            const [x, y] = at(k);
            const visible = i < shown;
            const main = ["W", "N", "E", "S"].includes(k);
            return (
              <g key={"p" + k} style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "scale(1)" : "scale(0.6)",
                transformOrigin: `${x}px ${y}px`,
                transition: "opacity .35s ease, transform .35s cubic-bezier(.2,1.4,.5,1)",
              }}>
                <circle cx={x} cy={y} r={main ? 18 : 16} fill={C.bg}
                  stroke={main ? C.gold : C.lilac} strokeWidth="1.3" />
                <text x={x} y={y} textAnchor="middle" dominantBaseline="central"
                  fill={main ? C.gold : C.lilac} fontSize={main ? 15 : 13}
                  fontFamily={FONT.serif}>{matrix.core[k]}</text>
              </g>
            );
          })}
        </svg>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={S.eyebrow}>Идёт расчёт</div>
          <div style={S.theatreSteps}>
            {STEPS.map((line, i) => {
              const state = i < step ? "done" : i === step ? "now" : "wait";
              return (
                <div key={line} style={{
                  ...S.theatreStep,
                  opacity: state === "wait" ? 0.3 : 1,
                  color: state === "now" ? C.white : C.text,
                }}>
                  <span style={{
                    ...S.theatreDot,
                    background: state === "done" ? C.gold : "transparent",
                    borderColor: state === "wait" ? C.border : C.gold,
                  }} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    {line}
                    {state !== "wait" && (
                      <span style={S.theatreTrack}>
                        <span className={state === "now" ? "theatreRun" : undefined} style={{
                          ...S.theatreFill,
                          width: state === "done" ? "100%" : undefined,
                        }} />
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Счётчик шагов: 0, 1, 2… с заданным интервалом. */
function useTicker(count, everyMs) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (step >= count - 1) return undefined;
    const timer = setTimeout(() => setStep(step + 1), everyMs);
    return () => clearTimeout(timer);
  }, [step, count, everyMs]);
  return step;
}
