import React from "react";
import { useParams, useLocation } from "react-router-dom";
import PageStub from "../components/PageStub.jsx";
import { S } from "../theme/styles.js";
import { calcById, activeNavId } from "../routes.js";
import { urlDateToISO, urlDateToHuman } from "../lib/urlDate.js";

/**
 * СТРАНИЦА РЕЗУЛЬТАТА — ПОКА ЗАГЛУШКА
 * ===================================
 * Адреса: /matrica/13-07-1998, /detskaya/02-11-2019,
 *         /sovmestimost/13-07-1998/09-04-1992, /biznes/…/…
 *
 * Главное здесь уже работает: страница открывается по ПРЯМОЙ ССЫЛКЕ,
 * без предварительного заполнения формы — дата берётся из адреса.
 * Настоящий разбор (октаграмма, чакры, 25 разделов) придёт задачей 2,
 * тогда calculateMatrix() из src/lib/matrixEngine.js подставит числа сюда.
 */
export default function CalcResult() {
  const { date, dateA, dateB } = useParams();
  const { pathname } = useLocation();
  const calc = calcById(activeNavId(pathname));

  const parts = calc?.pairs ? [dateA, dateB] : [date];
  const parsed = parts.map((p) => ({ url: p, iso: urlDateToISO(p) }));
  const broken = parsed.filter((p) => !p.iso);

  if (broken.length) {
    return (
      <PageStub
        badge="Неверная дата"
        title="Такую дату разобрать не получится"
        text="Дата в адресе пишется как 13-07-1998 — день, месяц и год через дефис. Проверьте ссылку или начните расчёт заново на главной."
      />
    );
  }

  return (
    <PageStub
      eyebrow={calc?.label}
      title={`Разбор по дате ${parsed.map((p) => urlDateToHuman(p.url)).join(" и ")}`}
      text="Адрес разобран, дата принята. Сам разбор — октаграмма, чакральная таблица, предназначения и 25 разделов — появится следующей задачей."
    >
      <div style={{ display: "flex", gap: 40, flexWrap: "wrap", justifyContent: "center" }}>
        {parsed.map((p, i) => (
          <div key={p.url}>
            <div style={S.stubDate}>{urlDateToHuman(p.url)}</div>
            <div style={S.stubDateLbl}>
              {calc?.pairs ? (i === 0 ? "Первый" : "Второй") : "Дата рождения"}
            </div>
          </div>
        ))}
      </div>
    </PageStub>
  );
}
