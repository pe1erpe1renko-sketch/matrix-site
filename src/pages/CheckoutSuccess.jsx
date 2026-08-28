import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { PLAN_LIMITS, PLAN_PRICE, PLAN_COPY, BOLT_SPEND, money } from "../lib/plans.js";
import { readOrder } from "../lib/order.js";
import { useBolts, grantBolts, boltsWorth } from "../lib/bolts.js";
import { clearDraft } from "../lib/checkoutDraft.js";
import { setPlan, unlockReport, useAccess, reportKey } from "../lib/access.js";
import { Bolt } from "../components/Icons.jsx";
import { urlDateToISO } from "../lib/urlDate.js";
import { TAP } from "../theme/responsive.js";

/**
 * ПОСЛЕ ОПЛАТЫ — /checkout/success
 * ================================
 * Самый важный экран воронки: человек только что заплатил, доверие
 * на максимуме, и именно здесь он готов сделать следующий шаг.
 * Поэтому экран не заканчивается словом «Готово», а предлагает
 * ровно одно продолжение — своё для каждой покупки.
 *
 * Купил разовый разбор → показываем, что даёт подписка. Не «купите ещё»,
 * а честное сравнение двух колонок: что у него есть сейчас и что
 * появится. Купил подписку → три первых шага. Купил молнии → новый
 * баланс и на что его хватит.
 *
 * ВАЖНО ДЛЯ ПРИНИМАЮЩЕЙ КОМАНДЫ: доступ здесь выдаётся заглушкой,
 * потому что бэкенда ещё нет. По-настоящему его выдаёт webhook
 * платёжной системы (lib/payment.js) — до этого экрана можно дойти
 * по прямой ссылке, ничего не оплатив.
 */
export default function CheckoutSuccess() {
  const [params] = useSearchParams();
  const order = readOrder(params);
  const { balance } = useBolts();
  const { plan: currentPlan } = useAccess();

  /* ЗАГЛУШКА выдачи доступа. Настоящую делает webhook. */
  useEffect(() => {
    clearDraft();
    if (order.kind === "plan" || order.kind === "plan-once") {
      setPlan(order.id);
      grantBolts(PLAN_LIMITS[order.id].bolts, `тариф «${PLAN_LIMITS[order.id].label}»`);
    } else if (order.kind === "bolts") {
      grantBolts(order.bolts, `пакет ${order.bolts} молний`);
    } else if (order.kind === "report") {
      /* Разовый разбор — это и есть тариф «Разовый разбор». Без перевода
         на него лимит остался бы нулевым, и оплаченная дата не открылась. */
      if (currentPlan === "free") setPlan("once");
      const iso = (order.dates || []).map(urlDateToISO).filter(Boolean);
      if (iso.length) unlockReport(reportKey(iso));
      grantBolts(PLAN_LIMITS.once.bolts, "подарок к разбору");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isReport = order.kind === "report";
  const isBolts = order.kind === "bolts";
  const isSub = order.recurrent;
  const worth = boltsWorth(balance);

  return (
    <div style={S.cabinet}>
      <div style={S.okWrap}>
        <div className="okIcon" style={S.okIcon}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
            <path d="M4 12.5 L9.5 18 L20 6.5" stroke={C.ink} strokeWidth="2.6"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 style={{ ...S.cabH1, textAlign: "center", marginBottom: 10 }}>Готово</h1>
        <p style={{ ...S.infoText, textAlign: "center", marginBottom: 26 }}>
          {isBolts ? "Молнии зачислены на баланс."
            : isReport ? "Разбор открыт целиком. Чек отправлен на почту."
              : `Тариф «${order.title}» активен. Чек отправлен на почту.`}
        </p>

        <div className="card" style={S.okCard}>
          {isBolts ? (
            <>
              <div style={S.okBig}>{balance} <Bolt size={30} /></div>
              <div style={{ ...S.dimSm, marginTop: 6, marginBottom: 18 }}>новый баланс молний</div>
              <div style={S.okList}>
                {BOLT_SPEND.map((s) => (
                  <div key={s.what} style={S.li}>
                    <span style={S.uMark}>—</span>
                    <span>{s.n} {s.n === 1 ? "молния" : "молний"} — {s.what}</span>
                  </div>
                ))}
              </div>
              <p style={{ ...S.dimSm, marginTop: 16 }}>
                Хватит на {worth.messages} сообщений наставнику или на {worth.images} образов
              </p>
            </>
          ) : (
            <>
              <div style={S.blockTitle}>Что открылось</div>
              <div style={S.okList}>
                {order.lines.map((l) => (
                  <div key={l} style={S.li}>
                    <span style={{ ...S.uMark, color: C.ok }}>✓</span><span>{l}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div style={S.okBtns}>
          <Link to={isBolts ? "/chat"
            : isReport && order.dates && order.dates.length > 1 ? `/sovmestimost/${order.dates.join("/")}`
              : isReport && order.date ? `/matrica/${order.date}` : "/profil"}
            className="btnGold"
            style={{ ...S.ctaSmall, background: C.gold, color: C.ink, minHeight: TAP,
              display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            {isBolts ? "Вернуться к наставнику" : isReport ? "Открыть разбор" : "В личный кабинет"}
          </Link>
          <Link to="/tarify" className="btnOutline"
            style={{ ...S.ctaSmall, border: `1px solid ${C.border}`, color: C.white, minHeight: TAP,
              display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            Тарифы и оплата
          </Link>
        </div>

        {/* допродажа подписки после разового разбора */}
        {isReport && <UpsellPath price={order.price} />}

        {isSub && <StartTiles />}
      </div>
    </div>
  );
}

function UpsellPath({ price }) {
  const path = PLAN_PRICE.path.amount;

  return (
    <div className="card" style={S.upsell}>
      <div style={S.blockTitle}>Стоит знать</div>
      <div style={{ ...S.sumTitle, marginBottom: 20, lineHeight: 1.3 }}>
        Вы заплатили {money(price)} ₽ за один разбор. За {money(path)} ₽ в месяц — совсем другое
      </div>

      <div style={S.upGrid}>
        <div>
          <div style={S.upCol}>Сейчас у вас</div>
          {["1 разбор", "Аркан дня — только сегодня",
            `${PLAN_LIMITS.once.bolts} молний разово`, "Telegram не подключён"].map((x) => (
            <div key={x} style={S.upLine}><span style={{ color: C.muted }}>—</span> {x}</div>
          ))}
        </div>
        <div>
          <div style={{ ...S.upCol, color: C.gold }}>С подпиской «{PLAN_LIMITS.path.label}»</div>
          {["2 разбора", "Аркан дня каждое утро",
            `${PLAN_LIMITS.path.bolts} молний каждый месяц`, "Прогноз в Telegram себе"].map((x) => (
            <div key={x} style={S.upLine}><span style={{ color: C.ok }}>✓</span> {x}</div>
          ))}
        </div>
      </div>

      <Link to="/checkout?plan=path" className="btnGold"
        style={{ ...S.ctaSmall, background: C.gold, color: C.ink, marginTop: 18, minHeight: TAP,
          display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        Подключить «{PLAN_LIMITS.path.label}» за {money(path)} ₽/мес
      </Link>
      <div style={{ ...S.dimSm, marginTop: 10 }}>Отменить можно в любой момент</div>
    </div>
  );
}

function StartTiles() {
  const tiles = [
    ["Посчитайте близкого", "Матрица считается по любой дате", "/matrica"],
    ["Подключите Telegram", "Аркан дня будет приходить вечером", "/profil"],
    ["Спросите наставника", "Он видит вашу матрицу целиком", "/chat"],
  ];

  return (
    <div className="card" style={S.upsell}>
      <div style={S.blockTitle}>С чего начать</div>
      <div style={S.upGrid}>
        {tiles.map(([title, sub, to]) => (
          <Link key={title} to={to} className="startTile" style={S.startTile}>
            <div style={{ color: C.white, fontSize: 15, marginBottom: 5 }}>{title}</div>
            <div style={S.dimSm}>{sub}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
