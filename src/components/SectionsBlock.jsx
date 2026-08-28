import React, { useState, useEffect, useCallback } from "react";
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
 *
 * Открыта ровно одна сфера, и при раскрытии страница подъезжает к её
 * заголовку: иначе человек нажимает сферу внизу экрана, содержимое
 * появляется ниже видимой области, и непонятно, куда смотреть.
 *
 * @param {string} [selfDate] — дата страницы в виде ДД-ММ-ГГГГ. Передаётся
 *        вниз, в карточки следующего шага в конце каждой сферы.
 * @param {{id: string, at: number}} [openRequest] — просьба раскрыть
 *        конкретную сферу извне: так работает «Подробнее» из панели точки
 *        октаграммы и адрес вида ?section=money. Поле at нужно, чтобы
 *        повторный клик по той же точке снова сработал.
 */
export default function SectionsBlock({
  sections, spheres, total, open, title, lead, background = C.bgAlt, openRequest, selfDate,
}) {
  const [openId, setOpenId] = useState(null);

  /* Подъезжаем к заголовку сферы, а не к её середине. Отступ сверху берём
     из --appTop: на телефоне там висит шапка, и без вычета заголовок
     оказался бы под ней. */
  const scrollToSphere = useCallback((id) => {
    requestAnimationFrame(() => {
      const node = document.getElementById(`section-${id}`);
      if (!node) return;
      const raw = getComputedStyle(document.documentElement).getPropertyValue("--appTop");
      const offset = (parseInt(raw, 10) || 0) + 12;
      window.scrollTo({ top: node.getBoundingClientRect().top + window.scrollY - offset, behavior: "smooth" });
    });
  }, []);

  const toggle = (id) => {
    const next = openId === id ? null : id;
    setOpenId(next);
    if (next) scrollToSphere(next);
  };

  useEffect(() => {
    if (!openRequest || !openRequest.id) return;
    setOpenId(openRequest.id);
    scrollToSphere(openRequest.id);
  }, [openRequest, scrollToSphere]);

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
        {lead || "Выберите сферу — раскроется список вопросов. Нажмите вопрос, и откроется ответ по вашим числам. Числа посчитаны по всем вопросам сразу, под замком только трактовки."}
      </p>
      <SectionList sections={sections} openId={openId} onToggle={toggle} selfDate={selfDate} />
    </section>
  );
}

function plural(n, one, few, many) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}
