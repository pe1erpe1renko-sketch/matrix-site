import React, { useState } from "react";
import { Link } from "react-router-dom";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { Bolt } from "./Icons.jsx";
import { useBolts } from "../lib/bolts.js";
import { BOLT_FREE } from "../lib/plans.js";
import { TAP } from "../theme/responsive.js";

/**
 * БАЛАНС МОЛНИЙ В ШАПКЕ
 * =====================
 * Виден всегда, рядом со звуком и поддержкой. Человек, который не знает
 * своего баланса, не нажимает кнопки со списанием.
 *
 * По нажатию — история списаний и строка о том, что молниями НЕ
 * оплачивается. Эта строка тут не для порядка: без неё люди решают,
 * что за чтение своих же разборов тоже возьмут.
 */
export default function BoltBalance() {
  const { balance, log } = useBolts();
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button className="iconBtn" style={{ ...S.boltBtn }}
        onClick={() => setOpen(!open)} aria-expanded={open} aria-label={`Молнии: ${balance}`}>
        <Bolt size={14} />
        <span style={{ fontWeight: 600, fontSize: 13 }}>{balance}</span>
      </button>

      {open && (
        <>
          {/* Клик мимо закрывает: выпадашка не должна залипать. */}
          <span style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={() => setOpen(false)} />
          <div style={S.boltPanel}>
            <div style={S.blockTitle}>Молнии</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
              <span style={{ ...S.okBig, fontSize: 30 }}>{balance}</span>
              <span style={S.dimSm}>на балансе</span>
            </div>
            <p style={{ ...S.dimSm, marginBottom: 14 }}>
              Молниями не оплачивается: {BOLT_FREE.join(", ")}. Это всегда бесплатно.
            </p>

            <div style={S.blockTitle}>История</div>
            {log.length === 0 ? (
              <p style={S.dimSm}>Списаний пока не было.</p>
            ) : (
              <div style={{ maxHeight: 220, overflowY: "auto" }}>
                {log.slice(0, 12).map((row, i) => (
                  <div key={row.at + i} style={S.boltRowLine}>
                    <span style={{
                      color: row.delta > 0 ? C.ok : C.text, fontWeight: 600, minWidth: 44,
                    }}>{row.delta > 0 ? `+${row.delta}` : row.delta}</span>
                    <span style={{ flex: 1, minWidth: 0 }}>{row.what}</span>
                    <span style={S.dimSm}>{shortDate(row.at)}</span>
                  </div>
                ))}
              </div>
            )}

            <Link to="/tarify" onClick={() => setOpen(false)} className="btnOutline"
              style={{
                ...S.btnSm, display: "flex", alignItems: "center", justifyContent: "center",
                marginTop: 14, minHeight: TAP, border: `1px solid ${C.border}`, color: C.white,
              }}>
              Пополнить
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

const shortDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
  } catch {
    return "";
  }
};
