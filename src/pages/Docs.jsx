import React from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { LEGAL_DOCS, legalDoc } from "../lib/legal.js";
import { supportWay } from "../lib/support.js";
import { TAP } from "../theme/responsive.js";
import NotFound from "./NotFound.jsx";

/**
 * ЮРИДИЧЕСКИЕ ДОКУМЕНТЫ — /docs/terms, /docs/privacy, /docs/consent, /docs/offer
 * =============================================================================
 * Одна страница на все четыре адреса: отличаются только заголовком и текстом.
 * Список документов — в src/lib/legal.js, оттуда же их берут подвал и блок
 * согласия при оформлении покупки.
 *
 * СЕЙЧАС ЗДЕСЬ ЗАГЛУШКА. Тексты готовит юрист, до этого страница честно
 * говорит, что документ готовится, и уводит в поддержку.
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │  СЮДА ВСТАВЛЯТЬ ТЕКСТЫ ДОКУМЕНТОВ                                    │
 * │                                                                      │
 * │  Заполните DOC_TEXT ниже: ключ — имя документа из адреса             │
 * │  (terms, privacy, consent, offer), значение — массив блоков.         │
 * │                                                                      │
 * │    DOC_TEXT.terms = [                                                │
 * │      { h: '1. Общие положения' },                                    │
 * │      { p: 'Настоящее соглашение…' },                                 │
 * │      { p: 'Второй абзац…' },                                         │
 * │    ];                                                                │
 * │                                                                      │
 * │  { h: … } — подзаголовок, { p: … } — абзац. Как только у документа   │
 * │  появляются блоки, заглушка на его странице пропадает сама,          │
 * │  трогать ничего больше не нужно.                                     │
 * └──────────────────────────────────────────────────────────────────────┘
 */
const DOC_TEXT = {
  terms: [],
  privacy: [],
  consent: [],
  offer: [],
};

/** Дата последнего изменения документа. Проставляется вместе с текстом. */
const DOC_DATE = {
  terms: "",
  privacy: "",
  consent: "",
  offer: "",
};

export default function Docs() {
  const { doc: docId } = useParams();
  const doc = legalDoc(docId);

  // Неизвестный адрес вида /docs/что-то — обычная «страницы нет».
  if (!doc) return <NotFound />;

  const blocks = DOC_TEXT[doc.id] || [];
  const others = LEGAL_DOCS.filter((d) => d.id !== doc.id);

  return (
    <section style={{ ...S.section, paddingTop: 34, paddingBottom: 70 }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <BackButton />

        <div style={{ ...S.eyebrow, marginBottom: 10 }}>Юридическая информация</div>
        <h1 style={{ ...S.stubTitle, textAlign: "left", margin: "0 0 18px" }}>
          {doc.label}
        </h1>

        {blocks.length ? (
          <div style={{ ...S.block, padding: "26px 28px" }}>
            {DOC_DATE[doc.id] && (
              <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 18 }}>
                Редакция от {DOC_DATE[doc.id]}
              </div>
            )}
            {blocks.map((b, i) =>
              b.h ? (
                <h2 key={i} style={{
                  fontSize: 16.5, color: C.white, fontWeight: 600,
                  margin: i ? "24px 0 10px" : "0 0 10px",
                }}>
                  {b.h}
                </h2>
              ) : (
                <p key={i} style={{ ...S.infoText, margin: "0 0 12px", lineHeight: 1.65 }}>
                  {b.p}
                </p>
              )
            )}
          </div>
        ) : (
          <div style={{ ...S.block, padding: "30px 28px" }}>
            <p style={{ ...S.infoText, margin: 0, fontSize: 15.5, lineHeight: 1.65 }}>
              Документ готовится и вступит в силу с момента публикации.
              По вопросам обращайтесь в поддержку.
            </p>
            <div style={{ fontSize: 13.5, color: C.muted, marginTop: 16, lineHeight: 1.6 }}>
              Поддержка: <Way id="telegram" text="Telegram" />, <Way id="max" text="MAX" />{" "}
              или почта <Way id="mail" />.
            </div>
          </div>
        )}

        <div style={{ marginTop: 30 }}>
          <div style={{ ...S.footTitle, marginBottom: 10 }}>Другие документы</div>
          {others.map((d) => (
            <Link key={d.id} to={d.path} className="footLink"
              style={{ ...S.footLink, display: "block", minHeight: TAP, lineHeight: "34px" }}>
              {d.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Возврат назад. Человек приходит сюда из подвала или из блока согласия
 * при оформлении покупки — там важно вернуться ровно туда, где он был,
 * с заполненной формой. Поэтому назад по истории браузера, а не на главную.
 * Если страница открыта по прямой ссылке и возвращаться некуда — на главную.
 */
function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  // location.key === 'default' — первая запись в истории, назад некуда.
  const canGoBack = location.key !== "default";

  if (!canGoBack) {
    return (
      <Link to="/" className="backLink" style={{ ...S.backLink, minHeight: TAP }}>
        <span style={{ fontSize: 17, lineHeight: 1, color: C.gold }}>←</span>
        <span>На главную</span>
      </Link>
    );
  }
  return (
    <button type="button" className="backLink" onClick={() => navigate(-1)}
      style={{ ...S.backLink, minHeight: TAP, cursor: "pointer" }}>
      <span style={{ fontSize: 17, lineHeight: 1, color: C.gold }}>←</span>
      <span>Назад</span>
    </button>
  );
}

/** Ссылка на поддержку в тексте страницы. Адреса — в lib/support.js. */
function Way({ id, text }) {
  const way = supportWay(id);
  if (!way) return null;
  const mail = way.href.startsWith("mailto:");
  return (
    <a href={way.href} className="docLink" style={S.docLink}
      target={mail ? undefined : "_blank"} rel={mail ? undefined : "noreferrer"}>
      {text || way.value}
    </a>
  );
}
