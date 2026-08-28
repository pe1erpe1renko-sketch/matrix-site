import React, { useState } from "react";
import { C, FONT } from "../theme/tokens.js";
import { arcanaImage } from "../lib/contentPositions.js";
import { arcanaName } from "../lib/images.js";
import { urlDateToHuman } from "../lib/urlDate.js";

/**
 * КАРТОЧКА ОБРАЗА
 * ===============
 * Соотношение 3:4 — под заставку телефона. Слои снизу вверх:
 *   1. иллюстрация аркана на всю карточку
 *   2. затемнение сверху и снизу, чтобы читались подписи
 *   3. рамка в цвете темы и мягкое свечение
 *   4. сверху название темы, снизу имя и дата, в самом низу MATRIKA
 *
 * ЕСЛИ ФАЙЛА ИЛЛЮСТРАЦИИ НЕТ, на его месте градиент в цвете темы
 * и крупный номер аркана. Раздел обязан работать без картинок:
 * битых рамок человек видеть не должен.
 *
 * Размеры считаются от ширины, а не задаются по отдельности: одна
 * карточка используется и миниатюрой в списке, и крупной в результате,
 * и должна выглядеть одинаково в обоих.
 */
export default function ObrazCard({ arcana, accent, theme, who, date, width = 300, dim = false }) {
  const [failed, setFailed] = useState(false);
  const k = width / 300;                       // всё остальное — от ширины
  /* На миниатюре подписи не читаются и превращаются в грязь — там
     остаётся только иллюстрация в рамке темы. */
  const withText = width >= 150;

  return (
    <div style={{
      position: "relative", width, aspectRatio: "3 / 4", flexShrink: 0,
      borderRadius: 20 * k, overflow: "hidden",
      border: `${Math.max(1, 2 * k)}px solid ${accent}`,
      background: `linear-gradient(165deg, ${accent}22, #0A0817 70%)`,
      boxShadow: `0 ${30 * k}px ${90 * k}px -${40 * k}px ${accent}`,
      opacity: dim ? 0.55 : 1,
      transition: "opacity .3s ease",
    }}>
      {failed ? (
        <span style={{
          position: "absolute", inset: 0, display: "flex",
          alignItems: "center", justifyContent: "center",
          fontFamily: FONT.serif, fontSize: 74 * k, color: accent, lineHeight: 1,
        }}>{arcana}</span>
      ) : (
        <img src={arcanaImage(arcana)} alt="" loading="lazy" decoding="async"
          onError={() => setFailed(true)}
          style={{
            position: "absolute", top: "-1%", left: "-1%", width: "102%", height: "102%",
            objectFit: "cover", display: "block",
          }} />
      )}

      {/* затемнение под подписями */}
      <span style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(6,4,14,0.78) 0%, rgba(6,4,14,0) 32%,"
          + " rgba(6,4,14,0) 52%, rgba(6,4,14,0.86) 100%)",
      }} />

      {withText && theme && (
        <div style={{
          position: "absolute", top: 16 * k, left: 0, right: 0, textAlign: "center",
          fontSize: 11 * k, letterSpacing: `${0.16 * k}em`, textTransform: "uppercase",
          color: accent, fontWeight: 600,
        }}>{theme}</div>
      )}

      {withText && (
      <div style={{
        position: "absolute", bottom: 34 * k, left: 0, right: 0,
        textAlign: "center", padding: `0 ${18 * k}px`,
      }}>
        <div style={{
          fontSize: 11 * k, letterSpacing: `${0.1 * k}em`, textTransform: "uppercase",
          color: "rgba(245,242,252,0.6)", marginBottom: 6 * k,
        }}>Аркан {arcana} · {arcanaName(arcana)}</div>
        {who && (
          <div style={{ fontFamily: FONT.serif, fontSize: 24 * k, color: C.white, lineHeight: 1.15 }}>
            {who}
          </div>
        )}
        {date && (
          <div style={{ fontSize: 12.5 * k, color: "rgba(245,242,252,0.7)", marginTop: 3 * k }}>
            {urlDateToHuman(date)}
          </div>
        )}
      </div>
      )}

      {withText && (
        <div style={{
          position: "absolute", bottom: 13 * k, left: 0, right: 0, textAlign: "center",
          fontSize: 9.5 * k, letterSpacing: `${0.3 * k}em`, color: "rgba(228,190,114,0.55)",
        }}>MATRIKA</div>
      )}
    </div>
  );
}
