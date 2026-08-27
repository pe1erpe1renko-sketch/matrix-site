import React from "react";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { ARCANA_NAMES } from "../lib/prompts.js";

/**
 * ЧЕТЫРЕ УРОВНЯ ПРЕДНАЗНАЧЕНИЯ
 * ============================
 * Формулы посчитаны движком, здесь только показ. Под каждым числом
 * подписано, из чего оно сложилось: человеку важно видеть, что это
 * арифметика от его даты, а не выдумка.
 *
 * Планетарное = духовная гармония + социализация. Это правило
 * зафиксировано в CLAUDE.md и пересмотру не подлежит.
 */
export default function PurposeGrid({ purpose }) {
  const levels = [
    { ...purpose.personal,  formula: `Небо ${purpose.personal.sky} + Земля ${purpose.personal.earth}` },
    { ...purpose.social,    formula: `Мужская линия ${purpose.social.male} + женская ${purpose.social.female}` },
    { ...purpose.spiritual, formula: `Поиск себя ${purpose.personal.result} + социализация ${purpose.social.result}` },
    { ...purpose.planetary, formula: `Духовная гармония ${purpose.spiritual.result} + социализация ${purpose.social.result}` },
  ];

  return (
    <div style={S.purposeGrid}>
      {levels.map((level) => (
        <div key={level.title} className="card" style={S.purposeCard}>
          <span style={S.purposeVal}>{level.result}</span>
          <div style={S.purposeTitle}>{level.title}</div>
          <p style={S.purposeHint}>{level.hint}</p>
          <div style={S.purposeFormula}>
            <span style={{ color: C.lilac }}>{ARCANA_NAMES[level.result]}</span>
            <span style={{ color: C.muted }}> · {level.formula}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
