import React from "react";
import { Link } from "react-router-dom";
import { S } from "../theme/styles.js";
import DevPlanSwitch from "./DevPlanSwitch.jsx";

/**
 * ШАПКА СТРАНИЦЫ РАСЧЁТА
 * ======================
 * Одна на все шесть калькуляторов: служебная плашка доступов, название
 * расчёта, даты и ссылка «посчитать другие даты».
 */
export default function ResultHeader({
  eyebrow, humanDates, lead, reportKey, isoDates, sectionsTotal, sectionsOpen, backTo,
}) {
  return (
    <>
      <DevPlanSwitch
        reportKey={reportKey}
        dates={isoDates}
        sectionsTotal={sectionsTotal}
        sectionsOpen={sectionsOpen}
      />

      <div style={S.resultHead}>
        <div>
          <div style={S.eyebrow}>{eyebrow}</div>
          <h1 style={S.resultDate}>{humanDates.join(" и ")}</h1>
          {lead && <p style={{ ...S.purposeHint, maxWidth: 560 }}>{lead}</p>}
        </div>
        <Link to={backTo} className="link" style={S.link}>
          Посчитать другие даты
        </Link>
      </div>
    </>
  );
}
