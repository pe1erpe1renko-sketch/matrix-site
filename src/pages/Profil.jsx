import React, { useState } from "react";
import { Link } from "react-router-dom";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { PLAN_LIMITS } from "../lib/plans.js";
import { useAccess, unlockReport, lockReport } from "../lib/access.js";
import { useAccount, updateProfile, deleteAccount, toggleSocial, referralLink, SOCIAL_NAMES } from "../lib/account.js";
import { usePeople, personKey, personLabel, removePerson, toggleTelegram, revokeTelegram, confirmTelegram, telegramUsed, clearPeople } from "../lib/people.js";
import { clearConversations } from "../lib/conversations.js";
import { calculateMatrix, dayArcana } from "../lib/matrixEngine.js";
import { isoToUrlDate, urlDateToHuman } from "../lib/urlDate.js";
import { Ic } from "../components/Icons.jsx";
import { useIsPhone, hScrollRow, TAP } from "../theme/responsive.js";
import { Meter, Switch, CopyButton, MiniOcta, Field, Modal } from "../components/Controls.jsx";
import LoginModal from "../components/LoginModal.jsx";
import PersonModal from "../components/PersonModal.jsx";

/**
 * ЛИЧНЫЙ КАБИНЕТ — /profil
 * ========================
 * Три вкладки: мои матрицы, прогнозы, данные.
 *
 * Все лимиты берутся из PLAN_LIMITS по текущему тарифу. Зашитых чисел
 * в разметке нет: сменился тариф — счётчики поехали сами.
 *
 * Согласий и уведомлений здесь нет. Согласия принимаются при регистрации
 * и при оплате, уведомления — переключателями в «Прогнозах».
 */
export default function Profil() {
  const account = useAccount();
  const people = usePeople();
  const { plan } = useAccess();
  const [tab, setTab] = useState("matrices");
  const [login, setLogin] = useState(false);
  const isPhone = useIsPhone();

  const limits = PLAN_LIMITS[plan];

  return (
    <div style={S.cabinet}>
      <div style={S.head}>
        <div>
          <div style={S.eyebrow}>Личный кабинет</div>
          <h1 style={S.cabH1}>{account.signedIn ? account.name : "Вы не вошли"}</h1>
          <div style={S.sub}>
            {account.signedIn
              ? <>{account.email || "вход через соцсеть"} · тариф «{limits.label}»</>
              : "Расчёты сохраняются в браузере. Войдите — и они переедут в кабинет."}
          </div>
        </div>
        {/* Кнопка поддержки теперь глобальная — она в правом верхнем углу
            макета и есть на каждой странице, а не только в кабинете. */}
      </div>

      {account.signedIn ? (
        <>
          <div className={isPhone ? "hScroll" : undefined}
            style={isPhone ? { ...hScrollRow, ...S.cabTabs, flexWrap: "nowrap" } : S.cabTabs}>
            {[["matrices", "Мои матрицы"], ["feed", "Прогнозы"], ["data", "Данные"]].map(([id, label]) => {
              const on = tab === id;
              return (
                <button key={id} style={{
                  ...S.cabTab,
                  minHeight: TAP, whiteSpace: "nowrap",
                  color: on ? C.white : C.muted,
                  borderBottomColor: on ? C.gold : "transparent",
                }} onClick={() => setTab(id)}>{label}</button>
              );
            })}
          </div>

          {tab === "matrices" && <MatricesTab people={people} plan={plan} />}
          {tab === "feed" && <FeedTab people={people} />}
          {tab === "data" && <DataTab account={account} />}
        </>
      ) : (
        <GuestView people={people} onLogin={() => setLogin(true)} />
      )}

      {login && <LoginModal onClose={() => setLogin(false)} />}
    </div>
  );
}

/* ═══════════ ГОСТЬ ═══════════ */

/**
 * Гость видит тот же экран, но вместо содержимого — приглашение войти
 * и карточки своих расчётов. Пустой экран или ошибка здесь недопустимы:
 * человек уже что-то посчитал, ему есть что терять.
 */
function GuestView({ people, onLogin }) {
  return (
    <>
      <div className="card" style={{ ...S.block, borderColor: C.borderHi, textAlign: "center", padding: "40px 32px" }}>
        <h2 style={S.cabH2}>
          {people.length ? "Ваша матрица уже посчитана" : "Здесь будут ваши матрицы"}
        </h2>
        <p style={{ ...S.sub, margin: "12px auto 22px", maxWidth: 480 }}>
          {people.length
            ? "Войдите — и она сохранится в кабинете вместе с арканом дня, архивом прогнозов и наставником."
            : "Посчитайте матрицу по дате рождения — регистрация для этого не нужна. Расчёт сохранится в браузере, а после входа переедет в кабинет."}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btnGold" style={{ ...S.btn, background: C.gold, color: C.ink }} onClick={onLogin}>
            Войти и сохранить
          </button>
          <Link to="/matrica" className="btnOutline" style={{ ...S.btn, border: `1px solid ${C.border}`, color: C.white }}>
            Посчитать матрицу
          </Link>
        </div>
      </div>

      {people.length > 0 && (
        <>
          <div style={{ ...S.blockTitle2, marginBottom: 14 }}>Ваши расчёты в этом браузере</div>
          <div style={S.pGrid}>
            {people.map((person) => <PersonCard key={person.id} person={person} guest />)}
          </div>
        </>
      )}
    </>
  );
}

/* ═══════════ МОИ МАТРИЦЫ ═══════════ */

function MatricesTab({ people, plan }) {
  const limits = PLAN_LIMITS[plan];
  const [modal, setModal] = useState(null);        // 'new' | person
  const tgOn = telegramUsed(people);
  const full = people.length >= limits.matrices;

  return (
    <>
      <div style={S.rowBetween}>
        <div style={S.meters}>
          <Meter label="Матрицы" now={people.length} max={limits.matrices} />
          <Meter label="Прогнозов в Telegram" now={tgOn} max={limits.telegram} />
        </div>

        {/* Лимит исчерпан — кнопка не гаснет, а ведёт туда, где его снимают.
            Серая мёртвая кнопка ничего не объясняет и никуда не ведёт. */}
        {full
          ? <Link to="/tarify" className="btnGold" style={{ ...S.btn, background: C.gold, color: C.ink }}>
              Расширить тариф
            </Link>
          : <button className="btnGold" style={{ ...S.btn, background: C.gold, color: C.ink }}
              onClick={() => setModal("new")}>+ Добавить матрицу</button>}
      </div>

      <div style={S.pGrid}>
        {people.map((person) => (
          <PersonCard key={person.id} person={person} plan={plan}
            tgOn={tgOn} onEdit={() => setModal(person)} />
        ))}

        {full ? (
          <Link to="/tarify" className="addCard" style={S.addCard}>
            <span style={S.addPlus}>+</span>
            <span>Нужен тариф выше</span>
            <span style={S.dimSm}>на «{limits.label}» матриц {limits.matrices}</span>
          </Link>
        ) : (
          <button className="addCard" style={S.addCard} onClick={() => setModal("new")}>
            <span style={S.addPlus}>+</span>
            <span>Добавить матрицу</span>
            <span style={S.dimSm}>
              {Number.isFinite(limits.matrices)
                ? `осталось ${limits.matrices - people.length}`
                : "без ограничений"}
            </span>
          </button>
        )}
      </div>

      {modal && (
        <PersonModal person={modal === "new" ? null : modal} onClose={() => setModal(null)} />
      )}
    </>
  );
}

/**
 * Карточка человека. Числа считаются из даты каждый раз заново —
 * копии в хранилище нет, значит с движком разойтись не может.
 */
function PersonCard({ person, plan, tgOn = 0, onEdit, guest = false }) {
  const { unlocked, canUnlockMore } = useAccess(personKey(person));
  const isPhone = useIsPhone();
  /* На телефоне кнопки во всю ширину карточки: так по ним не промахиваются. */
  const btn = isPhone ? { flex: "1 1 100%", minHeight: TAP } : null;
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  const matrix = safeMatrix(person.birthDate);
  const urlDate = isoToUrlDate(person.birthDate);
  const kindLabel = person.kind === "child" ? "Детская" : "Личная";
  const tgLimitReached = !person.telegram.on && tgOn >= limits.telegram;

  if (!matrix) return null;

  return (
    <div className="card" style={{ ...S.pCard, borderColor: unlocked ? C.borderHi : C.border }}>
      <div style={S.pTop}>
        <MiniOcta core={matrix.core} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={S.pName}>
            {personLabel(person)}
            {person.self && <span style={S.selfTag}>это вы</span>}
            {!guest && !unlocked && <span style={S.lockTag}>под замком</span>}
          </div>
          <div style={S.pMeta}>
            {urlDateToHuman(urlDate)} · {person.gender || "пол не указан"} · {kindLabel}
          </div>
          <div style={S.pArc}>
            {["W", "N", "E"].map((k) => <span key={k} style={S.arcChip}>{matrix.core[k]}</span>)}
            <span style={{ ...S.arcChip, borderColor: C.lilac, color: C.lilac }}>{matrix.core.C}</span>
            <span style={{ ...S.arcChip, borderColor: C.gold, color: C.gold }} title="аркан дня">
              {matrix.today.dayArcana}
            </span>
          </div>
        </div>
      </div>

      {!guest && (
        <TelegramBox person={person} limitReached={tgLimitReached} limit={limits.telegram} />
      )}

      <div style={S.pBtns}>
        <Link to={`/matrica/${urlDate}`} className="btnGold"
          style={{ ...S.btnSm, ...btn, background: C.gold, color: C.ink }}>Открыть</Link>
        {onEdit && (
          <button className="btnOutline" style={{ ...S.btnSm, ...btn, border: `1px solid ${C.border}`, color: C.white }}
            onClick={onEdit}>Изменить</button>
        )}
        {!guest && (unlocked
          ? <button className="btnGhost" style={{ ...S.btnSm, ...btn }} onClick={() => lockReport(personKey(person))}>Закрыть разбор</button>
          : <button className="btnOutline" disabled={!canUnlockMore}
              style={{ ...S.btnSm, ...btn, border: `1px solid ${canUnlockMore ? C.border : "transparent"}`, color: canUnlockMore ? C.white : C.muted }}
              onClick={() => unlockReport(personKey(person))}>
              {canUnlockMore ? "Открыть разбор" : "Лимит тарифа"}
            </button>)}
        {!person.self && (
          <button className="btnGhost" style={{ ...S.btnSm, ...btn }} onClick={() => removePerson(person.id)}>Удалить</button>
        )}
      </div>
    </div>
  );
}

/**
 * ТЕЛЕГРАМ-ПРОГНОЗ. Три состояния:
 *   выключено      — только переключатель
 *   ссылка выдана  — код виден, статус «не активирована»
 *   подключено     — виден @username и кнопка «Отозвать»
 *
 * «Отозвать» гасит старый код и выдаёт новый: иначе отозванная ссылка
 * продолжала бы работать и отозвать её было бы нельзя.
 */
function TelegramBox({ person, limitReached, limit }) {
  const { on, status, username, code } = person.telegram;
  const link = `t.me/matrix_bot?start=${code}`;

  return (
    <div style={S.tgBox}>
      <div style={S.tgHead}>
        <span style={S.tgTitle}>
          <Ic.tg width={15} height={15} /> Аркан дня в Telegram
        </span>
        {limitReached
          ? <span style={S.dimSm}>лимит {limit}</span>
          : <Switch on={on} onClick={() => toggleTelegram(person.id)} label="Присылать аркан дня в Telegram" />}
      </div>

      {on && (
        <>
          {status !== "connected" && (
            <div style={S.tgLink}>
              <code style={S.code}>{link}</code>
              <CopyButton value={link} />
            </div>
          )}
          <div style={S.tgStatus}>
            <span style={{ ...S.dot, background: status === "connected" ? C.ok : C.gold }} />
            {status === "connected"
              ? <>подключено · {username}</>
              : <>ссылка не активирована — отправьте её человеку</>}
            {status === "connected"
              ? <button className="link" style={S.linkBtn} onClick={() => revokeTelegram(person.id)}>отозвать</button>
              : <button className="link" style={S.linkBtn}
                  onClick={() => confirmTelegram(person.id, `@${code}`)}>
                  проверить подключение
                </button>}
          </div>
        </>
      )}
    </div>
  );
}

/* ═══════════ ПРОГНОЗЫ ═══════════ */

const MONTHS = ["января","февраля","марта","апреля","мая","июня",
                "июля","августа","сентября","октября","ноября","декабря"];

/**
 * Лента арканов дня: сегодня сверху, ниже история.
 * Аркан каждого дня считается движком от аркана периода этого человека —
 * поэтому у разных людей в один день числа разные.
 */
function FeedTab({ people }) {
  const [filter, setFilter] = useState("Все");
  const DAYS_BACK = 7;

  const rows = people
    .map((person) => ({ person, matrix: safeMatrix(person.birthDate) }))
    .filter((r) => r.matrix);

  const days = Array.from({ length: DAYS_BACK }, (_, back) => {
    const date = new Date();
    date.setDate(date.getDate() - back);
    const iso = date.toISOString().slice(0, 10);
    const label = back === 0 ? "Сегодня" : back === 1 ? "Вчера" : "";
    const human = `${date.getDate()} ${MONTHS[date.getMonth()]}`;

    const items = rows
      .filter(({ person }) => filter === "Все" || personLabel(person) === filter)
      .map(({ person, matrix }) => ({
        id: person.id,
        who: personLabel(person),
        arcana: dayArcanaFor(matrix, iso),
      }));

    return { key: iso, title: label ? `${label}, ${human}` : human, items, fresh: back === 0 };
  }).filter((d) => d.items.length);

  if (!people.length) {
    return <EmptyNote text="Прогнозы появятся, когда вы добавите первую матрицу." to="/matrica" action="Посчитать матрицу" />;
  }

  return (
    <>
      <div style={S.archiveNote}>
        <span style={{ ...S.dot, background: C.ok }} />
        Архив прогнозов остаётся у вас навсегда — даже если отмените подписку.
      </div>

      {/* Уведомления настраиваются здесь: согласий и настроек рассылки
          во вкладке «Данные» нет. Переключатель тот же, что на карточке
          матрицы, — состояние одно, разъехаться не может. */}
      <div className="card" style={{ ...S.block, marginBottom: 18, padding: "16px 20px" }}>
        <div style={{ ...S.blockTitle, marginBottom: 12 }}>Куда присылать прогноз</div>
        {people.map((person) => (
          <div key={person.id} style={{ ...S.field, borderBottom: "none", padding: "7px 0" }}>
            <span style={{ color: C.white, flex: 1, minWidth: 0 }}>{personLabel(person)}</span>
            <span style={S.dimSm}>
              {person.telegram.status === "connected"
                ? `Telegram · ${person.telegram.username}`
                : person.telegram.on ? "ссылка выдана, ждём активации" : "не присылать"}
            </span>
            <Switch on={person.telegram.on} onClick={() => toggleTelegram(person.id)}
              label={`Присылать аркан дня в Telegram: ${personLabel(person)}`} />
          </div>
        ))}
      </div>

      <div style={S.rowBetween}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Все", ...people.map(personLabel)].map((name) => {
            const on = filter === name;
            return (
              <button key={name} className="chip" style={{
                ...S.chip,
                background: on ? C.gold : "transparent",
                borderColor: on ? C.gold : C.border,
                color: on ? C.ink : C.text, fontWeight: on ? 600 : 400,
              }} onClick={() => setFilter(name)}>{name}</button>
            );
          })}
        </div>
      </div>

      {days.map((day, i) => (
        <div key={day.key} style={{ marginTop: i ? 30 : 4 }}>
          <div style={S.feedDay}>{day.title}</div>
          <div style={S.feedGrid}>
            {day.items.map((item) => (
              <div key={item.id} className="card"
                style={{ ...S.feedCard, borderColor: day.fresh ? C.borderHi : C.border }}>
                <div style={S.feedTop}>
                  <span style={S.feedArc}>{item.arcana}</span>
                  <div>
                    <div style={S.feedWho}>{item.who}</div>
                    <div style={S.dimSm}>аркан дня</div>
                  </div>
                </div>
                <p style={S.feedText}>
                  Текст прогноза придёт из контентного слоя, когда включится генерация.
                  Число уже настоящее: оно посчитано от аркана периода этого человека.
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

/* ═══════════ ДАННЫЕ ═══════════ */

function DataTab({ account }) {
  const [receipt, setReceipt] = useState(account.receiptEmail || "");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const link = referralLink(account.id);

  return (
    <>
      <div style={S.two}>
        <div className="card" style={S.block}>
          <div style={S.blockHead}>
            <div style={{ ...S.blockTitle, marginBottom: 0 }}>Учётные данные</div>
            <div style={S.idPill}>
              <span style={S.idLabel}>Ваш ID:</span>
              <span style={S.idValue}>{account.id}</span>
              <CopyButton value={account.id} />
            </div>
          </div>

          <Field label="Имя" value={account.name} />
          <Field label="Почта" value={account.email || "не указана"} action="изменить" />
          <Field label="Пароль" value="••••••••" action="изменить" />

          <div style={S.blockTitle2}>Вход через соцсети</div>
          <div style={S.socials}>
            {SOCIAL_NAMES.map((name) => {
              const linked = Boolean(account.socials[name]);
              return (
                <button key={name} className="socialBtn" style={{ ...S.social, borderColor: linked ? C.lilac : C.border }}
                  onClick={() => toggleSocial(name)}>
                  <span style={{ color: linked ? C.white : C.muted }}>{name}</span>
                  <span style={{ ...S.dimSm, color: linked ? C.ok : C.muted }}>
                    {linked ? "привязан" : "привязать"}
                  </span>
                </button>
              );
            })}
          </div>

          <p style={S.hint}>
            ID — постоянный номер аккаунта. Назовите его в поддержке, и вас найдут сразу.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={S.block}>
            <div style={S.blockTitle}>Почта для чека</div>
            <div style={S.inWrap}>
              <input className="fld" style={S.inField} value={receipt}
                onChange={(e) => setReceipt(e.target.value)} placeholder="куда прислать чек" />
              <button className="inAct" style={S.inAct}
                onClick={() => updateProfile({ receiptEmail: receipt })}>Сохранить</button>
            </div>
            <p style={S.hint}>
              Это не почта входа: войти можно через Telegram и почты вовсе не иметь,
              а чек по закону куда-то отправить нужно.
            </p>
          </div>

          <div style={S.half}>
            <div className="card" style={S.block}>
              <div style={S.blockTitle}>Промокод</div>
              <div style={S.inWrap}>
                <input className="fld" style={S.inField} placeholder="Введите код" />
                <button className="inAct" style={S.inAct}>Применить</button>
              </div>
            </div>
            <div className="card" style={S.block}>
              <div style={S.blockTitle}>Сертификат</div>
              <div style={S.inWrap}>
                <input className="fld" style={S.inField} placeholder="Код сертификата" />
                <button className="inAct" style={S.inAct}>Активировать</button>
              </div>
            </div>
          </div>

          <div className="card" style={S.block}>
            <div style={S.blockTitle}>Реферальная программа</div>
            <div style={S.refGrid}>
              <div>
                <div style={S.inWrap}>
                  <code style={S.refLink}>{link}</code>
                  <span style={S.inIcon}><CopyButton value={link} /></span>
                </div>
                <p style={S.hint}>
                  Пришедшие по ссылке получают скидку на первый разбор,
                  вы — вознаграждение с их оплат.
                </p>
              </div>
              <div style={S.refStats}>
                <div><span style={S.refNum}>{account.referral.invited}</span><span style={S.dimSm}>приглашено</span></div>
                <div><span style={S.refNum}>{account.referral.earned} ₽</span><span style={S.dimSm}>начислено</span></div>
                <div><span style={S.refNum}>{account.referral.paid} ₽</span><span style={S.dimSm}>выплачено</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={S.delWrap}>
        <button className="delBtn" style={S.delBtn} onClick={() => setConfirmDelete(true)}>
          Удалить аккаунт
        </button>
      </div>

      {confirmDelete && (
        <Modal title="Удалить аккаунт" onClose={() => setConfirmDelete(false)} width="min(420px, 100%)">
          <p style={{ ...S.dim, margin: "0 0 8px" }}>
            Удалятся все матрицы, архив прогнозов и разговоры с наставником.
            Восстановить их будет нельзя, ID {account.id} освободится навсегда.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
            <button className="delBtn" style={S.delBtn} onClick={() => {
              clearPeople();
              clearConversations();
              deleteAccount();
            }}>Да, удалить</button>
            <button className="btnOutline" style={{ ...S.btn, border: `1px solid ${C.border}`, color: C.white }}
              onClick={() => setConfirmDelete(false)}>Отмена</button>
          </div>
        </Modal>
      )}
    </>
  );
}

/* ═══════════ Общее ═══════════ */

function EmptyNote({ text, to, action }) {
  return (
    <div className="card" style={{ ...S.block, textAlign: "center", padding: "40px 32px" }}>
      <p style={{ ...S.dim, margin: "0 0 18px" }}>{text}</p>
      <Link to={to} className="btnGold" style={{ ...S.btn, background: C.gold, color: C.ink }}>{action}</Link>
    </div>
  );
}

/** Расчёт по дате. Битая дата в хранилище не должна ронять весь кабинет. */
function safeMatrix(birthDate) {
  try {
    return calculateMatrix(birthDate);
  } catch {
    return null;
  }
}

/**
 * Аркан дня на конкретную дату для этого человека.
 * Считает движок: формула закрыта и живёт только в matrixEngine.js.
 * Аркан периода держится 2,5 года, поэтому на недельной истории он общий.
 */
function dayArcanaFor(matrix, iso) {
  return dayArcana(iso, matrix.today.arcana);
}
