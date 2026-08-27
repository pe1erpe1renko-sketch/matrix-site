import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import MatricaResult from "./pages/MatricaResult.jsx";
import FinansyResult from "./pages/FinansyResult.jsx";
import DetskayaResult from "./pages/DetskayaResult.jsx";
import PrognozResult from "./pages/PrognozResult.jsx";
import PairResult from "./pages/PairResult.jsx";
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

          {/* результаты расчёта — открываются по прямой ссылке.
              Одна дата в адресе у личных расчётов, две у парных. */}
          <Route path="/matrica/:date"  element={<MatricaResult />} />
          <Route path="/finansy/:date"  element={<FinansyResult />} />
          <Route path="/detskaya/:date" element={<DetskayaResult />} />
          <Route path="/prognoz/:date"  element={<PrognozResult />} />
          <Route path="/sovmestimost/:dateA/:dateB" element={<PairResult pageId="sovmestimost" />} />
          <Route path="/biznes/:dateA/:dateB"       element={<PairResult pageId="biznes" />} />

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
