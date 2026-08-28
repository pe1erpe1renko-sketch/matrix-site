import React from "react";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import SectionList from "./SectionList.jsx";

/**
 * БЛОК РАЗБОРА
 * ============
 * Заголовок со счётчиком и список сфер. Набор сфер приходит готовым
 * из PAGE_VIEWS — страницы не собирают списки вручную.
 *
 * Счётчик считает ВОПРОСЫ, а не сферы: «15 из 92» человеку понятнее,
 * чем «12 сфер», и честно показывает, сколько ещё не открыто.
 */
export default function SectionsBlock({
  sections, spheres, total, open, title, lead, background = C.bgAlt,
}) {
  return (
    <section style={{ ...S.section, background }}>
      <div style={S.eyebrow}>Разбор</div>
      <h2 style={S.h2}>
        {title || <>
          {spheres} {plural(spheres, "сфера", "сферы", "сфер")}, {open} из {total}{" "}
          <em style={S.h1em}>{plural(open, "вопрос открыт", "вопроса открыто", "вопросов открыто")}</em>
        </>}
      </h2>
      <p style={{ ...S.infoText, maxWidth: 660, margin: "-14px 0 26px" }}>
        {lead || "Нажмите на вопрос — откроется ответ по вашим числам. Числа посчитаны по всем вопросам сразу, под замком только трактовки."}
      </p>
      <SectionList sections={sections} />
    </section>
  );
}

function plural(n, one, few, many) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}
