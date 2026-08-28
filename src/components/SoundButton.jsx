import React, { useRef, useEffect, useState } from "react";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { TRACK_URL, VOLUME, HINT_SECONDS, useSound, toggleSound, setSoundEnabled } from "../lib/sound.js";

/**
 * КНОПКА ФОНОВОГО ЗВУКА
 * =====================
 * Живёт в макете, поэтому при переходах между страницами не размонтируется
 * и музыка не обрывается.
 *
 * Звук выключен по умолчанию. Первые несколько секунд значок мягко
 * пульсирует — приглашает нажать, потом перестаёт и больше не отвлекает.
 *
 * Если файла трека нет, кнопка неактивна: браузер сообщает об этом
 * событием error на элементе audio, и мы честно пишем, что трек
 * не подключён, вместо молчаливой кнопки, которая ничего не делает.
 */
export default function SoundButton() {
  const { enabled } = useSound();
  const audioRef = useRef(null);
  const [available, setAvailable] = useState(true);
  const [hinting, setHinting] = useState(true);

  /* Приглашение нажать держится недолго: дальше пульсация — это шум. */
  useEffect(() => {
    const timer = setTimeout(() => setHinting(false), HINT_SECONDS * 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = VOLUME;
    if (!enabled) { audio.pause(); return; }
    /* play() возвращает промис и отклоняется, если браузер не пустил.
       Тогда честно возвращаем переключатель в выключенное состояние. */
    const started = audio.play();
    if (started && typeof started.catch === "function") {
      started.catch(() => setSoundEnabled(false));
    }
  }, [enabled]);

  const label = !available ? "Трек не подключён" : enabled ? "Выключить звук" : "Звук";

  return (
    <>
      <audio ref={audioRef} src={TRACK_URL} loop preload="metadata"
        onError={() => { setAvailable(false); setSoundEnabled(false); }} />

      <button
        className={`iconBtn${hinting && available && !enabled ? " soundHint" : ""}`}
        style={{
          ...S.iconBtn,
          color: enabled ? C.gold : C.muted,
          borderColor: enabled ? C.gold : C.border,
          opacity: available ? 1 : 0.45,
        }}
        onClick={() => available && toggleSound()}
        disabled={!available}
        aria-label={label}
        aria-pressed={enabled}
      >
        {enabled ? <SpeakerOn /> : <SpeakerOff />}
        <span className="tip" style={S.tip}>{label}</span>
      </button>
    </>
  );
}

function SpeakerOn() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path d="M4 9.5h3.2L12 5.6v12.8L7.2 14.5H4z" stroke="currentColor"
        strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M15.6 9.4a3.6 3.6 0 0 1 0 5.2M18.2 7a7 7 0 0 1 0 10"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SpeakerOff() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path d="M4 9.5h3.2L12 5.6v12.8L7.2 14.5H4z" stroke="currentColor"
        strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M16 10l4 4M20 10l-4 4" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
