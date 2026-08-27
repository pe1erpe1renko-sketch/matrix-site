import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import CalcResult from "./pages/CalcResult.jsx";
import Chat from "./pages/Chat.jsx";
import Tarify from "./pages/Tarify.jsx";
import Profil from "./pages/Profil.jsx";
import NotFound from "./pages/NotFound.jsx";
import { CALC_NAV } from "./routes.js";

/**
 * МАРШРУТЫ
 * ========
 * Адреса взяты из CLAUDE.md, раздел 6, и собираются из одного списка
 * (routes.js) — чтобы меню, вкладки формы и маршруты не разъезжались.
 *
 * Три уровня:
 *   /                              главная, вкладка «Матрица»
 *   /matrica, /finansy, …          та же главная с выбранной вкладкой
 *   /matrica/13-07-1998            результат расчёта по дате из адреса
 *   /sovmestimost/дата/дата        результат по двум датам
 *
 * Вкладка формы = адрес: на все шесть адресов отвечает один и тот же
 * компонент Home, поэтому при переключении вкладки страница не
 * пересобирается и введённые данные не теряются.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />

          {/* шесть калькуляторов: вкладка формы на главной */}
          {CALC_NAV.map((c) => (
            <Route key={c.id} path={c.path} element={<Home />} />
          ))}

          {/* результат расчёта — открывается по прямой ссылке */}
          {CALC_NAV.map((c) => (
            <Route
              key={c.id + "-result"}
              path={c.pairs ? `${c.path}/:dateA/:dateB` : `${c.path}/:date`}
              element={<CalcResult />}
            />
          ))}

          {/* кабинет */}
          <Route path="/chat" element={<Chat />} />
          <Route path="/tarify" element={<Tarify />} />
          <Route path="/profil" element={<Profil />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
