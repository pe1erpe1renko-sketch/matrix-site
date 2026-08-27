import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { PLAN_LIMITS, PLAN_ORDER } from "../lib/plans.js";
import { useAccess } from "../lib/access.js";
import { useAccount } from "../lib/account.js";
import { usePeople, personLabel } from "../lib/people.js";
import { useConversations, startConversation, openConversation, appendExchange, messagesToday } from "../lib/conversations.js";
import { buildMentorContext, mentorPlaceholder } from "../lib/mentorContext.js";
import { calculateMatrix, toISODate } from "../lib/matrixEngine.js";
import { Spark } from "../components/Icons.jsx";
import LoginModal from "../components/LoginModal.jsx";
import { useIsPhone, hScrollRow, TAP } from "../theme/responsive.js";

/**
 * ИИ-НАСТАВНИК — /chat
 * ====================
 * Колонка по центру и ограничена по ширине: длинные строки во весь экран
 * читать невозможно.
 *
 * ПЕРЕКЛЮЧАТЕЛЬ «О КОМ ГОВОРИМ» меняет контекст, который уходит наставнику:
 * выбрали ребёнка — уходит его матрица, а не своя. Контекст собирает
 * buildMentorContext() из src/lib/mentorContext.js.
 *
 * ИСТОРИЯ: каждый разговор хранится отдельно, название формируется
 * по первому вопросу. «Новый разговор» всегда начинает пустой.
 *
 * Пока нейросеть не подключена, ответ собирается шаблоном на НАСТОЯЩИХ
 * числах — экран не выглядит сломанным, и видно, что контекст доезжает.
 */

const HINTS = [
  "Почему в отношениях повторяется одно и то же?",
  "На что опереться в текущем периоде?",
  "Через что ко мне приходят деньги?",
  "Как подойти к ребёнку, чтобы не давить?",
];

export default function Chat() {
  const account = useAccount();
  const people = usePeople();
  const { plan } = useAccess();
  const { list, activeId } = useConversations();

  const [view, setView] = useState("chat");
  const [draft, setDraft] = useState("");
  const [aboutId, setAboutId] = useState(null);
  const [login, setLogin] = useState(false);
  const isPhone = useIsPhone();

  const limits = PLAN_LIMITS[plan];
  const askedToday = messagesToday(list, toISODate(new Date()));
  const left = Number.isFinite(limits.messages) ? Math.max(0, limits.messages - askedToday) : Infinity;

  const active = list.find((c) => c.id === activeId) || null;
  const messages = active ? active.messages : [];
  const empty = messages.length === 0;

  const about = people.find((p) => p.id === aboutId) || people[0] || null;
  const matrix = useMemo(() => {
    if (!about) return null;
    try {
      return calculateMatrix(about.birthDate);
    } catch {
      return null;
    }
  }, [about]);

  const send = (text) => {
    const question = String(text).trim();
    if (!question || !matrix || left <= 0) return;

    /* Контекст пересобирается на каждый вопрос: человек мог переключить,
       о ком идёт речь, прямо посреди разговора. */
    const context = buildMentorContext(matrix, about, plan);
    const answer = mentorPlaceholder(context, question);

    appendExchange({ question, answer, personId: about.id, personName: personLabel(about) });
    setDraft("");
  };

  if (!account.signedIn) {
    return (
      <div style={{ ...S.cabinet, maxWidth: 620, margin: "0 auto" }}>
        <div style={S.intro}>
          <div style={S.introIcon}><Spark size={26} /></div>
          <h1 style={S.introTitle}>ИИ-наставник</h1>
          <div style={S.introSub}>Разговор о вашей матрице и о том, что происходит в жизни</div>
          <p style={S.introText}>
            Наставник знает вашу матрицу до последнего числа — поэтому нужен вход.
            Войдите, и разговор начнётся с ваших чисел, а не с общих слов.
          </p>
          <button className="btnGold" style={{ ...S.btn, background: C.gold, color: C.ink }}
            onClick={() => setLogin(true)}>Войти</button>
        </div>
        {login && <LoginModal onClose={() => setLogin(false)} />}
      </div>
    );
  }

  /* На «Бесплатно» и «Разовом» наставника нет вовсе. Показывать там
     «лимит исчерпан» — вранье: лимит не исчерпан, услуги просто нет. */
  if (limits.messages === 0) {
    return (
      <div style={{ ...S.cabinet, maxWidth: 620, margin: "0 auto" }}>
        <div style={S.intro}>
          <div style={S.introIcon}><Spark size={26} /></div>
          <h1 style={S.introTitle}>ИИ-наставник</h1>
          <div style={S.introSub}>Разговор о вашей матрице и о том, что происходит в жизни</div>
          <p style={S.introText}>
            На тарифе «{limits.label}» наставника нет. Он открывается на платных тарифах:
            {" "}{PLAN_ORDER.filter((id) => PLAN_LIMITS[id].messages > 0)
              .map((id) => `«${PLAN_LIMITS[id].label}» — ${Number.isFinite(PLAN_LIMITS[id].messages)
                ? `${PLAN_LIMITS[id].messages} в день` : "без счёта"}`)
              .join(", ")}.
          </p>
          <Link to="/tarify" className="btnGold" style={{ ...S.btn, background: C.gold, color: C.ink }}>
            Посмотреть тарифы
          </Link>
        </div>
      </div>
    );
  }

  if (!people.length) {
    return (
      <div style={{ ...S.cabinet, maxWidth: 620, margin: "0 auto" }}>
        <div style={S.intro}>
          <div style={S.introIcon}><Spark size={26} /></div>
          <h1 style={S.introTitle}>ИИ-наставник</h1>
          <p style={S.introText}>
            Наставнику нужна матрица, о которой говорить. Добавьте первую —
            и он будет отвечать через ваши числа.
          </p>
          <Link to="/profil" className="btnGold" style={{ ...S.btn, background: C.gold, color: C.ink }}>
            Добавить матрицу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={S.chatPage}>
      <div style={S.chatTop}>
        <div style={S.chatTabs}>
          {[["chat", "Новый разговор"], ["history", "История"]].map(([id, label]) => {
            const on = view === id;
            return (
              <button key={id} style={{
                ...S.chatTab,
                background: on ? C.cardHi : "transparent",
                color: on ? C.white : C.muted,
                fontWeight: on ? 600 : 400,
              }} onClick={() => {
                setView(id);
                // «Новый разговор» ВСЕГДА начинает пустой — иначе кнопка
                // с таким названием возвращала бы в старую переписку.
                // Вернуться в прежний разговор можно из «Истории».
                if (id === "chat") startConversation();
              }}>{label}</button>
            );
          })}
        </div>
        <span style={{ ...S.counter, color: left <= 3 ? C.pink : C.muted }}>
          {Number.isFinite(left)
            ? `осталось ${left} из ${limits.messages}`
            : "без ограничений"}
        </span>
      </div>

      {view === "history" ? (
        <div style={S.chatCenter}>
          <h2 style={S.chatH2}>История разговоров</h2>
          {list.length === 0 && (
            <p style={S.dim}>Разговоров пока нет. Задайте первый вопрос — он сохранится сюда.</p>
          )}
          {list.map((conversation) => {
            const lastAnswer = [...conversation.messages].reverse().find((m) => m.role === "bot");
            return (
              <button key={conversation.id} className="histItem" style={S.histItem}
                onClick={() => { openConversation(conversation.id); setView("chat"); }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={S.histTitle}>{conversation.title}</div>
                  <div style={S.histLast}>{lastAnswer ? lastAnswer.text : "—"}</div>
                </div>
                <div style={S.histMeta}>
                  <span style={S.histAbout}>{conversation.personName}</span>
                  <span style={S.dimSm}>{formatDate(conversation.updatedAt)}</span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div style={S.chatCenter}>
          {empty ? (
            <div style={S.intro}>
              <div style={S.introIcon}><Spark size={26} /></div>
              <h1 style={S.introTitle}>ИИ-наставник</h1>
              <div style={S.introSub}>Разговор о вашей матрице и о том, что происходит в жизни</div>
              <p style={S.introText}>
                Он разбирается в арканах, нумерологии и психологии и знает вашу матрицу
                до последнего числа. Спросите про карту или про то, что происходит прямо
                сейчас, — получите разбор через ваши числа и вопросы, от которых
                становится яснее.
              </p>
            </div>
          ) : (
            <div style={S.thread}>
              {messages.map((message, i) => (
                <div key={i} style={{
                  ...S.msg,
                  maxWidth: isPhone ? "88%" : S.msg.maxWidth,
                  alignSelf: message.role === "me" ? "flex-end" : "flex-start",
                  background: message.role === "me" ? C.lilacBtn : "rgba(23,18,46,0.72)",
                  color: message.role === "me" ? C.ink : C.text,
                  borderColor: message.role === "me" ? C.lilacBtn : C.border,
                }}>{message.text}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {view === "chat" && (
        <div style={S.composer}>
          <div style={S.composerInner}>
            <div className={isPhone ? "hScroll" : undefined}
              style={isPhone ? { ...hScrollRow, gap: 8, alignItems: "center", marginBottom: 10 } : S.aboutRow}>
              <span style={{ ...S.dimSm, whiteSpace: "nowrap" }}>О ком говорим:</span>
              {people.map((person) => {
                const on = about && about.id === person.id;
                return (
                  <button key={person.id} className="chip" style={{
                    ...S.chip,
                    ...(isPhone ? { minHeight: TAP, whiteSpace: "nowrap" } : null),
                    background: on ? C.lilacBtn : "transparent",
                    borderColor: on ? C.lilacBtn : C.border,
                    color: on ? C.ink : C.text, fontWeight: on ? 600 : 400,
                  }} onClick={() => setAboutId(person.id)}>{personLabel(person)}</button>
                );
              })}
            </div>

            {/* Подсказки только на пустом экране: в разговоре они мешают. */}
            {empty && (
              <div style={{ ...S.hints, ...(isPhone ? { flexDirection: "column", alignItems: "stretch" } : null) }}>
                {HINTS.map((hint) => (
                  <button key={hint} className="chip"
                    style={{
                      ...S.chip, background: "transparent",
                      borderColor: C.border, color: C.text,
                      ...(isPhone ? { minHeight: TAP, textAlign: "left", justifyContent: "flex-start" } : null),
                    }}
                    onClick={() => send(hint)}>{hint}</button>
                ))}
              </div>
            )}

            <div style={S.inputBox}>
              <textarea className="fld" style={S.chatArea} rows={1}
                placeholder={left > 0 ? "Спросите о своей матрице…" : "Лимит сообщений на сегодня исчерпан"}
                value={draft} disabled={left <= 0}
                onChange={(e) => {
                  setDraft(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 180) + "px";
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(draft); }
                }} />
              <button className="btnGold" style={{ ...S.sendBtn, background: C.gold, color: C.ink }}
                onClick={() => send(draft)} aria-label="Отправить">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 19V5M12 5l-6 6M12 5l6 6" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <p style={S.chatNote}>
              Не предсказывает события и не заменяет врача, психолога или юриста.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function formatDate(iso) {
  const months = ["января","февраля","марта","апреля","мая","июня",
                  "июля","августа","сентября","октября","ноября","декабря"];
  const date = new Date(iso);
  return `${date.getDate()} ${months[date.getMonth()]}`;
}
