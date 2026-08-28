import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { C, SURFACE } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { Bolt } from "../components/Icons.jsx";
import ObrazCard from "../components/ObrazCard.jsx";
import DateFields from "../components/DateFields.jsx";
import BackToReport from "../components/BackToReport.jsx";
import { BoltShortage } from "../components/BoltGate.jsx";
import {
  IMAGE_THEMES, LOADING_LINES, themeById, themeArcana, arcanaName,
  useImages, imageCost, rememberImage,
} from "../lib/images.js";
import { downloadImage } from "../lib/imageFile.js";
import { useBolts, spendBolts } from "../lib/bolts.js";
import { useAccess } from "../lib/access.js";
import { usePeople, personLabel } from "../lib/people.js";
import { calculateMatrix } from "../lib/matrixEngine.js";
import { partsToUrlDate, urlDateToISO, isoToUrlDate } from "../lib/urlDate.js";
import { useIsPhone, TAP } from "../theme/responsive.js";
import { useSlotText } from "../components/useSlotText.js";

/**
 * AI-ОБРАЗЫ — /obrazy
 * ===================
 * Четыре состояния на одной странице: меню тем → тема → сцена сборки →
 * готовый образ. Отдельные адреса им не нужны: это один короткий путь,
 * и «назад» внутри него должно возвращать к темам, а не на прошлую
 * страницу сайта.
 *
 * НЕЙРОСЕТЬ НЕ ВЫЗЫВАЕТСЯ: образ собирается из готовой иллюстрации
 * аркана и оформления. Сцена на две секунды — оформление ожидания.
 *
 * ПЕРВЫЙ ОБРАЗ БЕСПЛАТЕН ВСЕМ. Это канал привлечения новых людей,
 * а не расход: картинку человек ставит на заставку и отправляет
 * близким, а по ссылке приходят считать свою матрицу.
 */
export default function Obrazy() {
  const isPhone = useIsPhone();
  const { plan } = useAccess();
  const { balance } = useBolts();
  const people = usePeople();
  const made = useImages();

  const [stage, setStage] = useState("menu");     // menu | detail | gen | done
  const [pickId, setPickId] = useState(null);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [shortage, setShortage] = useState(false);

  /* Чья матрица. Если сохранённых несколько — человек выбирает. */
  const [personId, setPersonId] = useState(null);
  const person = people.find((p) => p.id === personId) || people[0] || null;

  /* Поля парной темы и подарка. */
  const [second, setSecond] = useState({ d: "", m: "", y: "" });
  const [gift, setGift] = useState({ d: "", m: "", y: "" });
  const [giftName, setGiftName] = useState("");

  const theme = themeById(pickId);
  const price = imageCost(plan, made);

  const matrix = useMemo(() => {
    if (!person) return null;
    try {
      return calculateMatrix(person.birthDate);
    } catch {
      return null;
    }
  }, [person]);

  const secondUrl = partsToUrlDate(second);
  const giftUrl = partsToUrlDate(gift);
  const secondIso = secondUrl ? urlDateToISO(secondUrl) : null;
  const giftIso = giftUrl ? urlDateToISO(giftUrl) : null;

  const arcana = themeArcana(theme, {
    matrix,
    birthDate: person ? person.birthDate : null,
    secondDate: secondIso,
    giftDate: giftIso,
  });

  /* Сцена сборки: три строки по очереди, вся сцена — 2,2 секунды. */
  useEffect(() => {
    if (stage !== "gen") return undefined;
    setStep(0);
    const a = setTimeout(() => setStep(1), 640);
    const b = setTimeout(() => setStep(2), 1280);
    const c = setTimeout(() => setStage("done"), 1980);
    return () => { clearTimeout(a); clearTimeout(b); clearTimeout(c); };
  }, [stage]);

  const openTheme = (id) => { setPickId(id); setStage("detail"); setCopied(false); };

  const create = () => {
    if (!arcana) return;

    if (!price.free) {
      const paid = spendBolts(price.cost, `AI-образ · ${theme.name}`);
      if (!paid.ok) { setShortage(true); return; }
    }

    const who = theme.kind === "gift"
      ? (giftName.trim() || "Близкому")
      : theme.kind === "pair"
        ? `${personLabel(person)} + второй`
        : personLabel(person);

    const date = theme.kind === "gift" ? giftUrl
      : theme.kind === "pair" ? isoToUrlDate(person.birthDate)
        : isoToUrlDate(person.birthDate);

    /* theme здесь — НАЗВАНИЕ темы: его печатает и карточка, и файл. */
    const image = { themeId: theme.id, theme: theme.name, arcana, who, date, accent: theme.accent };
    const id = rememberImage({ themeId: theme.id, arcana, who, date });
    setResult({ ...image, id });
    setStage("gen");
  };

  const share = async () => {
    const url = `${window.location.origin}/obraz/${result.id}`;
    /* На телефоне отдаём системное меню: пересылка в мессенджер одним
       нажатием — это и есть та механика, ради которой всё делалось. */
    if (navigator.share) {
      try {
        await navigator.share({ title: "Мой образ по матрице", url });
        return;
      } catch {
        /* закрыл системное меню — молча падаем в копирование */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* браузер не дал буфер — ссылка всё равно видна на экране */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  /* Считать не по чему: у человека нет ни одной сохранённой даты. */
  if (!person) {
    return (
      <div style={S.cabinet}>
        <BackToReport />
        <div style={S.eyebrow}>AI-образы</div>
        <h1 style={S.cabH1}>Ваш талисман по матрице</h1>
        <div className="card" style={{ ...S.block, maxWidth: 620 }}>
          <p style={{ ...S.infoText, marginTop: 0 }}>
            Образ собирается по числам вашей матрицы — сначала нужно её посчитать.
            Это бесплатно и занимает пару секунд.
          </p>
          <Link to="/matrica" className="btnGold" style={{
            ...S.ctaSmall, background: C.gold, color: C.ink, minHeight: TAP,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}>Посчитать матрицу</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={S.cabinet}>
      <BackToReport />

      <div style={{ ...S.head, alignItems: "flex-start" }}>
        <div>
          <div style={S.eyebrow}>AI-образы</div>
          <h1 style={S.cabH1}>Ваш талисман <em style={S.h1em}>по матрице</em></h1>
        </div>
      </div>

      {stage === "menu" && (
        <>
          <p style={{ ...S.infoText, maxWidth: 640 }}>
            Иногда один точный образ работает сильнее длинного текста. Мы соберём
            картинку по вашим числам — её можно поставить на заставку, сохранить
            или отправить близкому.
          </p>

          {price.free ? (
            <div style={S.obrazFree}>
              <span style={{ width: 7, height: 7, borderRadius: 4, background: C.ok, display: "block" }} />
              {price.reason === "first"
                ? `Первый образ — бесплатно. Дальше ${5} молний за штуку.`
                : "Этот образ входит в ваш тариф."}
            </div>
          ) : (
            <div style={{ ...S.obrazFree, background: "rgba(228,190,114,0.08)", borderColor: "rgba(228,190,114,0.35)" }}>
              <Bolt size={13} /> Образы тарифа на этот месяц использованы. Дальше — {price.cost} молний за образ.
            </div>
          )}

          {people.length > 1 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
              {people.map((p) => {
                const on = p.id === person.id;
                return (
                  <button key={p.id} className="chip" style={{
                    ...S.chip, background: on ? C.lilacBtn : "transparent",
                    borderColor: on ? C.lilacBtn : C.border, color: on ? C.ink : C.text,
                    minHeight: isPhone ? TAP : 0,
                  }} onClick={() => setPersonId(p.id)}>{personLabel(p)}</button>
                );
              })}
            </div>
          )}

          <div style={S.obrazGrid}>
            {IMAGE_THEMES.map((t) => {
              const n = themeArcana(t, { matrix, birthDate: person.birthDate });
              return (
                <button key={t.id} className="obrazTile" style={S.obrazTile} onClick={() => openTheme(t.id)}>
                  {n ? (
                    <ObrazCard arcana={n} accent={t.accent} width={74} />
                  ) : (
                    <span style={{
                      width: 74, height: 99, flexShrink: 0, borderRadius: 12,
                      border: `1px solid ${t.accent}`, display: "flex", alignItems: "center",
                      justifyContent: "center", color: t.accent, fontSize: 22,
                      background: `linear-gradient(165deg, ${t.accent}22, #0A0817)`,
                    }}>?</span>
                  )}
                  <span style={{ minWidth: 0, flex: 1 }}>
                    <span style={{ ...S.obrazName, display: "block" }}>{t.name}</span>
                    <span style={{ ...S.obrazFrom, display: "block" }}>
                      {t.from}{n ? ` · аркан ${n}` : " · нужна вторая дата"}
                    </span>
                    <span style={{ ...S.infoText, fontSize: 13.5, display: "block", margin: 0 }}>{t.about}</span>
                  </span>
                  <span className="obrazArrow" style={{
                    color: t.accent, fontSize: 18, alignSelf: "center",
                    transition: "transform .2s ease",
                  }}>→</span>
                </button>
              );
            })}
          </div>

          {made.length > 0 && (
            <p style={{ ...S.dimSm, marginTop: 20 }}>
              Создано образов: {made.length}. Ссылки на них живут в браузере.
            </p>
          )}
        </>
      )}

      {stage === "detail" && theme && (
        <div style={{ maxWidth: 860 }}>
          <button className="backLink2" style={{ ...S.backLink2, marginBottom: 18 }}
            onClick={() => setStage("menu")}>
            <span style={{ display: "inline-block", transition: "transform .18s ease" }}>←</span> Все образы
          </button>

          <div className="card" style={{ ...S.obrazDetail, borderColor: theme.accent }}>
            {arcana
              ? <ObrazCard arcana={arcana} accent={theme.accent} width={isPhone ? 150 : 190} />
              : <span style={{
                width: isPhone ? 150 : 190, aspectRatio: "3 / 4", flexShrink: 0, borderRadius: 16,
                border: `1px solid ${theme.accent}`, display: "flex", alignItems: "center",
                justifyContent: "center", color: theme.accent, fontSize: 40,
                background: `linear-gradient(165deg, ${theme.accent}22, #0A0817)`,
              }}>?</span>}

            <div style={{ flex: "1 1 300px", minWidth: 0 }}>
              <div style={{ ...S.obrazFrom, color: theme.accent }}>
                {theme.from}{arcana ? ` · аркан ${arcana} — ${arcanaName(arcana)}` : ""}
              </div>
              <h2 style={{ ...S.h2, marginBottom: 12 }}>{theme.name}</h2>
              <p style={{ ...S.infoText, marginTop: 0 }}>{theme.text}</p>

              {theme.kind === "pair" && (
                <div style={{ marginTop: 4 }}>
                  <label style={S.fieldLabel}>Дата рождения второго человека</label>
                  <DateFields value={second} onChange={setSecond} idPrefix="pair-" stack />
                </div>
              )}

              {theme.kind === "gift" && (
                <div style={{ marginTop: 4 }}>
                  <label style={S.fieldLabel}>Имя того, кому дарите</label>
                  <input className="fld" style={S.input} value={giftName} maxLength={20}
                    placeholder="Как подписать образ"
                    onChange={(e) => setGiftName(e.target.value)} />
                  <label style={S.fieldLabel}>Его дата рождения</label>
                  <DateFields value={gift} onChange={setGift} idPrefix="gift-" stack />
                </div>
              )}

              <button className={arcana ? "btnGold" : undefined} disabled={!arcana}
                onClick={create}
                style={{
                  ...S.ctaSmall, marginTop: 16, minHeight: TAP, gap: 10,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  background: arcana ? C.gold : C.disabled,
                  color: arcana ? C.ink : C.faint,
                  cursor: arcana ? "pointer" : "default",
                  width: isPhone ? "100%" : "auto",
                }}>
                Создать образ
                {price.free
                  ? <span style={S.priceTag}>бесплатно</span>
                  : <span style={S.priceTag}><Bolt size={13} color={C.ink} />{price.cost}</span>}
              </button>

              {!price.free && (
                <div style={{ ...S.dimSm, marginTop: 10 }}>
                  После создания останется {Math.max(0, balance - price.cost)} молний
                </div>
              )}
              {!arcana && (
                <div style={{ ...S.dimSm, marginTop: 10 }}>
                  {theme.kind === "gift"
                    ? "Заполните дату рождения — по ней и считается образ."
                    : "Заполните вторую дату — образ пары считается по двум."}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {stage === "gen" && result && (
        <div style={S.obrazGen}>
          <div className="pulseCard">
            <ObrazCard {...result} width={isPhone ? 220 : 260} dim />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {LOADING_LINES.map((line, i) => (
              <div key={line} style={{
                ...S.genLine,
                opacity: i <= step ? 1 : 0.25,
                color: i === step ? C.white : C.muted,
              }}>
                {i < step
                  ? <span style={{ color: C.ok }}>✓</span>
                  : <span style={S.genDot} />}
                {line}
              </div>
            ))}
          </div>
        </div>
      )}

      {stage === "done" && result && (
        <div style={S.obrazDone}>
          <div className="appearCard">
            <ObrazCard {...result} width={isPhone ? 280 : 300} />
          </div>

          <div style={{ flex: "1 1 300px", minWidth: 0 }}>
            <div style={{ ...S.sumTitle, marginBottom: 12 }}>
              Готово. Это ваш {themeById(result.themeId).name.toLowerCase()}
            </div>
            <ImageText result={result} />
            <p style={{ ...S.infoText }}>{themeById(result.themeId).hint}</p>

            <div style={S.obrazBtns}>
              <button className="btnGold" style={{ ...S.ctaSmall, background: C.gold, color: C.ink, minHeight: TAP }}
                onClick={() => downloadImage(result, result.themeId)}>
                Сохранить картинку
              </button>
              <button className="btnOutline" style={{
                ...S.ctaSmall, border: `1px solid ${C.border}`, color: C.white, minHeight: TAP,
              }} onClick={share}>
                {copied ? "Ссылка скопирована" : "Поделиться"}
              </button>
              <button className="btnGhost" style={{ ...S.ctaSmall, minHeight: TAP }}
                onClick={() => setStage("menu")}>
                Все образы
              </button>
            </div>

            <p style={{ ...S.dimSm, marginTop: 16, maxWidth: 320 }}>
              По вашей ссылке человек увидит образ и сможет посчитать свою матрицу.
            </p>
          </div>
        </div>
      )}

      {shortage && (
        <BoltShortage cost={price.cost || 5} balance={balance} onClose={() => setShortage(false)} />
      )}
    </div>
  );
}

/**
 * Текст к образу. Просит у контентного слоя тип 'image' — короткие
 * два-три предложения о том, что в образе про этого человека.
 * Ключ включает тему и аркан: сочетаний конечное число, и текст,
 * написанный один раз, дальше отдаётся бесплатно.
 */
function ImageText({ result }) {
  const theme = themeById(result.themeId);
  const { loading, text } = useSlotText({
    key: `image_${result.themeId}_${result.arcana}`,
    kind: "image",
    theme: theme.name,
    themeAbout: theme.about,
    arcana: result.arcana,
    slotLabel: theme.name,
    sectionTitle: "AI-образ",
  });

  return (
    <p style={{ ...S.infoText, marginTop: 0, opacity: loading ? 0.45 : 1 }}>
      {loading ? "Собираем текст к образу…" : text}
    </p>
  );
}
