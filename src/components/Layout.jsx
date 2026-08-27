import React, { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { GLOBAL_CSS } from "../theme/globalCss.js";
import { useBreakpoint, useIsTouch, TAP } from "../theme/responsive.js";
import { CALC_NAV, ACCOUNT_NAV, activeNavId, calcById } from "../routes.js";
import { Ic, Spark } from "./Icons.jsx";
import Cursor from "./Cursor.jsx";
import Sky from "./Sky.jsx";
import LoginModal from "./LoginModal.jsx";
import SupportModal from "./SupportModal.jsx";
import { useAccount, signOut } from "../lib/account.js";
import { useAccess } from "../lib/access.js";
import { PLAN_LIMITS } from "../lib/plans.js";

/**
 * ОБЩИЙ МАКЕТ
 * ===========
 * Одна рамка на весь сайт: живой фон, курсор, меню, подвал.
 *
 * НА ДЕСКТОПЕ меню стоит слева постоянно и умеет сворачиваться в иконки.
 * НА ТЕЛЕФОНЕ оно не помещается: сверху появляется узкая шапка
 * (гамбургер — логотип — поддержка), а само меню выезжает слева поверх
 * содержимого и затемняет фон. Закрывается нажатием на затемнение,
 * крестиком, свайпом влево и само — после перехода на страницу.
 *
 * Подсветка активного пункта задана встроенным стилем: классом её задавать
 * нельзя, встроенные стили перебивают таблицу стилей.
 */
export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [hover, setHover] = useState(null);
  const [login, setLogin] = useState(false);
  const [support, setSupport] = useState(false);
  const { pathname } = useLocation();
  const active = activeNavId(pathname);

  const bp = useBreakpoint();
  const isPhone = bp === "phone";
  const isTouch = useIsTouch();

  const account = useAccount();
  const { plan } = useAccess();

  /* У наставника свой полноэкранный макет — подвал под ним лишний. */
  const fullHeight = active === "chat";

  /* Меню закрывается само после перехода: иначе человек тыкает пункт
     и остаётся смотреть на то же меню. */
  useEffect(() => { setDrawer(false); }, [pathname]);

  /* На планшете меню сворачивается в иконки само: развёрнутое оно
     забирает 262 пикселя из семисот, и содержимому не остаётся места. */
  useEffect(() => { if (bp === "tablet") setCollapsed(true); }, [bp]);

  /* Пока меню открыто, страница под ним не прокручивается. */
  useEffect(() => {
    if (!drawer) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [drawer]);

  /**
   * При переходе на другую страницу возвращаемся наверх.
   * Исключение — переключение вкладок расчёта между собой: вкладки стоят
   * вверху главной, и прыжок страницы под рукой выглядел бы поломкой.
   * Переход на разбор (/matrica → /matrica/13-07-1998) вкладкой не считается:
   * это уже другая страница, и открывать её надо сверху.
   */
  const prev = useRef(pathname);
  useEffect(() => {
    const tabSwitch = isTabPage(prev.current) && isTabPage(pathname);
    prev.current = pathname;
    if (!tabSwitch) window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  const navLink = (item) => {
    const on = active === item.id;
    const hv = hover === item.id && !isTouch;
    const Icon = Ic[item.id];
    const showLabel = isPhone || !collapsed;
    return (
      <Link
        key={item.id}
        to={item.path}
        style={{
          ...S.navItem,
          minHeight: TAP,
          justifyContent: showLabel ? "flex-start" : "center",
          background: on ? C.cardHi : hv ? C.navHover : "transparent",
          color: on ? C.gold : hv ? C.white : C.text,
          fontWeight: on ? 600 : 400,
          boxShadow: on ? `inset 3px 0 0 ${C.gold}` : "none",
        }}
        onMouseEnter={() => setHover(item.id)}
        onMouseLeave={() => setHover(null)}
        aria-current={on ? "page" : undefined}
        title={showLabel ? undefined : item.label}
      >
        <Icon width={19} height={19} style={{ flexShrink: 0 }} />
        {showLabel && <span style={S.navLbl}>{item.label}</span>}
      </Link>
    );
  };

  const menuBody = (
    <>
      <nav style={S.nav}>
        {CALC_NAV.map(navLink)}
        <div style={S.divider} />
        {ACCOUNT_NAV.map(navLink)}
      </nav>

      <div style={S.sideBottom}>
        {account.signedIn ? (
          <div style={S.userCard}>
            <div style={S.avatar}>{(account.name || "?").charAt(0).toUpperCase()}</div>
            {(isPhone || !collapsed) && (
              <>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={S.userName}>{account.name}</div>
                  <div style={S.userPlan}>{PLAN_LIMITS[plan].label}</div>
                </div>
                <button className="exitBtn" style={{ ...S.exitBtn, width: TAP, height: TAP }}
                  onClick={signOut} aria-label="Выйти">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                    <path d="M15 8.5V6.2a2 2 0 0 0-2-2H6.2a2 2 0 0 0-2 2v11.6a2 2 0 0 0 2 2H13a2 2 0 0 0 2-2v-2.3"
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M10.5 12h9.3M17 9.2l2.8 2.8-2.8 2.8"
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="tip" style={{ ...S.tip, left: "50%", right: "auto", transform: "translateX(-50%)" }}>
                    Выйти
                  </span>
                </button>
              </>
            )}
          </div>
        ) : (
          <button className="btnLilac" style={{ ...S.loginBtn, minHeight: TAP }} onClick={() => setLogin(true)}>
            {isPhone || !collapsed ? "Войти" : "→"}
          </button>
        )}
      </div>
    </>
  );

  return (
    <div style={isPhone ? S.rootPhone : S.root}>
      <style>{GLOBAL_CSS}</style>
      {!isTouch && <Cursor />}
      <Sky small={isPhone} />

      {isPhone ? (
        <>
          <TopBar
            onMenu={() => setDrawer(true)}
            onSupport={() => setSupport(true)}
          />
          <Drawer open={drawer} onClose={() => setDrawer(false)}>{menuBody}</Drawer>
        </>
      ) : (
        <aside style={{ ...S.side, width: collapsed ? 76 : 262 }}>
          <div style={{ ...S.sideTop, justifyContent: collapsed ? "center" : "space-between" }}>
            {!collapsed && (
              <Link to="/" style={S.logo}>
                <Spark size={19} />
                <span style={S.logoText}>MATRIX</span>
              </Link>
            )}
            <button className="collapseBtn" style={S.collapse}
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? "Развернуть меню" : "Свернуть меню"}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform .24s" }}>
                <path d="M14.5 6 L8.5 12 L14.5 18" stroke="currentColor" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          {menuBody}
        </aside>
      )}

      <main style={S.main}>
        <Outlet />
        {!fullHeight && <Footer />}
      </main>

      {login && <LoginModal onClose={() => setLogin(false)} />}
      {support && <SupportModal accountId={account.id} onClose={() => setSupport(false)} />}
    </div>
  );
}

/* ---------------- Телефон: шапка и выезжающее меню ---------------- */

function TopBar({ onMenu, onSupport }) {
  return (
    <header style={S.topBar}>
      <button style={S.topBtn} onClick={onMenu} aria-label="Меню">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>

      <Link to="/" style={{ ...S.logo, justifyContent: "center" }}>
        <Spark size={17} />
        <span style={{ ...S.logoText, fontSize: 17 }}>MATRIX</span>
      </Link>

      <button style={S.topBtn} onClick={onSupport} aria-label="Поддержка">
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9.2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9.3 9.2a2.8 2.8 0 1 1 3.5 2.7c-.5.15-.8.6-.8 1.1v.6"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="16.6" r="1.05" fill="currentColor" />
        </svg>
      </button>
    </header>
  );
}

/**
 * Выезжающее меню. Закрывается тремя способами: затемнение, крестик
 * и свайп влево — на телефоне последнее привычнее всего.
 */
function Drawer({ open, onClose, children }) {
  const startX = useRef(null);

  const onTouchStart = (e) => { startX.current = e.touches[0].clientX; };
  const onTouchMove = (e) => {
    if (startX.current === null) return;
    if (startX.current - e.touches[0].clientX > 60) {   // увели палец влево — закрываем
      startX.current = null;
      onClose();
    }
  };

  return (
    <>
      <div
        style={{
          ...S.backdrop,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        style={{ ...S.drawer, transform: open ? "translateX(0)" : "translateX(-100%)" }}
        aria-hidden={!open}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
      >
        <div style={S.drawerTop}>
          <Link to="/" style={S.logo}>
            <Spark size={19} />
            <span style={S.logoText}>MATRIX</span>
          </Link>
          <button style={S.topBtn} onClick={onClose} aria-label="Закрыть меню">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {children}
      </aside>
    </>
  );
}

/**
 * Главная с выбранной вкладкой: '/' или '/matrica'.
 * Адрес с датой ('/matrica/13-07-1998') — уже не вкладка, а страница разбора.
 */
function isTabPage(pathname) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return true;
  return segments.length === 1 && Boolean(calcById(segments[0]));
}

/* ---------------- Подвал ---------------- */

/**
 * «Мои матрицы» — это раздел внутри профиля, отдельного адреса у него нет,
 * поэтому в меню его нет, а в подвале ссылка ведёт в профиль.
 */
const ACCOUNT_CABINET = [
  { id: "moi-matricy", path: "/profil", label: "Мои матрицы" },
  ...ACCOUNT_NAV,
];

function Footer() {
  return (
    <footer style={S.footer}>
      <div style={S.footGrid}>
        <div>
          <Link to="/" style={S.logo}><Spark size={19} /><span style={S.logoText}>MATRIX</span></Link>
          <p style={{ ...S.infoText, marginTop: 14, maxWidth: 300 }}>
            Онлайн-калькулятор матрицы судьбы по методу 22 арканов.
          </p>
        </div>
        <FootCol title="Расчёты" items={CALC_NAV} />
        <FootCol title="Кабинет" items={ACCOUNT_CABINET} />
      </div>
      <div style={S.footBottom}>
        © 2026 MATRIX. Сервис носит развлекательный характер и не заменяет
        консультацию специалиста.
      </div>
    </footer>
  );
}

function FootCol({ title, items }) {
  return (
    <div>
      <div style={S.footTitle}>{title}</div>
      {items.map((x) => (
        <Link key={x.id} to={x.path} className="footLink"
          style={{ ...S.footLink, display: "block", minHeight: 34 }}>
          {x.label}
        </Link>
      ))}
    </div>
  );
}
