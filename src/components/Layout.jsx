import React, { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { C } from "../theme/tokens.js";
import { S } from "../theme/styles.js";
import { GLOBAL_CSS } from "../theme/globalCss.js";
import { CALC_NAV, ACCOUNT_NAV, activeNavId, calcById } from "../routes.js";
import { Ic, Spark } from "./Icons.jsx";
import Cursor from "./Cursor.jsx";
import Sky from "./Sky.jsx";

/**
 * ОБЩИЙ МАКЕТ
 * ===========
 * Одна рамка на весь сайт: живой фон, курсор, меню слева, подвал.
 * Страница подставляется в <Outlet /> — она отвечает только за свою середину
 * и меню себе не рисует.
 *
 * Меню одинаковое до и после входа (CLAUDE.md, раздел 6) и переключает
 * СТРАНИЦЫ, а не вкладки формы: каждый пункт — обычная ссылка с адресом,
 * поэтому работает «назад», «открыть в новой вкладке» и пересылка ссылки.
 *
 * Подсветка активного пункта задана встроенным стилем — классом её задавать
 * нельзя, встроенные стили перебивают таблицу стилей.
 */
export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [hover, setHover] = useState(null);
  const { pathname } = useLocation();
  const active = activeNavId(pathname);

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
    const hv = hover === item.id;
    const Icon = Ic[item.id];
    return (
      <Link
        key={item.id}
        to={item.path}
        style={{
          ...S.navItem,
          justifyContent: collapsed ? "center" : "flex-start",
          background: on ? C.cardHi : hv ? C.navHover : "transparent",
          color: on ? C.gold : hv ? C.white : C.text,
          fontWeight: on ? 600 : 400,
          boxShadow: on ? `inset 3px 0 0 ${C.gold}` : "none",
        }}
        onMouseEnter={() => setHover(item.id)}
        onMouseLeave={() => setHover(null)}
        aria-current={on ? "page" : undefined}
        title={collapsed ? item.label : undefined}
      >
        <Icon width={19} height={19} style={{ flexShrink: 0 }} />
        {!collapsed && <span style={S.navLbl}>{item.label}</span>}
      </Link>
    );
  };

  return (
    <div style={S.root}>
      <style>{GLOBAL_CSS}</style>
      <Cursor />
      <Sky />

      {/* ---------------- МЕНЮ ---------------- */}
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

        <nav style={S.nav}>
          {CALC_NAV.map(navLink)}
          <div style={S.divider} />
          {ACCOUNT_NAV.map(navLink)}
        </nav>

        <div style={S.sideBottom}>
          <button className="btnLilac" style={S.loginBtn}>
            {collapsed ? "→" : "Войти"}
          </button>
        </div>
      </aside>

      {/* ---------------- КОНТЕНТ ---------------- */}
      <main style={S.main}>
        <Outlet />
        <Footer />
      </main>
    </div>
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
        <Link key={x.id} to={x.path} className="footLink" style={{ ...S.footLink, display: "block" }}>
          {x.label}
        </Link>
      ))}
    </div>
  );
}
