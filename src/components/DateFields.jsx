import React from "react";
import { S } from "../theme/styles.js";
import { useIsPhone } from "../theme/responsive.js";

/**
 * ТРИ ПОЛЯ ДАТЫ РОЖДЕНИЯ
 * ======================
 * День, месяц, год. Раньше эта тройка жила только в форме на главной,
 * теперь она нужна ещё и в исследовательских карточках внутри разбора —
 * поэтому вынесена сюда. Одно поле ввода даты на весь сайт.
 *
 * Год — не выпадающий список, а поле с подсказками: сто с лишним лет
 * листать выпадающим списком мучительно, а набрать четыре цифры быстро.
 *
 * @param {{d: string, m: string, y: string}} value
 * @param {boolean} [stack] — складывать поля в одну колонку на телефоне.
 *        В узкой карточке три поля в ряд не читаются, а в форме
 *        на главной места хватает.
 */
export const MONTHS = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
export const YEARS = Array.from({ length: 106 }, (_, i) => 2026 - i);

export default function DateFields({ value, onChange, idPrefix, stack = false }) {
  const isPhone = useIsPhone();
  const up = (key) => (e) => onChange({ ...value, [key]: e.target.value });
  const oneColumn = stack && isPhone;

  return (
    <div style={{ ...S.dateRow, ...(oneColumn ? { gridTemplateColumns: "1fr" } : null) }}>
      <select className="fld" style={S.select} value={value.d} onChange={up("d")} aria-label="День">
        <option value="">День</option>
        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => <option key={d} value={d}>{d}</option>)}
      </select>
      <select className="fld" style={S.select} value={value.m} onChange={up("m")} aria-label="Месяц">
        <option value="">Месяц</option>
        {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
      </select>
      <input className="fld" style={S.select} list={idPrefix + "years"} placeholder="Год" aria-label="Год"
        value={value.y} onChange={up("y")} inputMode="numeric" maxLength={4} />
      <datalist id={idPrefix + "years"}>{YEARS.map((y) => <option key={y} value={y} />)}</datalist>
    </div>
  );
}
