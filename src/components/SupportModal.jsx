import React from "react";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { Modal } from "./Controls.jsx";

/**
 * ПОДДЕРЖКА
 * =========
 * Три способа связи и ID аккаунта прямо в тексте: назвав номер, человек
 * находится в поддержке сразу, без «уточните почту, с которой вы
 * регистрировались».
 */
const WAYS = [
  { name: "Telegram", value: "@matrika_support", note: "отвечаем быстрее всего", href: "https://t.me/matrika_support" },
  { name: "MAX", value: "@matrika", note: "", href: null },
  { name: "Почта", value: "help@matrika.ru", note: "для чеков и возвратов", href: "mailto:help@matrika.ru" },
];

export default function SupportModal({ accountId, onClose }) {
  return (
    <Modal
      title="Поддержка"
      onClose={onClose}
      lead={
        <p style={{ ...S.hint, marginTop: 0 }}>
          Напишите удобным способом.
          {accountId && <> Назовите ID аккаунта <b style={{ color: C.gold }}>{accountId}</b> — так найдём вас сразу.</>}
        </p>
      }
    >
      {WAYS.map((way) => {
        const content = (
          <>
            <span style={{ color: C.white, fontSize: 14.5, minWidth: 78, textAlign: "left" }}>{way.name}</span>
            <span style={{ color: C.lilac, fontSize: 14, flex: 1, textAlign: "left" }}>{way.value}</span>
            {way.note && <span style={S.dimSm}>{way.note}</span>}
          </>
        );
        return way.href
          ? <a key={way.name} className="supRow" style={S.supRow} href={way.href} target="_blank" rel="noreferrer">{content}</a>
          : <div key={way.name} className="supRow" style={S.supRow}>{content}</div>;
      })}
    </Modal>
  );
}
