import { useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { calculateMatrix, calculatePair } from "../lib/matrixEngine.js";
import { buildViewSections, pageView, openCount } from "../lib/pageSections.js";
import { reportKey, useAccess } from "../lib/access.js";
import { useAccount } from "../lib/account.js";
import { rememberGuestCalculation } from "../lib/people.js";
import { urlDateToISO, urlDateToHuman } from "../lib/urlDate.js";

/**
 * ОБЩАЯ ПОДГОТОВКА СТРАНИЦЫ РАСЧЁТА
 * =================================
 * Всё, что одинаково у шести калькуляторов: разобрать даты из адреса,
 * посчитать матрицу, взять набор разделов из PAGE_VIEWS и спросить,
 * открыт ли разбор по этим датам.
 *
 * Ключ доступа считается от НАБОРА ДАТ, а не от страницы: платят за дату,
 * а не за калькулятор. Поэтому /matrica/13-07-1998, /finansy/13-07-1998
 * и /prognoz/13-07-1998 открываются одной покупкой.
 *
 * @param {string} pageId — ключ PAGE_VIEWS: matrica, finansy, detskaya,
 *                          prognoz, sovmestimost, biznes
 */
export function useCalcPage(pageId) {
  const params = useParams();
  const view = pageView(pageId);

  const urlDates = view.pair ? [params.dateA, params.dateB] : [params.date];
  const isoDates = urlDates.map(urlDateToISO);
  const valid = isoDates.every(Boolean);

  const key = valid ? reportKey(isoDates) : "";
  const access = useAccess(key);

  /* Расчёт один раз на набор дат. Несуществующая дата → matrix === null. */
  const matrix = useMemo(() => {
    if (!valid) return null;
    try {
      return view.pair ? calculatePair(isoDates[0], isoDates[1]) : calculateMatrix(isoDates[0]);
    } catch {
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valid, view.pair, isoDates.join("|")]);

  /**
   * Гость считает без регистрации — запоминаем его расчёт, чтобы при входе
   * было что перенести в кабинет. У вошедшего матрицы заводятся вручную
   * в кабинете, поэтому здесь мы их не плодим.
   */
  const { signedIn } = useAccount();
  const rememberDate = !signedIn && !view.pair && valid ? isoDates[0] : null;
  useEffect(() => {
    if (!rememberDate) return;
    rememberGuestCalculation({ birthDate: rememberDate, kind: pageId === "detskaya" ? "child" : "personal" });
  }, [rememberDate, pageId]);

  const sections = useMemo(
    () => (matrix ? buildViewSections(matrix, view.sections, { unlocked: access.unlocked }) : []),
    [matrix, view.sections, access.unlocked]
  );

  return {
    view,
    matrix,
    sections,
    valid: valid && Boolean(matrix),
    reportKey: key,
    access,
    urlDates,
    isoDates,
    humanDates: urlDates.map(urlDateToHuman),
    sectionsTotal: view.sections.length,
    sectionsOpen: openCount(view.sections, access.unlocked),
  };
}
