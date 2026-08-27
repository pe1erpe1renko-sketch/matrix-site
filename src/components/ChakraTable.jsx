import React from "react";
import { C, R, SURFACE } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { useIsPhone } from "../theme/responsive.js";

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
  const isPhone = useIsPhone();

  /**
   * На телефоне полосы-индикаторы скрыты (класс chkGauge в globalCss),
   * остаются только числа: места мало, а числа — это и есть содержание.
   * Колонка с названиями липкая, остальное при нужде уезжает вбок —
   * поэтому таблица лежит в собственном прокручиваемом контейнере,
   * а не растягивает страницу.
   */
  const row = isPhone
    ? { ...S.chkRow, gridTemplateColumns: "132px 46px 46px 46px", gap: 8, minWidth: 272 }
    : S.chkRow;

  const nameCell = isPhone
    ? { ...S.chkName, position: "sticky", left: 0, zIndex: 2, background: SURFACE.cardSolid, paddingRight: 6 }
    : S.chkName;

  return (
    <div style={{
      display: "flex", flexDirection: "column", flex: 1, minHeight: 0,
      ...(isPhone ? { overflowX: "auto", overflowY: "hidden" } : null),
    }}>
      {/* Легенда вынесена отдельной строкой над таблицей: внутри сетки
          она попадала в узкую колонку и налезала на заголовки Ф/Э/Эм. */}
      <div style={{ ...S.chkLegend, flex: "0 0 auto", marginBottom: 8, display: isPhone ? "none" : "flex" }}>
        {COLUMNS.map((col) => (
          <span key={col.key} style={S.chkLeg}>
            <span style={{ ...S.chkLegDot, background: BAR[col.key] }} />{col.label}
          </span>
        ))}
      </div>

      <div style={{ ...row, borderBottom: `1px solid ${C.border}`, paddingBottom: 10, flex: "0 0 auto" }}>
        <span style={nameCell} />
        {!isPhone && <span />}
        {COLUMNS.map((col) => <span key={col.key} style={S.chkHead}>{col.short}</span>)}
      </div>

      {chakras.rows.map((item) => (
        <div key={item.key} className="chk" style={{ ...row, flex: "1 1 0", minHeight: 54 }}>
          <span style={nameCell}>
            <span style={{ ...S.chkBar, background: item.color }} />
            <span style={{ minWidth: 0 }}>
              <span style={{
                display: "block", color: C.white, fontSize: isPhone ? 13.5 : 14.5,
                ...(isPhone ? { whiteSpace: "nowrap" } : null),
              }}>{item.name}</span>
              <span style={{
                display: "block", color: C.muted, fontSize: 11.5,
                ...(isPhone ? { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } : null),
              }}>{item.sphere}</span>
            </span>
          </span>
          {!isPhone && (
            <span className="chkGauge" style={S.chkGauge}>
              {COLUMNS.map((col) => (
                <span key={col.key} style={S.chkTrack}>
                  <span style={{
                    ...S.chkFill,
                    width: (item[col.key] / 22) * 100 + "%",
                    background: BAR[col.key],
                  }} />
                </span>
              ))}
            </span>
          )}
          {COLUMNS.map((col) => <span key={col.key} style={S.chkVal}>{item[col.key]}</span>)}
        </div>
      ))}

      <div style={{
        ...row, borderTop: `2px solid ${C.borderHi}`, marginTop: 4,
        paddingTop: 14, flex: "0 0 auto",
        background: "rgba(228,190,114,0.05)", borderRadius: R.sm,
      }}>
        <span style={{
          ...nameCell, color: C.gold, fontSize: isPhone ? 13 : 15,
          paddingLeft: isPhone ? 4 : 14, fontWeight: 600,
          ...(isPhone ? { background: "transparent" } : null),
        }}>
          {isPhone ? "Итог" : "Итог · общее энергополе"}
        </span>
        {!isPhone && <span />}
        {COLUMNS.map((col) => (
          <span key={col.key} style={{ ...S.chkVal, color: C.gold }}>{chakras.total[col.key]}</span>
        ))}
      </div>
    </div>
  );
}
