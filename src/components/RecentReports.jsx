import React from "react";
import { Link } from "react-router-dom";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { useRecentReports, forgetReport } from "../lib/recent.js";

/**
 * НЕДАВНИЕ РАСЧЁТЫ
 * ================
 * Строка над формой на главной. Человек уже считал эту дату — второй раз
 * вводить её незачем, достаточно нажать.
 *
 * Крестик убирает запись: чужая дата, посчитанная один раз из любопытства,
 * не должна висеть в списке вечно.
 *
 * Пустой список ничего не рисует — новому человеку показывать нечего.
 */
export default function RecentReports() {
  const list = useRecentReports();
  if (!list.length) return null;

  return (
    <div style={S.recentRow}>
      <span style={{ ...S.dimSm, marginRight: 2 }}>Недавние:</span>
      {list.map((item) => (
        <span key={item.to} className="recentChip" style={S.recentChip}>
          <Link to={item.to} className="recentDate" style={S.recentDate}>{item.label}</Link>
          <button className="recentDrop" style={S.recentDrop}
            aria-label={`Убрать ${item.label} из недавних`}
            onClick={() => forgetReport(item.to)}>×</button>
        </span>
      ))}
    </div>
  );
}
