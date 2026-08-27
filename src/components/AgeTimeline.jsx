import React from "react";
import { C, FONT } from "../theme/tokens.js";

/**
 * ВОЗРАСТНАЯ ШКАЛА 0–80
 * =====================
 * Восемь внешних точек матрицы становятся вехами по десять лет.
 * Показываем вехи; между ними движок дробит шкалу до отрезков в 2,5 года —
 * именно из них берётся аркан текущего периода, а он входит в аркан дня.
 *
 * Метка «сейчас» ставится по возрасту из today.age. Прожитая часть
 * шкалы золотится, будущая остаётся приглушённой.
 */
export default function AgeTimeline({ timeline, age }) {
  const W = 900, H = 128, padX = 34;
  const span = W - padX * 2;
  const xOf = (years) => padX + (Math.max(0, Math.min(80, years)) / 80) * span;

  /* Вехи по десять лет + замыкающая точка на 80 годах. */
  const decades = timeline.filter((p) => p.kind === "decade");
  const marks = [...decades, { age: 80, arcana: decades[0].arcana }];
  const nowX = xOf(age);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
      <line x1={padX} y1={64} x2={W - padX} y2={64} stroke={C.border} strokeWidth="1.5" />
      <line x1={padX} y1={64} x2={nowX} y2={64} stroke={C.gold} strokeWidth="1.5" opacity="0.75" />

      {marks.map((point, i) => {
        const x = xOf(point.age);
        const passed = point.age <= age;
        return (
          <g key={i}>
            <circle cx={x} cy={64} r="17" fill={C.bg}
              stroke={passed ? C.gold : C.borderHi} strokeWidth="1.3" />
            <text x={x} y={64} textAnchor="middle" dominantBaseline="central"
              fill={passed ? C.gold : C.text} fontSize="14" fontFamily={FONT.serif}>
              {point.arcana}
            </text>
            <text x={x} y={100} textAnchor="middle" fill={C.muted} fontSize="11">{point.age}</text>
          </g>
        );
      })}

      <g>
        <line x1={nowX} y1={20} x2={nowX} y2={44} stroke={C.lilac} strokeWidth="1.4" strokeDasharray="3 3" />
        <circle cx={nowX} cy={16} r="4" fill={C.lilac} />
        <text x={nowX} y={8} textAnchor="middle" fill={C.lilac} fontSize="11.5">сейчас</text>
      </g>
    </svg>
  );
}
