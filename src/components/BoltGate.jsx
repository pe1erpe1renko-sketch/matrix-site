import React from "react";
import { Link } from "react-router-dom";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { Bolt } from "./Icons.jsx";
import { Modal } from "./Controls.jsx";
import { BOLT_PACKS, PLAN_LIMITS, nextPlanUp, money } from "../lib/plans.js";
import { useAccess } from "../lib/access.js";
import { TAP } from "../theme/responsive.js";

/**
 * ДВА ОКНА ВОКРУГ СПИСАНИЯ МОЛНИЙ
 * ===============================
 *
 * ПОДТВЕРЖДЕНИЕ показывается только перед КРУПНЫМ списанием — образ,
 * дата. На сообщение наставнику подтверждения нет: в переписке это
 * раздражает сильнее, чем защищает.
 *
 * НЕ ХВАТАЕТ — не ошибка, а лучший момент для продажи. Кнопку мы
 * не блокируем: человек нажимает, видит, сколько не хватает, цену
 * пакета и строку о том, что на следующем тарифе это входит
 * в подписку. Заблокированная кнопка не объясняет ничего.
 */

/** Спишется столько-то, останется столько-то. */
export function BoltConfirm({ cost, balance, what, onConfirm, onClose }) {
  return (
    <Modal title="Подтверждение" onClose={onClose} width="min(420px, 100%)">
      <div style={S.boltModalRow}>
        <Bolt size={18} />
        <span style={{ color: C.white }}>
          Спишется {cost} {plural(cost, "молния", "молнии", "молний")}, останется {balance - cost}
        </span>
      </div>
      <p style={{ ...S.infoText, marginTop: 0 }}>{what}</p>
      <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
        <button className="btnGold" style={{ ...S.btnSm, background: C.gold, color: C.ink, minHeight: TAP, flex: 1 }}
          onClick={onConfirm}>Списать и продолжить</button>
        <button className="btnGhost" style={{ ...S.btnSm, minHeight: TAP }} onClick={onClose}>Отмена</button>
      </div>
    </Modal>
  );
}

/** Молний не хватает: сколько нужно, что купить и что входит в тариф. */
export function BoltShortage({ cost, balance, onClose }) {
  const { plan } = useAccess();
  const up = nextPlanUp(plan);
  const short = cost - balance;
  /* Самый маленький пакет, который закрывает недостачу. */
  const pack = BOLT_PACKS.find((p) => p.n >= short) || BOLT_PACKS[BOLT_PACKS.length - 1];

  return (
    <Modal title="Не хватает молний" onClose={onClose} width="min(460px, 100%)">
      <div style={S.boltModalRow}>
        <Bolt size={18} />
        <span style={{ color: C.white }}>
          Нужно {cost}, на балансе {balance}. Не хватает {short}.
        </span>
      </div>

      <p style={{ ...S.infoText, marginTop: 0 }}>
        Пакет {pack.n} молний стоит {money(pack.price)} ₽ — это {pack.per}.
      </p>

      {up && (
        <p style={{ ...S.infoText, color: C.gold }}>
          На тарифе «{PLAN_LIMITS[up].label}» {PLAN_LIMITS[up].bolts} молний приходят каждый месяц
          и докупать их не нужно.
        </p>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
        <Link to={`/checkout?product=bolts&pack=${pack.id}`} className="btnGold"
          style={{ ...S.btnSm, background: C.gold, color: C.ink, minHeight: TAP, flex: 1,
            display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          Купить {pack.n} за {money(pack.price)} ₽
        </Link>
        {up && (
          <Link to={`/checkout?plan=${up}`} className="btnOutline"
            style={{ ...S.btnSm, border: `1px solid ${C.border}`, color: C.white, minHeight: TAP,
              display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            Тариф «{PLAN_LIMITS[up].label}»
          </Link>
        )}
      </div>
    </Modal>
  );
}

function plural(n, one, few, many) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}
