import React from "react";
import { C, R } from "../theme/tokens.js";
import { S } from "../theme/styles.js";

/**
 * ЧАКРАЛЬНАЯ ТАБЛИЦА
 * ==================
 * Семь строк, три колонки. Физика — горизонтальная ось матрицы,
 * энергия — вертикальная, эмоции — их сумма. Итог внизу — сумма колонки,
 * приведённая к аркану.
 *
 * Все числа приходят готовыми из calculateMatrix().chakras: здесь только
 * показ. Считать что-либо в компоненте нельзя — методика закрыта
 * и живёт целиком в движке.
 */

const BAR = { physics: C.gold, energy: C.lilac, emotions: C.pink };
const COLUMNS = [
  { key: "physics",  short: "Ф",  label: "физика" },
  { key: "energy",   short: "Э",  label: "энергия" },
  { key: "emotions", short: "Эм", label: "эмоции" },
];

export default function ChakraTable({ chakras }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      {/* Легенда вынесена отдельной строкой над таблицей: внутри сетки
          она попадала в узкую колонку и налезала на заголовки Ф/Э/Эм. */}
      <div style={{ ...S.chkLegend, flex: "0 0 auto", marginBottom: 8 }}>
        {COLUMNS.map((col) => (
          <span key={col.key} style={S.chkLeg}>
            <span style={{ ...S.chkLegDot, background: BAR[col.key] }} />{col.label}
          </span>
        ))}
      </div>

      <div style={{ ...S.chkRow, borderBottom: `1px solid ${C.border}`, paddingBottom: 10, flex: "0 0 auto" }}>
        <span style={S.chkName} />
        <span />
        {COLUMNS.map((col) => <span key={col.key} style={S.chkHead}>{col.short}</span>)}
      </div>

      {chakras.rows.map((row) => (
        <div key={row.key} className="chk" style={{ ...S.chkRow, flex: "1 1 0", minHeight: 54 }}>
          <span style={S.chkName}>
            <span style={{ ...S.chkBar, background: row.color }} />
            <span>
              <span style={{ display: "block", color: C.white, fontSize: 14.5 }}>{row.name}</span>
              <span style={{ display: "block", color: C.muted, fontSize: 11.5 }}>{row.sphere}</span>
            </span>
          </span>
          <span style={S.chkGauge}>
            {COLUMNS.map((col) => (
              <span key={col.key} style={S.chkTrack}>
                <span style={{
                  ...S.chkFill,
                  width: (row[col.key] / 22) * 100 + "%",
                  background: BAR[col.key],
                }} />
              </span>
            ))}
          </span>
          {COLUMNS.map((col) => <span key={col.key} style={S.chkVal}>{row[col.key]}</span>)}
        </div>
      ))}

      <div style={{
        ...S.chkRow, borderTop: `2px solid ${C.borderHi}`, marginTop: 4,
        paddingTop: 14, flex: "0 0 auto",
        background: "rgba(228,190,114,0.05)", borderRadius: R.sm,
      }}>
        <span style={{ ...S.chkName, color: C.gold, fontSize: 15, paddingLeft: 14, fontWeight: 600 }}>
          Итог · общее энергополе
        </span>
        <span />
        {COLUMNS.map((col) => (
          <span key={col.key} style={{ ...S.chkVal, color: C.gold }}>{chakras.total[col.key]}</span>
        ))}
      </div>
    </div>
  );
}
