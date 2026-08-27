import { useState, useEffect } from "react";
import { getText } from "../lib/contentLayer.js";

/**
 * ТЕКСТ СЛОТА ИЗ КОНТЕНТНОГО СЛОЯ
 * ===============================
 * Один вход для всех мест, где показывается трактовка: панель точки
 * октаграммы, раздел разбора, аркан дня.
 *
 * Контентный слой сам решает, откуда взять текст: кэш → эталонные тексты →
 * генерация → заглушка. Компоненту это знать не нужно, он получает готовое.
 *
 * ЗАВИСИМОСТЬ ТОЛЬКО ОТ key. Ключ («money_channel_main_20») однозначно
 * определяет текст, а сам объект контекста пересоздаётся на каждой
 * отрисовке — если положить его в зависимости, запрос уйдёт в бесконечный цикл.
 *
 * Флаг alive гасит устаревший ответ: человек щёлкает по точкам быстрее,
 * чем приходят тексты, и без него панель показала бы предыдущую точку.
 */
export function useSlotText(context) {
  const key = context && context.key;
  const [state, setState] = useState({ loading: Boolean(key), text: "", source: null });

  useEffect(() => {
    if (!key) {
      setState({ loading: false, text: "", source: null });
      return undefined;
    }
    let alive = true;
    setState({ loading: true, text: "", source: null });

    getText(context)
      .then((result) => {
        if (alive) setState({ loading: false, text: result.text, source: result.source });
      })
      .catch(() => {
        if (alive) {
          setState({
            loading: false,
            source: "error",
            text: "Текст сейчас не загрузился. Откройте этот блок ещё раз — расчёт от этого не меняется.",
          });
        }
      });

    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return state;
}
