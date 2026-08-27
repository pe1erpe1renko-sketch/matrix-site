import React from "react";
import PageStub from "../components/PageStub.jsx";

/** Адрес, которого нет. Показываем спокойно и уводим на главную. */
export default function NotFound() {
  return (
    <PageStub
      badge="Страница не найдена"
      title="Такой страницы нет"
      text="Проверьте адрес: у расчёта он выглядит как /matrica/13-07-1998 — день, месяц и год через дефис."
    />
  );
}
