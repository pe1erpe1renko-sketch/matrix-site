import { useMemo, useEffect, useState, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import { calculateMatrix, calculatePair } from "../lib/matrixEngine.js";
import { buildViewSections, pageView, questionsTotal, questionsOpen } from "../lib/pageSections.js";
import { reportKey, useAccess } from "../lib/access.js";
import { useAccount } from "../lib/account.js";
import { rememberGuestCalculation } from "../lib/people.js";
import { wasSeen, markSeen } from "../lib/seenReports.js";
import { urlDateToISO, urlDateToHuman } from "../lib/urlDate.js";
import { rememberReport } from "../lib/recent.js";

/**
 * ОБЩАЯ ПОДГОТОВКА СТРАНИЦЫ РАСЧЁТА
 * =================================
 * Всё, что одинаково у шести калькуляторов: разобрать даты из адреса,
 * посчитать матрицу, взять набор разделов у типа разбора и спросить,
 * открыт ли разбор по этим датам.
 *
 * Ключ доступа считается от НАБОРА ДАТ, а не от страницы: платят за дату,
 * а не за калькулятор. Поэтому /matrica/13-07-1998, /finansy/13-07-1998
 * и /prognoz/13-07-1998 открываются одной покупкой.
 *
 * @param {string} pageId — slug типа разбора: matrica, dengi, detskaya,
 *                          karma, zdorovie, rod, prednaznachenie,
 *                          sovmestimost, mama-rebenok, biznes, prognoz
 */
export function useCalcPage(pageId) {
  const params = useParams();
  const { pathname } = useLocation();
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

  /* Посчитанное попадает в список недавних на главной: человек вернётся
     через день и не будет вводить ту же дату заново. */
  const calculated = valid && matrix ? pathname : null;
  useEffect(() => { rememberReport(calculated); }, [calculated]);

  const sections = useMemo(
    () => (matrix ? buildViewSections(matrix, view.sections, { unlocked: access.unlocked }) : []),
    [matrix, view.sections, access.unlocked]
  );

  /**
   * Сцена расчёта показывается один раз на набор дат. Второй заход
   * на ту же матрицу должен открываться сразу: красивое ожидание,
   * которое повторяется, — это уже просто задержка.
   */
  const [playing, setPlaying] = useState(() => Boolean(key) && !wasSeen(key));
  useEffect(() => {
    setPlaying(Boolean(key) && !wasSeen(key));
  }, [key]);

  const finishTheatre = useCallback(() => {
    markSeen(key);
    setPlaying(false);
  }, [key]);

  return {
    view,
    matrix,
    theatre: { playing: playing && Boolean(matrix), finish: finishTheatre },
    sections,
    valid: valid && Boolean(matrix),
    reportKey: key,
    access,
    urlDates,
    isoDates,
    humanDates: urlDates.map(urlDateToHuman),
    /* Считаем ВОПРОСЫ, а не сферы: человек читает вопросами, и «15 из 92»
       говорит ему больше, чем «12 сфер». */
    spheresTotal: view.sections.length,
    questionsTotal: questionsTotal(view.sections),
    questionsOpen: questionsOpen(view.sections, access.unlocked),
  };
}
