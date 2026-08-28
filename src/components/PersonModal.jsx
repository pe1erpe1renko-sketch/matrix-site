import React, { useState } from "react";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { addPerson, updatePerson } from "../lib/people.js";
import { Modal } from "./Controls.jsx";

/**
 * ДОБАВЛЕНИЕ И ПРАВКА МАТРИЦЫ
 * ===========================
 * Имя, дата рождения, пол, тип расчёта.
 *
 * Имя и пол на числа НЕ влияют — формула одна. Имя подписывает разбор
 * в кабинете, чтобы человек не перепутал, где чья матрица. Пол нужен
 * в детской матрице и в обращениях.
 */

const MONTHS = ["янв","фев","мар","апр","май","июн","июл","авг","сен","окт","ноя","дек"];
const YEARS = Array.from({ length: 106 }, (_, i) => new Date().getFullYear() - i);
const KINDS = [["personal", "Личная"], ["child", "Детская"]];

const pad = (n) => String(n).padStart(2, "0");

export default function PersonModal({ person, onClose }) {
  const editing = Boolean(person);
  const [name, setName] = useState(person?.name || "");
  const [gender, setGender] = useState(person?.gender || "");
  const [kind, setKind] = useState(person?.kind || "personal");

  const [y, m, d] = (person?.birthDate || "--").split("-");
  const [day, setDay] = useState(d ? String(Number(d)) : "");
  const [month, setMonth] = useState(m ? String(Number(m)) : "");
  const [year, setYear] = useState(y || "");

  const birthDate = day && month && year ? `${year}-${pad(month)}-${pad(day)}` : null;
  const realDate = birthDate && !Number.isNaN(Date.parse(birthDate))
    && new Date(`${birthDate}T00:00:00Z`).getUTCDate() === Number(day);
  const ready = name.trim() && gender && realDate;

  const save = () => {
    if (!ready) return;
    const data = { name: name.trim(), birthDate, gender, kind };
    if (editing) updatePerson(person.id, data);
    else addPerson(data);
    onClose();
  };

  return (
    <Modal title={editing ? "Изменить матрицу" : "Новая матрица"} onClose={onClose} width="min(440px, 100%)">
      <label style={S.dimSm} htmlFor="pmName">Имя</label>
      <input id="pmName" className="fld" style={{ ...S.inField, padding: "12px 14px", margin: "6px 0 14px" }}
        placeholder="Как подписать" maxLength={20} value={name} onChange={(e) => setName(e.target.value)} />

      <div style={S.dimSm}>Дата рождения</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr 1fr", gap: 8, margin: "6px 0 14px" }}>
        <select className="fld" style={{ ...S.inField, padding: "12px 9px" }} value={day}
          onChange={(e) => setDay(e.target.value)} aria-label="День">
          <option value="">День</option>
          {Array.from({ length: 31 }, (_, i) => i + 1).map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        <select className="fld" style={{ ...S.inField, padding: "12px 9px" }} value={month}
          onChange={(e) => setMonth(e.target.value)} aria-label="Месяц">
          <option value="">Месяц</option>
          {MONTHS.map((label, i) => <option key={label} value={i + 1}>{label}</option>)}
        </select>
        <input className="fld" style={{ ...S.inField, padding: "12px 9px" }} list="pmYears"
          placeholder="Год" value={year} inputMode="numeric" maxLength={4}
          onChange={(e) => setYear(e.target.value)} aria-label="Год" />
        <datalist id="pmYears">{YEARS.map((v) => <option key={v} value={v} />)}</datalist>
      </div>

      {birthDate && !realDate && (
        <p style={{ ...S.hint, color: C.pink, marginTop: 0, marginBottom: 12 }}>
          Такой даты не существует — проверьте день и месяц.
        </p>
      )}

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <div>
          <div style={S.dimSm}>Пол</div>
          <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
            {["Ж", "М"].map((v) => {
              const on = gender === v;
              return (
                <button key={v} className="chip" style={{
                  ...S.chip, width: 46, padding: "9px 0",
                  background: on ? C.lilacBtn : "transparent",
                  borderColor: on ? C.lilacBtn : C.border,
                  color: on ? C.ink : C.text, fontWeight: on ? 700 : 400,
                }} onClick={() => setGender(v)}>{v}</button>
              );
            })}
          </div>
        </div>

        <div>
          <div style={S.dimSm}>Тип расчёта</div>
          <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
            {KINDS.map(([id, label]) => {
              const on = kind === id;
              return (
                <button key={id} className="chip" style={{
                  ...S.chip,
                  background: on ? C.lilacBtn : "transparent",
                  borderColor: on ? C.lilacBtn : C.border,
                  color: on ? C.ink : C.text, fontWeight: on ? 600 : 400,
                }} onClick={() => setKind(id)}>{label}</button>
              );
            })}
          </div>
        </div>
      </div>

      <p style={S.hint}>
        Имя и пол на числа не влияют — формула одна. Имя подписывает разбор,
        чтобы вы не перепутали, где чья матрица.
      </p>

      <button className={ready ? "btnGold" : ""} disabled={!ready}
        style={{
          ...S.btn, width: "100%", marginTop: 16,
          background: ready ? C.gold : C.disabled,
          color: ready ? C.ink : C.faint,
        }}
        onClick={save}>
        {editing ? "Сохранить" : "Добавить разбор"}
      </button>
    </Modal>
  );
}
