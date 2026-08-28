import React, { useState } from "react";
import { C, R, FONT } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { arcanaImage } from "../lib/contentPositions.js";
import { ARCANA_NAMES } from "../lib/prompts.js";

/**
 * ИЛЛЮСТРАЦИЯ АРКАНА
 * ==================
 * Одна на все места, где показывается карта: аркан дня, ответ на вопрос,
 * панель точки октаграммы.
 *
 * СКРУГЛЕНИЕ ОБЯЗАТЕЛЬНО. Рамка на картинках нарисована со скруглёнными
 * углами, а файл прямоугольный — по углам остаётся белое. Поэтому
 * обёртка всегда обрезает содержимое (overflow: hidden), а радиус берётся
 * не меньше того, что нарисован в файле: max(радиус карточек, 4.5% ширины).
 * Проценты нужны потому, что нарисованный радиус растёт вместе с картинкой,
 * а пиксельный — нет: на крупной иллюстрации фиксированные 20 пикселей
 * белые уголки уже не закрыли бы.
 *
 * ПОЛЯ ПО КРАЯМ. У двух файлов из двадцати двух вдоль края идёт белая
 * полоска в полпроцента ширины. Поэтому картинка растянута на 102% и
 * сдвинута на процент: внешний процент уходит под обрезку вместе с полоской.
 *
 * СООТНОШЕНИЕ СТОРОН задано жёстко (3:4), чтобы страница не прыгала,
 * пока картинка грузится. Файлы чуть разного размера — лишнее
 * подрезается object-fit: cover.
 *
 * ЕСЛИ ФАЙЛ НЕ ЗАГРУЗИЛСЯ, на его месте остаётся тот же прямоугольник
 * с номером аркана: битой иконки человек не увидит.
 */
export default function ArcanaImage({
  arcana, radius = R.lg, eager = false, numberSize = 20, badge = false, style, title,
}) {
  const [failed, setFailed] = useState(false);
  const name = ARCANA_NAMES[arcana];

  return (
    <div style={{
      position: "relative",
      aspectRatio: "3 / 4",
      overflow: "hidden",
      borderRadius: `max(${radius}px, 4.5%)`,
      background: "#0B0819",
      border: `1px solid ${C.border}`,
      flexShrink: 0,
      ...style,
    }}>
      {failed ? (
        <span style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: FONT.serif, fontSize: numberSize, color: C.gold,
        }}>{arcana}</span>
      ) : (
        <img
          src={arcanaImage(arcana)}
          alt={title || `Аркан ${arcana} — ${name}`}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(true)}
          style={{
            position: "absolute", top: "-1%", left: "-1%",
            width: "102%", height: "102%",
            objectFit: "cover", display: "block",
            borderRadius: "inherit",
          }}
        />
      )}

      {/* Номер поверх картинки: в самих файлах цифр нет намеренно.
          В заглушке номер уже нарисован крупно, второй раз не нужен. */}
      {badge && !failed && <span style={S.arcBadge}>{arcana}</span>}
    </div>
  );
}
