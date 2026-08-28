import React from "react";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";

/**
 * ПРЕДУПРЕЖДЕНИЕ ТИПА РАЗБОРА
 * ===========================
 * Детская матрица, здоровье и «мама и ребёнок» говорят о вещах, где
 * легко принять карту за заключение. Текст предупреждения лежит в поле
 * note у типа разбора (lib/contentPositions.js) и показывается вверху
 * страницы заметной плашкой, а не сноской внизу: снизу его не прочитают.
 *
 * Рамки формулировок заданы в CLAUDE.md, раздел 5: без диагнозов,
 * без отговаривания от врача.
 */
export default function TypeNote({ note, children }) {
  if (!note && !children) return null;

  return (
    <div style={S.typeNote}>
      <span style={S.typeNoteMark} aria-hidden="true">!</span>
      <span>
        {note && <b style={{ color: C.white }}>{note}</b>}
        {note && children ? " " : null}
        {children}
      </span>
    </div>
  );
}
