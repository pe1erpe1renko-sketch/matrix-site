import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import MatricaResult from "./pages/MatricaResult.jsx";
import DengiResult from "./pages/DengiResult.jsx";
import DetskayaResult from "./pages/DetskayaResult.jsx";
import PrognozResult from "./pages/PrognozResult.jsx";
import PairResult from "./pages/PairResult.jsx";
import TypeResult from "./pages/TypeResult.jsx";
import Chat from "./pages/Chat.jsx";
import Obrazy from "./pages/Obrazy.jsx";
import ObrazShare from "./pages/ObrazShare.jsx";
import Tarify from "./pages/Tarify.jsx";
import Checkout from "./pages/Checkout.jsx";
import CheckoutSuccess from "./pages/CheckoutSuccess.jsx";
import Profil from "./pages/Profil.jsx";
import NotFound from "./pages/NotFound.jsx";
import { CALC_NAV } from "./routes.js";

/**
 * МАРШРУТЫ
 * ========
 * Адреса собираются из одного списка (routes.js), а тот — из типов
 * разбора (lib/contentPositions.js). Меню, карусель и маршруты не
 * разъезжаются, потому что источник у них один.
 *
 * Три уровня:
 *   /                              главная, вкладка «Матрица»
 *   /matrica, /dengi, /karma, …    та же главная с выбранной вкладкой
 *   /matrica/13-07-1998            результат по дате из адреса
 *   /sovmestimost/дата/дата        результат по двум датам
 *
 * Вкладка формы = адрес: на все адреса вкладок отвечает один и тот же
 * компонент Home, поэтому при переключении вкладки страница не
 * пересобирается и введённые данные не теряются.
 *
 * ОДНА СТРАНИЦА НА ЧЕТЫРЕ АДРЕСА. Карма, здоровье, род и предназначение
 * отличаются только набором вопросов, поэтому их рисует общий TypeResult.
 * Своя страница осталась у матрицы, денег, детской, прогноза и у парных.
 *
 * СТАРЫЙ АДРЕС /finansy переадресуется на /dengi и здесь, и на хостинге
 * (vercel.json, постоянная переадресация 308): ссылки на него уже
 * разошлись по переписке и поисковой выдаче, ломать их нельзя.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />

          {/* вкладки карусели: одиннадцать адресов, одна страница */}
          {CALC_NAV.map((c) => (
            <Route key={c.id} path={c.path} element={<Home />} />
          ))}

          {/* результаты по одной дате */}
          <Route path="/matrica/:date"         element={<MatricaResult />} />
          <Route path="/dengi/:date"           element={<DengiResult />} />
          <Route path="/detskaya/:date"        element={<DetskayaResult />} />
          <Route path="/prognoz/:date"         element={<PrognozResult />} />
          <Route path="/karma/:date"           element={<TypeResult typeId="karma" />} />
          <Route path="/zdorovie/:date"        element={<TypeResult typeId="zdorovie" />} />
          <Route path="/rod/:date"             element={<TypeResult typeId="rod" />} />
          <Route path="/prednaznachenie/:date" element={<TypeResult typeId="prednaznachenie" />} />

          {/* результаты по двум датам */}
          <Route path="/sovmestimost/:dateA/:dateB" element={<PairResult pageId="sovmestimost" />} />
          <Route path="/mama-rebenok/:dateA/:dateB" element={<PairResult pageId="mama-rebenok" />} />
          <Route path="/biznes/:dateA/:dateB"       element={<PairResult pageId="biznes" />} />

          {/* старое имя денежного разбора */}
          <Route path="/finansy" element={<Navigate to="/dengi" replace />} />
          <Route path="/finansy/:date" element={<FinansyRedirect />} />

          {/* кабинет */}
          <Route path="/chat" element={<Chat />} />
          <Route path="/obrazy" element={<Obrazy />} />
          {/* Чужой образ по пересланной ссылке — точка входа новых людей. */}
          <Route path="/obraz/:id" element={<ObrazShare />} />
          <Route path="/tarify" element={<Tarify />} />
          {/* оформление: тариф, разбор или пакет молний — товар в адресе */}
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/profil" element={<Profil />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

/** /finansy/13-07-1998 → /dengi/13-07-1998, дата сохраняется. */
function FinansyRedirect() {
  const { date } = useParams();
  return <Navigate to={`/dengi/${date}`} replace />;
}
