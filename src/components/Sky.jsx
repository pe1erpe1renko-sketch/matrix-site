import React, { useRef, useEffect, useMemo } from "react";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";

/**
 * ЖИВОЙ ФОН
 * =========
 * Три слоя звёзд с разной скоростью параллакса за курсором плюс воронка
 * из девяти вложенных октаграмм по центру экрана.
 *
 * Фон один на весь сайт и живёт в макете, а не на странице: при переходе
 * между страницами он не должен моргать и пересобираться заново.
 *
 * На тач-устройствах параллакс не запускается — там нет курсора,
 * а анимация просто ест батарею.
 */
export default function Sky() {
  const l0 = useRef(null), l1 = useRef(null), l2 = useRef(null);
  const tunnel = useRef(null);

  const layers = useMemo(() => {
    const rnd = (s) => { const x = Math.sin(s) * 10000; return x - Math.floor(x); };
    return [0, 1, 2].map((li) =>
      Array.from({ length: 46 }, (_, i) => {
        const k = li * 100 + i;
        return {
          x: rnd(k * 1.7) * 100, y: rnd(k * 3.1) * 100,
          s: 0.7 + rnd(k * 5.3) * (1.2 + li * 0.7),
          o: 0.16 + rnd(k * 7.9) * 0.55,
          d: rnd(k * 2.3) * 7,
        };
      })
    );
  }, []);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const refs = [l0, l1, l2];
    const depth = [22, 46, 82];
    let tx = 0, ty = 0, cx = 0, cy = 0, raf;
    const move = (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const loop = () => {
      cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
      refs.forEach((l, i) => {
        if (l.current) l.current.style.transform = `translate3d(${-cx * depth[i]}px, ${-cy * depth[i]}px, 0)`;
      });
      if (tunnel.current)
        tunnel.current.style.transform = `translate(-50%,-50%) translate3d(${-cx * 58}px, ${-cy * 58}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener("mousemove", move);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", move); };
  }, []);

  const rings = [1, 0.79, 0.62, 0.48, 0.375, 0.29, 0.225, 0.175, 0.135];
  const octa = (r) => Array.from({ length: 8 }, (_, i) => {
    const ang = (Math.PI / 4) * i - Math.PI / 2;
    return [300 + r * Math.cos(ang), 300 + r * Math.sin(ang)];
  });

  return (
    <div style={S.sky} aria-hidden="true">
      {[l0, l1, l2].map((ref, li) => (
        <div key={li} ref={ref} style={S.skyLayer}>
          <div className="fly" style={{ animationDuration: [150, 105, 70][li] + "s" }}>
            {[0, 1].map((copy) => (
              <div key={copy} style={{ position: "absolute", left: 0, right: 0, height: "100%", top: copy * 100 + "%" }}>
                {layers[li].map((s, i) => (
                  <span key={i} className="star" style={{
                    left: s.x + "%", top: s.y + "%",
                    width: s.s, height: s.s, opacity: s.o,
                    animationDelay: s.d + "s",
                  }} />
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div ref={tunnel} style={S.tunnelWrap}>
        <div style={S.glow} />
        <svg viewBox="0 0 600 600" style={S.tunnelSvg}>
          <defs>
            <radialGradient id="fade" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={C.gold} stopOpacity="0.95" />
              <stop offset="55%" stopColor={C.lilac} stopOpacity="0.5" />
              <stop offset="100%" stopColor={C.lilac} stopOpacity="0.12" />
            </radialGradient>
          </defs>
          {rings.map((k, idx) => {
            const pts = octa(262 * k);
            return (
              <g key={idx} className={idx % 2 ? "spinB" : "spinA"}
                style={{ transformOrigin: "300px 300px", animationDuration: 220 - idx * 16 + "s" }}>
                <g transform={`rotate(${idx * 6.5} 300 300)`} opacity={0.1 + idx * 0.085}>
                  <polygon points={pts.map((p) => p.join(",")).join(" ")}
                    fill="none" stroke="url(#fade)" strokeWidth={0.9 + idx * 0.12} />
                  {pts.map(([x, y], i) => (
                    <line key={i} x1={x} y1={y}
                      x2={pts[(i + 3) % 8][0]} y2={pts[(i + 3) % 8][1]}
                      stroke="url(#fade)" strokeWidth="0.55" opacity="0.6" />
                  ))}
                  {idx < 4 && pts.map(([x, y], i) => (
                    <circle key={"d" + i} cx={x} cy={y} r={2.6 - idx * 0.4} fill={C.gold} opacity="0.9" />
                  ))}
                </g>
              </g>
            );
          })}
          <circle cx="300" cy="300" r="16" fill={C.lilac} opacity="0.14" />
          <circle cx="300" cy="300" r="3.4" fill={C.goldHi} opacity="0.95" />
        </svg>
      </div>
    </div>
  );
}
