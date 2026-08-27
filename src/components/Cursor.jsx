import React, { useRef, useEffect } from "react";
import { S } from "../theme/styles.js";

/**
 * КАСТОМНЫЙ КУРСОР
 * ================
 * Золотая точка идёт точно за мышью, сиреневое кольцо догоняет с задержкой
 * и сжимается при нажатии. На тач-устройствах не включается — там курсора нет,
 * и системный возвращает медиазапрос (pointer: coarse) в globalCss.js.
 */
export default function Cursor() {
  const dot = useRef(null), ring = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let mx = -100, my = -100, rx = -100, ry = -100, sc = 1, target = 1, raf;
    const move = (e) => { mx = e.clientX; my = e.clientY; };
    const down = () => { target = 0.45; };
    const up = () => { target = 1; };
    const loop = () => {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      sc += (target - sc) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${mx}px,${my}px,0) translate(-50%,-50%)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%) scale(${sc})`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, []);

  return (
    <>
      <div ref={ring} style={S.curRing} aria-hidden="true" />
      <div ref={dot} style={S.curDot} aria-hidden="true" />
    </>
  );
}
