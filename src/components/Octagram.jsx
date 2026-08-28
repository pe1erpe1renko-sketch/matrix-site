import React, { useState, useMemo, useRef } from "react";
import { C, FONT } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { POINT_SLOTS, findSectionForPoint, resolvePath, textKey } from "../lib/contentPositions.js";
import { POINT_CODES } from "../lib/matrixEngine.js";
import { ARCANA_NAMES } from "../lib/prompts.js";
import { useSlotText } from "./useSlotText.js";
import { useIsPhone, useIsTouch, hScrollRow, TAP } from "../theme/responsive.js";

/**
 * ОКТАГРАММА
 * ==========
 * Схема матрицы на настоящих числах: восемь внешних точек, центр,
 * промежуточные точки обеих осей и родовые лучи.
 *
 * Числа НЕ пересчитываются здесь. Компонент получает готовый результат
 * calculateMatrix() и достаёт из него значения по путям из POINT_SLOTS —
 * той же карты позиций, по которой пишутся тексты. Поэтому число в кружке
 * и текст в панели всегда про одну и ту же позицию.
 *
 * Клик по точке открывает панель с трактовкой из контентного слоя.
 * Кнопка «Подробнее» ведёт в раздел разбора, найденный findSectionForPoint().
 */

/* Углы лучей в градусах: W — запад (слева), N — север (сверху). */
const ANG = { W: 180, NW: 135, N: 90, NE: 45, E: 0, SE: -45, S: -90, SW: -135 };

/* Возраст на внешнем кольце: по часовой стрелке от запада, по 10 лет. */
const AGE = { W: 0, NW: 10, N: 20, NE: 30, E: 40, SE: 50, S: 60, SW: 70 };

/**
 * Где рисовать каждую точку. Ключ — id из POINT_SLOTS.
 *   dir — направление луча, k — доля радиуса от центра (0 — центр, 1 — край).
 *
 * Ось несимметрична намеренно: от W до центра три промежуточные точки,
 * от центра до E одна. Так устроена методика (CLAUDE.md, раздел 2),
 * и так же считается чакральная таблица.
 */
const GEOMETRY = {
  point_W:  { dir: "W",  k: 1, r: 27, kind: "main" },
  point_N:  { dir: "N",  k: 1, r: 27, kind: "main" },
  point_E:  { dir: "E",  k: 1, r: 27, kind: "main" },
  point_S:  { dir: "S",  k: 1, r: 27, kind: "main" },
  point_C:  { dir: "W",  k: 0, r: 32, kind: "center" },
  point_NW: { dir: "NW", k: 1, r: 24, kind: "corner" },
  point_NE: { dir: "NE", k: 1, r: 24, kind: "corner" },
  point_SE: { dir: "SE", k: 1, r: 24, kind: "corner" },
  point_SW: { dir: "SW", k: 1, r: 24, kind: "corner" },

  point_h_ajna:      { dir: "W", k: 0.74, r: 16, kind: "axis" },
  point_h_vishuddha: { dir: "W", k: 0.52, r: 16, kind: "axis" },
  point_h_anahata:   { dir: "W", k: 0.30, r: 16, kind: "axis" },
  point_h_svadhi:    { dir: "E", k: 0.33, r: 16, kind: "axis" },

  point_v_ajna:      { dir: "N", k: 0.74, r: 16, kind: "axis" },
  point_v_vishuddha: { dir: "N", k: 0.52, r: 16, kind: "axis" },
  point_v_anahata:   { dir: "N", k: 0.30, r: 16, kind: "axis" },
  point_v_svadhi:    { dir: "S", k: 0.33, r: 16, kind: "axis" },

  point_nw_outer: { dir: "NW", k: 0.72, r: 16, kind: "ray", layer: "rod"   },
  point_nw_mid:   { dir: "NW", k: 0.44, r: 16, kind: "ray", layer: "rod"   },
  point_ne_outer: { dir: "NE", k: 0.72, r: 16, kind: "ray", layer: "rod"   },
  point_ne_mid:   { dir: "NE", k: 0.44, r: 16, kind: "ray", layer: "rod"   },
  point_se_outer: { dir: "SE", k: 0.72, r: 16, kind: "ray", layer: "money" },
  point_se_mid:   { dir: "SE", k: 0.44, r: 16, kind: "ray", layer: "money" },
  point_sw_outer: { dir: "SW", k: 0.72, r: 16, kind: "ray", layer: "love"  },
  point_sw_mid:   { dir: "SW", k: 0.44, r: 16, kind: "ray", layer: "love"  },
};

const LAYERS = [
  { id: "age",   label: "возрастная шкала" },
  { id: "rod",   label: "родовые линии" },
  { id: "money", label: "зона денег" },
  { id: "love",  label: "зона отношений" },
];

const RAY_LAYER = { NW: "rod", NE: "rod", SE: "money", SW: "love" };
const RAY_COLOR = { NW: C.lilac, NE: C.lilac, SE: C.gold, SW: C.pink };

const CX = 260, CY = 260, R0 = 170;
const ORDER = ["W", "NW", "N", "NE", "E", "SE", "S", "SW"];

const at = (dir, k = 1) => {
  const a = (ANG[dir] * Math.PI) / 180;
  return [CX + R0 * k * Math.cos(a), CY - R0 * k * Math.sin(a)];
};

/**
 * POINT_SLOTS + GEOMETRY → готовые точки с координатами и числами.
 * Слот без геометрии молча пропускается: добавили позицию в карту —
 * добавьте ей место на схеме, иначе точки на экране не будет.
 */
function buildPoints(matrix) {
  return POINT_SLOTS.flatMap((slot) => {
    const geo = GEOMETRY[slot.id];
    if (!geo) return [];
    const arcana = resolvePath(matrix, slot.path);
    const [x, y] = at(geo.dir, geo.k);
    return [{ ...slot, ...geo, arcana, x, y }];
  });
}

/**
 * @param {object}  matrix     — результат calculateMatrix() или calculatePair()
 * @param {string}  [emphasis] — луч, на котором держится страница: 'SE' для
 *                               финансов, 'SW' для отношений. Он подсвечен
 *                               и его точка выбрана при открытии.
 * @param {boolean} [showAge]  — возрастное кольцо. У матрицы пары возраста
 *                               нет, поэтому там слой выключается целиком.
 */
export default function Octagram({
  matrix, onOpenSection, emphasis = null, showAge = true,
}) {
  const [layers, setLayers] = useState({ age: showAge, rod: true, money: true, love: true });
  const [selected, setSelected] = useState(emphasis ? `point_${emphasis}` : "point_C");
  const [hovered, setHovered] = useState(null);

  const isPhone = useIsPhone();
  const isTouch = useIsTouch();
  /* Жесты и кнопки масштаба нужны там, где схема мелкая: на телефоне
     и на любом тач-экране. На широком десктопе схема и так читается. */
  const zoomable = isPhone || isTouch;
  const view = useZoomPan(zoomable);

  const points = useMemo(() => buildPoints(matrix), [matrix]);
  const active = points.find((p) => p.id === (hovered || selected)) || points[0];

  const outer = ORDER.map((k) => at(k));
  const rayVisible = (corner) => layers[RAY_LAYER[corner]];
  const visibleLayers = showAge ? LAYERS : LAYERS.filter((l) => l.id !== "age");

  const colorOf = (p) =>
    p.kind === "main" ? C.gold
      : p.kind === "center" ? C.white
      : p.kind === "corner" ? C.lilac
      : p.kind === "ray" ? RAY_COLOR[p.id.split("_")[1].toUpperCase()]
      : C.text;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <div className={isPhone ? "hScroll" : undefined}
        style={isPhone ? { ...hScrollRow, gap: 8, marginBottom: 8, paddingBottom: 4 } : S.layerRow}>
        {visibleLayers.map((l) => {
          const on = layers[l.id];
          return (
            <button key={l.id} className="chip" style={{
              ...S.layerChip,
              ...(isPhone ? { minHeight: TAP, whiteSpace: "nowrap" } : null),
              background: on ? "rgba(183,156,232,0.16)" : "transparent",
              borderColor: on ? C.lilac : C.border,
              color: on ? C.white : C.muted,
            }} onClick={() => setLayers({ ...layers, [l.id]: !on })}>
              <span style={{
                ...S.layerDot,
                background: on ? C.lilac : "transparent",
                borderColor: on ? C.lilac : C.borderHi,
              }} />
              {l.label}
            </button>
          );
        })}
      </div>

      <div
        className="octaStage"
        style={S.octaStage}
        onPointerDown={view.onPointerDown}
        onPointerMove={view.onPointerMove}
        onPointerUp={view.onPointerUp}
        onPointerCancel={view.onPointerUp}
      >
      <svg viewBox="-20 -20 560 560" style={{ width: "100%", height: "100%", display: "block" }}>
        <g transform={view.transform}>
        <defs>
          <radialGradient id="octaCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(183,156,232,0.16)" />
            <stop offset="100%" stopColor="rgba(183,156,232,0.01)" />
          </radialGradient>
        </defs>

        <circle cx={CX} cy={CY} r={R0} fill="url(#octaCore)" />
        {layers.age && (
          <circle cx={CX} cy={CY} r={R0 * 1.24} fill="none" stroke={C.border}
            strokeWidth="0.8" strokeDasharray="2 6" opacity="0.5" />
        )}
        <polygon points={outer.map((p) => p.join(",")).join(" ")}
          fill="none" stroke={C.border} strokeWidth="1" />

        {outer.map((p, i) => (
          <g key={"line" + i}>
            <line x1={p[0]} y1={p[1]} x2={CX} y2={CY} stroke={C.border} strokeWidth="0.8" />
            <line x1={p[0]} y1={p[1]} x2={outer[(i + 3) % 8][0]} y2={outer[(i + 3) % 8][1]}
              stroke={C.border} strokeWidth="0.6" opacity="0.5" />
          </g>
        ))}

        {["NW", "NE", "SE", "SW"].map((k) => rayVisible(k) && (
          <line key={"ray" + k} x1={at(k)[0]} y1={at(k)[1]} x2={CX} y2={CY}
            stroke={RAY_COLOR[k]}
            strokeWidth={emphasis === k ? 3.2 : 1.6}
            opacity={emphasis === k ? 0.95 : emphasis ? 0.28 : 0.5} />
        ))}

        {layers.age && showAge && <AgeRing matrix={matrix} />}

        {points.map((p) => {
          if (p.layer && !layers[p.layer]) return null;
          const isActive = selected === p.id || hovered === p.id;
          const color = colorOf(p);
          return (
            <g key={p.id} className="octaPt" onClick={() => setSelected(p.id)}
              onMouseEnter={() => setHovered(p.id)} onMouseLeave={() => setHovered(null)}>
              {isActive && <circle cx={p.x} cy={p.y} r={p.r + 9} fill={color} opacity="0.14" />}
              <circle cx={p.x} cy={p.y} r={p.r}
                fill={p.kind === "center" ? C.cardHi : C.bg}
                stroke={isActive ? color : p.kind === "axis" ? C.border : color}
                strokeWidth={isActive ? 2.2 : p.kind === "axis" ? 1 : 1.4}
                opacity={p.kind === "axis" && !isActive ? 0.9 : 1} />
              <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central"
                fill={p.kind === "axis" && !isActive ? C.muted : color}
                fontSize={p.kind === "center" ? 25 : p.kind === "main" ? 21 : p.kind === "corner" ? 18 : 13}
                fontFamily={FONT.serif}>{p.arcana}</text>
            </g>
          );
        })}
        </g>
      </svg>
      </div>

      {zoomable && (
        <div style={S.zoomRow}>
          <button style={S.zoomBtn} onClick={view.zoomOut} aria-label="Уменьшить">−</button>
          <button style={S.zoomBtn} onClick={view.zoomIn} aria-label="Увеличить">+</button>
          <button style={{ ...S.zoomBtn, width: "auto", padding: "0 16px", fontSize: 13 }}
            onClick={view.reset} aria-label="Сбросить масштаб">сброс</button>
          <span style={{ ...S.dimSm, marginLeft: "auto" }}>
            {view.k.toFixed(1)}× · щипок и перетаскивание
          </span>
        </div>
      )}

      <PointPanel point={active} onOpenSection={onOpenSection} />
    </div>
  );
}

const MIN_SCALE = 1;
const MAX_SCALE = 3;
const DRAG_THRESHOLD = 6;      // меньше — это клик по точке, а не перетаскивание

/**
 * МАСШТАБ И ПЕРЕТАСКИВАНИЕ СХЕМЫ
 * ==============================
 * Щипок двумя пальцами меняет масштаб, одно касание таскает.
 * Масштаб ограничен 1..3: меньше единицы схема уже влезает целиком,
 * больше тройки числа уезжают из поля зрения.
 *
 * Числа при этом не наезжают друг на друга ни при каком масштабе:
 * увеличивается ВСЯ схема целиком, взаимное расположение точек и
 * размеры подписей меняются одинаково.
 *
 * Порог в шесть пикселей отделяет перетаскивание от клика: без него
 * дрогнувший палец отменял бы выбор точки.
 */
function useZoomPan(enabled) {
  const [state, setState] = useState({ k: 1, x: 0, y: 0 });
  const pointers = useRef(new Map());
  const gesture = useRef(null);

  const clamp = (next) => {
    const k = Math.min(MAX_SCALE, Math.max(MIN_SCALE, next.k));
    /* Не даём утащить схему за край: предел сдвига растёт вместе с масштабом. */
    const limit = (k - 1) * 280;
    return {
      k,
      x: Math.min(limit, Math.max(-limit, next.x)),
      y: Math.min(limit, Math.max(-limit, next.y)),
    };
  };

  const zoomBy = (delta) => setState((prev) => clamp({ ...prev, k: prev.k + delta }));

  const onPointerDown = (e) => {
    if (!enabled) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) {
      gesture.current = { kind: "pan", start: { x: e.clientX, y: e.clientY }, base: state, moved: 0 };
    } else if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      gesture.current = { kind: "pinch", distance: Math.hypot(a.x - b.x, a.y - b.y), base: state };
    }
  };

  const onPointerMove = (e) => {
    if (!enabled || !gesture.current) return;
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    const box = e.currentTarget.getBoundingClientRect();
    const unitsPerPixel = 560 / (box.width || 1);   // viewBox 560 единиц на всю ширину

    if (gesture.current.kind === "pinch" && pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      const ratio = distance / (gesture.current.distance || distance);
      setState(clamp({ ...gesture.current.base, k: gesture.current.base.k * ratio }));
      return;
    }

    if (gesture.current.kind === "pan") {
      const dx = e.clientX - gesture.current.start.x;
      const dy = e.clientY - gesture.current.start.y;
      gesture.current.moved = Math.max(gesture.current.moved, Math.hypot(dx, dy));
      if (gesture.current.moved < DRAG_THRESHOLD) return;
      setState(clamp({
        ...gesture.current.base,
        x: gesture.current.base.x + dx * unitsPerPixel,
        y: gesture.current.base.y + dy * unitsPerPixel,
      }));
    }
  };

  const onPointerUp = (e) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 0) gesture.current = null;
  };

  /* Масштабируем вокруг центра схемы, а не вокруг угла системы координат. */
  const transform = `translate(${CX - state.k * CX + state.x} ${CY - state.k * CY + state.y}) scale(${state.k})`;

  return {
    ...state,
    transform,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    zoomIn: () => zoomBy(0.5),
    zoomOut: () => zoomBy(-0.5),
    reset: () => setState({ k: 1, x: 0, y: 0 }),
  };
}

/** Внешнее кольцо возрастной шкалы: вехи по десять лет и дробление до 2,5. */
function AgeRing({ matrix }) {
  const kR = 1.24;
  const quarters = Array.from({ length: 32 }, (_, i) => {
    const deg = 180 - i * 11.25;               // по часовой стрелке от запада
    const a = (deg * Math.PI) / 180;
    return { i, x: CX + R0 * kR * Math.cos(a), y: CY - R0 * kR * Math.sin(a) };
  });

  return (
    <g>
      {quarters.map((d) => d.i % 4 !== 0 && (
        <circle key={"q" + d.i} cx={d.x} cy={d.y} r="3.4"
          fill="none" stroke={C.borderHi} strokeWidth="0.9" opacity="0.75" />
      ))}
      {ORDER.map((k) => {
        const [x, y] = at(k, kR);
        const [lx, ly] = at(k, kR + 0.15);
        return (
          <g key={"age" + k}>
            <circle cx={x} cy={y} r="14" fill={C.bg} stroke={C.gold} strokeWidth="1" opacity="0.85" />
            <text x={x} y={y} textAnchor="middle" dominantBaseline="central"
              fill={C.gold} fontSize="12" fontFamily={FONT.serif}>{matrix.core[k]}</text>
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="central"
              fill={C.muted} fontSize="10.5">{AGE[k]}</text>
          </g>
        );
      })}
    </g>
  );
}

/**
 * Панель точки: число, название позиции, короткая трактовка и переход
 * в раздел разбора. Раздел ищется по пути точки, а не по её названию:
 * одно и то же число участвует в нескольких разделах, и карта позиций
 * знает, в каком оно расписано подробно.
 */
function PointPanel({ point, onOpenSection }) {
  const section = point ? findSectionForPoint(point.path) : null;

  /* У девяти главных точек в движке есть своя короткая подпись —
     показываем её сразу, не дожидаясь трактовки. */
  const code = point && point.id.replace("point_", "");
  const hint = code && POINT_CODES[code] ? POINT_CODES[code].hint : null;

  const { loading, text } = useSlotText(point && {
    key: textKey(point.id, point.arcana),
    kind: "point",
    slotLabel: point.label,
    arcana: point.arcana,
    sectionTitle: section ? section.sectionTitle : "Октаграмма",
  });

  if (!point) {
    return (
      <div style={S.octaPanel}>
        <p style={S.octaHint}>Нажмите на любое число — покажем, что оно означает.</p>
      </div>
    );
  }

  return (
    <div style={S.octaPanel}>
      <div style={S.octaPanelTop}>
        <span style={S.octaVal}>{point.arcana}</span>
        <div>
          <div style={S.octaTitle}>{point.label}</div>
          <div style={S.octaArc}>Аркан {point.arcana} — {ARCANA_NAMES[point.arcana]}</div>
          {hint && <div style={{ ...S.octaArc, color: C.muted }}>{hint}</div>}
        </div>
      </div>

      <p style={{ ...S.octaHint, opacity: loading ? 0.45 : 1 }}>
        {loading ? "Загружаем трактовку…" : text}
      </p>

      {/* Сфера всегда доступна хотя бы одним вопросом, поэтому ссылка
          никуда не упирается и «под замком» здесь писать нечего. */}
      {section && onOpenSection && (
        <button className="link" style={{ ...S.link, marginTop: 12 }}
          onClick={() => onOpenSection(section.sectionId)}>
          Подробнее: сфера «{section.sectionTitle}»
        </button>
      )}
    </div>
  );
}
