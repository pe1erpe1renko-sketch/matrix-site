import React from "react";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import SectionList from "./SectionList.jsx";

/**
 * БЛОК РАЗДЕЛОВ РАЗБОРА
 * =====================
 * Заголовок со счётчиком и сам список. Набор разделов приходит готовым
 * из PAGE_VIEWS — страницы не собирают списки вручную.
 */
export default function SectionsBlock({
  sections, total, open, openId, onToggle, title, lead, background = C.bgAlt,
}) {
  return (
    <section style={{ ...S.section, background }}>
      <div style={S.eyebrow}>Разбор</div>
      <h2 style={S.h2}>
        {title || <>{total} {plural(total, "раздел", "раздела", "разделов")}, {open} <em style={S.h1em}>открыто</em></>}
      </h2>
      <p style={{ ...S.infoText, maxWidth: 660, margin: "-14px 0 26px" }}>
        {lead || "Числа посчитаны по всем разделам сразу — они ваши. Под замком только трактовки: они открываются на любом платном тарифе."}
      </p>
      <SectionList sections={sections} openId={openId} onToggle={onToggle} />
    </section>
  );
}

function plural(n, one, few, many) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}
