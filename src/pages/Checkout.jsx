import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { DEMO_PROMO, money } from "../lib/plans.js";
import { readOrder, nextChargeDate } from "../lib/order.js";
import { useDraft, saveDraft } from "../lib/checkoutDraft.js";
import { useAccount, updateProfile } from "../lib/account.js";
import { useBackPoint, backToPage } from "../lib/returnTo.js";
import { useIsPhone, useIsNarrow, TAP } from "../theme/responsive.js";

/**
 * ОФОРМЛЕНИЕ ПОКУПКИ — /checkout
 * ==============================
 * Три входа, одна страница:
 *   /checkout?plan=circle
 *   /checkout?product=matrix&date=13-07-1998
 *   /checkout?product=bolts&pack=150
 *
 * ПЕРИОДОВ НЕТ. Подписка только ежемесячная: выбор длительности на этом
 * шаге отвлекает от единственного нужного действия.
 *
 * ДВЕ ССЫЛКИ НАЗАД, и обе сохраняют введённое (lib/checkoutDraft.js).
 * Человек уходит посмотреть тарифы, возвращается — промокод и почта
 * на месте. Иначе это тот же тупик, только на шаг позже.
 *
 * СОГЛАСИЕ — самое важное поле экрана, поэтому пока оно не принято,
 * блок подсвечен золотом и мягко пульсирует. Кнопка оплаты неактивна
 * без почты и галочки, а почему — говорит подсказка над курсором:
 * отдельная строка под кнопкой читается как ошибка, которой ещё не было.
 *
 * ПОЧТА ДЛЯ ЧЕКА сохраняется в профиль ТОЛЬКО после успешной оплаты.
 * Человек, который передумал на этом экране, не должен обнаружить
 * у себя в профиле чужой адрес.
 *
 * Настоящий платёж подключается в lib/payment.js — здесь заглушка,
 * которая через полторы секунды показывает экран успеха.
 */
export default function Checkout() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const account = useAccount();
  const draft = useDraft();
  const back = useBackPoint();
  const isPhone = useIsPhone();
  const isNarrow = useIsNarrow();

  const order = readOrder(params);

  /* Черновик переживает уход на тарифы и обратно. */
  const email = draft.email !== undefined ? draft.email : (account.receiptEmail || account.email || "");
  const promo = draft.promo || "";
  const cert = draft.cert || "";
  const applied = draft.applied || null;

  const [emailErr, setEmailErr] = useState("");
  const [promoErr, setPromoErr] = useState("");
  const [agree, setAgree] = useState(false);
  const [paying, setPaying] = useState(false);
  /* Наведение считаем в JS: прозрачность подсказки задана встроенным
     стилем, а его правило :hover не перебьёт (CLAUDE.md, раздел 8). */
  const [tipOn, setTipOn] = useState(false);

  const discount = applied ? Math.round((order.price * applied.pct) / 100) : 0;
  const total = order.price - discount;
  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(email).trim());
  const ready = emailOk && agree;

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (!code) return;
    if (DEMO_PROMO[code]) {
      saveDraft({ applied: { code, pct: DEMO_PROMO[code] }, promo: "" });
      setPromoErr("");
    } else {
      setPromoErr("Такого промокода нет. Проверьте раскладку и пробелы.");
    }
  };

  const pay = () => {
    if (!ready || paying) return;
    setPaying(true);
    /* ЗАГЛУШКА. Здесь будет createPayment() из lib/payment.js и переход
       на страницу платёжной системы. Доступ выдаёт её webhook, а не мы. */
    setTimeout(() => {
      updateProfile({ receiptEmail: email.trim() });
      navigate(`/checkout/success${window.location.search}`, { replace: true });
    }, 1500);
  };

  const tip = !emailOk ? "Укажите почту для чека" : "Примите условия ниже";

  return (
    <div style={S.cabinet}>
      <div style={S.backRow}>
        <Link to={order.kind === "bolts" ? "/tarify#bolts" : "/tarify"}
          state={backToPage(`/checkout${window.location.search}`, "Вернуться к оформлению")}
          className="backLink2" style={S.backLink2}>
          <span style={{ display: "inline-block", transition: "transform .18s ease" }}>←</span>
          {order.backLabel}
        </Link>
        {back && (
          <>
            <span style={{ color: C.muted }}>·</span>
            <Link to={back.to} className="backLink2" style={S.backLink2}>
              <span style={{ display: "inline-block", transition: "transform .18s ease" }}>←</span>
              {back.label}
            </Link>
          </>
        )}
      </div>

      <h1 style={S.cabH1}>Оформление</h1>

      <div style={{ ...S.checkout, ...(isNarrow ? { gridTemplateColumns: "minmax(0, 1fr)" } : null) }}>
        {/* ─── левая колонка ─── */}
        <div>
          <div className="card" style={S.block}>
            <div style={S.blockTitle}>Почта для чека</div>
            <input className="fld" style={{ ...S.input, borderColor: emailErr ? C.pink : C.border }}
              value={email} placeholder="you@example.com" type="email" autoComplete="email"
              onChange={(e) => { saveDraft({ email: e.target.value }); setEmailErr(""); }}
              onBlur={(e) => {
                const v = e.target.value.trim();
                setEmailErr(!v || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) ? "" : "Проверьте адрес");
              }} />
            {emailErr && <div style={{ color: C.pink, fontSize: 12.5, marginTop: 8 }}>{emailErr}</div>}
            <p style={S.hint}>
              Сюда придёт электронный чек — он обязателен по закону. Это не способ
              входа: войти по этому адресу нельзя. Сохраним в профиль после оплаты.
            </p>
          </div>

          <div style={S.two}>
            <div className="card" style={S.block}>
              <div style={S.blockTitle}>Промокод</div>
              {applied ? (
                <div style={S.appliedRow}>
                  <span style={{ color: C.white, fontFamily: "monospace", fontSize: 14, flex: 1 }}>{applied.code}</span>
                  <span style={{ color: C.ok, fontWeight: 600, fontSize: 14 }}>−{applied.pct}%</span>
                  <button className="delBtn" aria-label="Убрать промокод"
                    style={{
                      background: "none", border: "none", color: C.muted, fontSize: 13,
                      fontFamily: "inherit", padding: 4, transition: "color .16s ease",
                    }}
                    onClick={() => saveDraft({ applied: null })}>✕</button>
                </div>
              ) : (
                <>
                  <div style={S.inWrap}>
                    <input className="fld" style={S.inField} placeholder="Введите код" value={promo}
                      onChange={(e) => { saveDraft({ promo: e.target.value }); setPromoErr(""); }}
                      onKeyDown={(e) => e.key === "Enter" && applyPromo()} />
                    <button className="inAct" style={S.inAct} onClick={applyPromo}>Применить</button>
                  </div>
                  {promoErr && <div style={{ color: C.pink, fontSize: 12.5, marginTop: 8 }}>{promoErr}</div>}
                </>
              )}
            </div>

            <div className="card" style={S.block}>
              <div style={S.blockTitle}>Сертификат</div>
              <div style={S.inWrap}>
                <input className="fld" style={S.inField} placeholder="Код сертификата" value={cert}
                  onChange={(e) => saveDraft({ cert: e.target.value })} />
                <button className="inAct" style={S.inAct}>Активировать</button>
              </div>
            </div>
          </div>

          {/* согласие */}
          <div className={agree ? "card" : "card needAgree"} style={{
            ...S.block,
            borderColor: agree ? C.border : "rgba(228,190,114,0.55)",
            background: agree ? "rgba(23,18,46,0.72)" : "rgba(228,190,114,0.06)",
          }}>
            {!agree && (
              <div style={S.needTag}><span style={S.needDot} /> Нужно принять, чтобы оплатить</div>
            )}
            <button className="agreeRow" style={S.agreeRow} onClick={() => setAgree(!agree)}
              aria-pressed={agree}>
              <span style={{
                ...S.agreeBox,
                background: agree ? C.lilacBtn : "transparent",
                borderColor: agree ? C.lilacBtn : C.gold,
                borderWidth: agree ? 1.5 : 2,
              }}>
                {agree && <span style={{ color: C.ink, fontSize: 13, fontWeight: 700 }}>✓</span>}
              </span>
              <span style={S.agreeText}>
                Я принимаю <span style={S.link}>оферту</span>,{" "}
                <span style={S.link}>пользовательское соглашение</span> и{" "}
                <span style={S.link}>политику обработки данных</span>.
                {order.recurrent ? (
                  <> Понимаю, что подписка «{order.title}» продлевается автоматически
                    и {money(total)} ₽ будут списываться ежемесячно, пока я не отменю
                    её в личном кабинете.</>
                ) : (
                  <> Понимаю, что это разовый платёж {money(total)} ₽
                    и автопродление не подключается.</>
                )}
              </span>
            </button>
          </div>

          {order.recurrent && (
            <div style={S.calmBox}>
              <span style={{ fontSize: 15, flexShrink: 0 }}>🔔</span>
              <span>
                Напомним за три дня до списания. Отменить можно одной кнопкой
                в кабинете в любой момент — без звонков и писем.
              </span>
            </div>
          )}
        </div>

        {/* ─── сводка ─── */}
        <div style={isNarrow ? null : S.sumWrap} className="sumWrap">
          <div className="card" style={S.summary}>
            <div style={S.sumTitle}>{order.title}</div>
            <div style={S.sumSub}>{order.sub}</div>

            <div style={{ marginTop: 16 }}>
              {order.lines.map((l) => (
                <div key={l} style={{ ...S.li, fontSize: 13.5 }}>
                  <span style={S.uMark}>—</span><span>{l}</span>
                </div>
              ))}
            </div>

            <div style={S.sumDivider} />

            <div style={S.sumRow}>
              <span>{order.recurrent ? "Подписка в месяц" : "Стоимость"}</span>
              <span style={{ color: C.white }}>{money(order.price)} ₽</span>
            </div>
            {applied && (
              <div style={{ ...S.sumRow, color: C.ok }}>
                <span>Промокод {applied.code}</span>
                <span>−{money(discount)} ₽</span>
              </div>
            )}

            <div style={S.totalRow}>
              <span style={{ fontSize: 14 }}>К оплате</span>
              <AnimatedPrice value={total} />
            </div>

            <div style={S.nextPay}>
              {order.recurrent ? `Следующее списание ${nextChargeDate()}` : order.note}
            </div>

            <div style={S.payWrap}
              onMouseEnter={() => setTipOn(true)} onMouseLeave={() => setTipOn(false)}>
              <button style={{
                ...S.payBtn,
                background: ready ? C.gold : C.disabled,
                color: ready ? C.ink : C.faint,
                cursor: ready ? "pointer" : "default",
              }} onClick={pay} disabled={paying}>
                {paying
                  ? <><span className="spin" style={S.spin} /> Оплачиваем…</>
                  : `Оплатить ${money(total)} ₽`}
              </button>
              {!ready && (
                <span style={{ ...S.payTip, opacity: tipOn ? 1 : 0 }}>{tip}</span>
              )}
            </div>

            <div style={S.pays}>
              {["Карта", "СБП", "SberPay", "Mir Pay"].map((m) => (
                <span key={m} style={S.payTag}>{m}</span>
              ))}
            </div>
            <p style={S.secure}>
              Способ оплаты выбирается на защищённой странице платёжной системы.
              Данные карты к нам не попадают.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Сумма пересчитывается на глазах: резкая подмена числа выглядит
 * как ошибка, плавная — как ответ на действие.
 */
function AnimatedPrice({ value }) {
  const [shown, setShown] = useState(value);
  const raf = useRef();
  const from = useRef(value);

  useEffect(() => {
    const start = performance.now();
    const begin = from.current;
    const tick = (t) => {
      const k = Math.min(1, (t - start) / 420);
      const eased = 1 - Math.pow(1 - k, 3);
      const next = Math.round(begin + (value - begin) * eased);
      setShown(next);
      from.current = next;
      if (k < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value]);

  return <span style={S.totalValue}>{money(shown)} ₽</span>;
}
