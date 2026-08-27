import React from "react";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { ARCANA_NAMES } from "../lib/prompts.js";

/**
 * РОДОВЫЕ ПРОГРАММЫ
 * =================
 * Две линии: по отцу и по матери. У каждой две программы и итог —
 * то, что род передал и что человеку предстоит с этим сделать.
 *
 * Формулировки намеренно без приговора: программа — это механизм,
 * а не диагноз и не проклятие.
 */
export default function AncestralLines({ ancestral }) {
  const lines = [
    {
      key: "male",
      title: "Мужская линия — по отцу",
      lead: "Что тянется от отца и его рода.",
      data: ancestral.male,
    },
    {
      key: "female",
      title: "Женская линия — по матери",
      lead: "Что тянется от матери и её рода.",
      data: ancestral.female,
    },
  ];

  return (
    <div style={S.lineGrid}>
      {lines.map((line) => (
        <div key={line.key} className="card" style={S.lineCard}>
          <div style={S.infoLabel}>{line.title}</div>
          <p style={{ ...S.purposeHint, marginBottom: 8 }}>{line.lead}</p>

          <div style={{ ...S.lineRow, borderTop: "none" }}>
            <span style={S.lineVal}>{line.data.first}</span>
            <span style={S.lineLbl}>
              Первая программа
              <span style={{ color: C.muted }}> · {ARCANA_NAMES[line.data.first]}</span>
            </span>
          </div>
          <div style={S.lineRow}>
            <span style={S.lineVal}>{line.data.second}</span>
            <span style={S.lineLbl}>
              Вторая программа
              <span style={{ color: C.muted }}> · {ARCANA_NAMES[line.data.second]}</span>
            </span>
          </div>
          <div style={{ ...S.lineRow, borderTopColor: C.borderHi }}>
            <span style={S.lineValStrong}>{line.data.result}</span>
            <span style={{ ...S.lineLbl, color: C.white }}>
              Итог линии
              <span style={{ color: C.gold }}> · {ARCANA_NAMES[line.data.result]}</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
