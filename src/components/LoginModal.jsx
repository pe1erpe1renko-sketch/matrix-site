import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { signIn, SOCIAL_NAMES } from "../lib/account.js";
import { claimGuestPeople } from "../lib/people.js";
import { useAccess } from "../lib/access.js";
import { Modal, CheckRow } from "./Controls.jsx";

/**
 * ВХОД И РЕГИСТРАЦИЯ
 * ==================
 * Две вкладки, четыре соцсети, почта с паролем.
 *
 * СОГЛАСИЯ берутся здесь и только здесь (второй раз — при оплате).
 * В кабинете их нет: человек уже согласился, повторно спрашивать незачем.
 * Без обоих чекбоксов кнопка регистрации не активна — это требование
 * закона, а не украшение.
 *
 * ПРИ ВХОДЕ гостевые расчёты переносятся в аккаунт: человек их уже сделал,
 * терять их нельзя. Что при этом происходит с лимитом — см. claimGuestPeople.
 *
 * ВОЗВРАТ. Если человек ушёл регистрироваться из разбора, после входа
 * он попадает обратно в разбор, а не остаётся на странице, куда его увели.
 * Точку возврата даёт макет (lib/returnTo.js); пришёл из меню — её нет,
 * и человек остаётся там же, где был.
 */
export default function LoginModal({ onClose, back }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeData, setAgreeData] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { plan } = useAccess();

  const isSignup = mode === "signup";
  const ready = email.trim() && password.trim() && (!isSignup || (agreeData && agreeTerms));

  const navigate = useNavigate();

  const finish = (via, mail) => {
    signIn({ via, email: mail });
    claimGuestPeople(plan);
    onClose();
    if (back && back.to) navigate(back.to);
  };

  return (
    <Modal title={isSignup ? "Регистрация" : "Вход"} onClose={onClose} width="min(460px, 100%)">
      <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
        {[["login", "Войти"], ["signup", "Регистрация"]].map(([id, label]) => {
          const on = mode === id;
          return (
            <button key={id} style={{
              ...S.chatTab,
              background: on ? C.cardHi : "transparent",
              color: on ? C.white : C.muted,
              fontWeight: on ? 600 : 400,
            }} onClick={() => setMode(id)}>{label}</button>
          );
        })}
      </div>

      <div style={S.socials}>
        {SOCIAL_NAMES.map((name) => (
          <button key={name} className="socialBtn" style={{ ...S.social, borderColor: C.border, color: C.white }}
            onClick={() => finish(name, "")}>
            <span>{name}</span>
            <span style={S.dimSm}>войти</span>
          </button>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0 16px" }}>
        <span style={{ flex: 1, height: 1, background: C.border }} />
        <span style={S.dimSm}>или по почте</span>
        <span style={{ flex: 1, height: 1, background: C.border }} />
      </div>

      <input className="fld" style={{ ...S.inField, padding: "12px 14px", marginBottom: 10 }}
        type="email" placeholder="Почта" value={email} autoComplete="email"
        onChange={(e) => setEmail(e.target.value)} />
      <input className="fld" style={{ ...S.inField, padding: "12px 14px" }}
        type="password" placeholder="Пароль" value={password}
        autoComplete={isSignup ? "new-password" : "current-password"}
        onChange={(e) => setPassword(e.target.value)} />

      {isSignup && (
        <>
          <CheckRow checked={agreeData} onToggle={() => setAgreeData(!agreeData)}>
            Согласен на обработку персональных данных
          </CheckRow>
          <CheckRow checked={agreeTerms} onToggle={() => setAgreeTerms(!agreeTerms)}>
            Принимаю пользовательское соглашение
          </CheckRow>
        </>
      )}

      <button className={ready ? "btnGold" : ""} disabled={!ready}
        style={{
          ...S.btn, width: "100%", marginTop: 18,
          background: ready ? C.gold : C.disabled,
          color: ready ? C.ink : C.faint,
        }}
        onClick={() => ready && finish("email", email)}>
        {isSignup ? "Создать аккаунт" : "Войти"}
      </button>

      <p style={{ ...S.hint, textAlign: "center" }}>
        Расчёты, сделанные без входа, перенесутся в кабинет и не пропадут.
      </p>
    </Modal>
  );
}
