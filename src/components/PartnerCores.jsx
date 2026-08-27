import React from "react";
import { Link } from "react-router-dom";
import { S } from "../theme/styles.js";
import { POINT_CODES } from "../lib/matrixEngine.js";
import { isoToUrlDate, urlDateToHuman } from "../lib/urlDate.js";

/**
 * ЯДРА ОБЕИХ ЛИЧНЫХ МАТРИЦ
 * ========================
 * Матрица пары — сумма одноимённых точек двух личных. Показываем исходные
 * ядра, чтобы было видно, из чего сложилась пара, и чтобы каждый мог
 * перейти в свой полный разбор.
 *
 * Числа берутся из partners.a и partners.b — движок считает личные матрицы
 * внутри calculatePair и не трогает их.
 */

const ORDER = ["W", "N", "E", "S", "C", "NW", "NE", "SE", "SW"];

export default function PartnerCores({ partners, labels = ["Первый", "Второй"] }) {
  const people = [partners.a, partners.b];

  return (
    <div style={S.lineGrid}>
      {people.map((person, i) => {
        const urlDate = isoToUrlDate(person.birthDate);
        return (
          <div key={person.birthDate} className="card" style={S.lineCard}>
            <div style={S.infoLabel}>{labels[i]} · {urlDateToHuman(urlDate)}</div>

            <div style={S.coreGrid}>
              {ORDER.map((code) => (
                <div key={code} style={S.coreCell} title={POINT_CODES[code].title}>
                  <span style={S.coreCode}>{code}</span>
                  <span style={S.coreVal}>{person.core[code]}</span>
                </div>
              ))}
            </div>

            <p style={{ ...S.purposeHint, marginTop: 14 }}>
              Зона комфорта {person.core.C}, денежный канал {person.core.SE},
              линия отношений {person.core.SW}.
            </p>

            <Link to={`/matrica/${urlDate}`} className="link"
              style={{ ...S.link, display: "inline-block", marginTop: 6 }}>
              Полный разбор по этой дате
            </Link>
          </div>
        );
      })}
    </div>
  );
}
