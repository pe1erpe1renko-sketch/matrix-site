import React from "react";
import { Link } from "react-router-dom";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { useBackPoint } from "../lib/returnTo.js";
import { TAP } from "../theme/responsive.js";

/**
 * КНОПКА ВОЗВРАТА К РАЗБОРУ
 * =========================
 * Стоит вверху страницы, на которую человека увели из разбора.
 * Ведёт точно туда, откуда он ушёл, вместе с раскрытой сферой.
 *
 * Если человек пришёл сюда сам — из меню или по ссылке — точки возврата
 * нет и кнопки тоже нет: возвращать некуда, а лишняя кнопка сбивает.
 */
export default function BackToReport({ style }) {
  const back = useBackPoint();
  if (!back) return null;

  return (
    <Link to={back.to} className="backLink" style={{ ...S.backLink, minHeight: TAP, ...style }}>
      <span style={{ fontSize: 17, lineHeight: 1, color: C.gold }}>←</span>
      <span>{back.label}</span>
    </Link>
  );
}
