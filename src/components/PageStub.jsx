import React from "react";
import { Link } from "react-router-dom";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";

/**
 * ЗАГЛУШКА СТРАНИЦЫ
 * =================
 * Временный блок для страниц, которые появятся следующими задачами
 * (CLAUDE.md, раздел 7). Оформлен в общем стиле, чтобы предпросмотр
 * выглядел цельным: человек видит, что переход сработал и адрес верный,
 * а не пустой экран.
 *
 * Когда страница готова — файл страницы перестаёт звать PageStub,
 * сам компонент удалять не нужно, он ещё пригодится соседям.
 */
export default function PageStub({ eyebrow, title, text, badge = "Страница в работе", children }) {
  return (
    <section style={{ ...S.section, paddingTop: 70, paddingBottom: 70 }}>
      {eyebrow && <div style={{ ...S.eyebrow, textAlign: "center" }}>{eyebrow}</div>}
      <div style={S.stubWrap}>
        <div style={S.stubBadge}>{badge}</div>
        <h1 style={S.stubTitle}>{title}</h1>
        {text && <p style={S.stubText}>{text}</p>}
        {children}
        <div style={S.stubActions}>
          <Link to="/" className="btnGold" style={{ ...S.ctaSmall, background: C.gold, color: C.ink }}>
            На главную
          </Link>
        </div>
      </div>
    </section>
  );
}
