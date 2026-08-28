import React from "react";
import { Link } from "react-router-dom";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { urlDateToHuman } from "../lib/urlDate.js";
import { useIsPhone, TAP } from "../theme/responsive.js";

/**
 * «ПОКАЗАТЬ ВСЮ МАТРИЦУ»
 * ======================
 * Стоит внизу каждого разбора, кроме самой матрицы судьбы.
 *
 * Тип разбора — это фильтр вопросов, а не отдельный расчёт: по той же
 * дате уже посчитаны все двенадцать сфер и девяносто два вопроса.
 * Человек пришёл за деньгами или за кармой — и должен увидеть, что
 * оплата открывает не только то, зачем он пришёл.
 *
 * ДОСТУП идёт по дате: если разбор по ней оплачен, на полной матрице
 * открыты все 92 вопроса — второй раз платить не за что.
 *
 * У парных типов вторая кнопка ведёт к матрице второго человека:
 * это отдельный набор дат, то есть отдельный разбор.
 *
 * @param {string[]} urlDates — даты страницы в виде ДД-ММ-ГГГГ
 * @param {string} [secondTo] — адрес матрицы второго человека
 * @param {string} [secondLabel] — надпись на второй кнопке
 */
export default function FullMatrixBlock({ urlDates, secondTo, secondLabel }) {
  const isPhone = useIsPhone();
  const [first] = urlDates;
  if (!first) return null;

  const wide = { width: isPhone ? "100%" : "auto", minHeight: TAP, textAlign: "center" };

  return (
    <section style={{ ...S.section, paddingTop: 34 }}>
      <div className="card" style={S.fullMatrix}>
        <div style={{ flex: "1 1 380px", minWidth: 0 }}>
          <div style={S.eyebrow}>Полная матрица</div>
          <h2 style={{ ...S.h2, marginBottom: 10 }}>Это была <em style={S.h1em}>часть</em> вашей матрицы</h2>
          <p style={{ ...S.infoText, maxWidth: 620, margin: 0 }}>
            По {urlDates.length > 1 ? "этим датам" : "этой дате"} посчитаны все двенадцать сфер
            и девяносто два вопроса. Оплата открывает их целиком — не только то, зачем вы пришли.
          </p>
        </div>

        <div style={{ ...S.fullMatrixCta, ...(isPhone ? { width: "100%" } : null) }}>
          <Link to={`/matrica/${first}`} className="btnGold"
            style={{ ...S.ctaSmall, ...wide, background: C.gold, color: C.ink }}>
            Показать всю матрицу
          </Link>
          {secondTo && (
            <Link to={secondTo} className="btnOutline"
              style={{ ...S.ctaSmall, ...wide, border: `1px solid ${C.border}`, color: C.white }}>
              {secondLabel}
            </Link>
          )}
          <span style={{ ...S.dimSm, textAlign: isPhone ? "center" : "right" }}>
            {urlDates.length > 1
              ? `${urlDateToHuman(first)} и ${urlDateToHuman(urlDates[1])}`
              : urlDateToHuman(first)}
          </span>
        </div>
      </div>
    </section>
  );
}
