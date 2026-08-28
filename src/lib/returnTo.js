import { createContext, useContext } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ВОЗВРАТ К РАЗБОРУ
 * =================
 * Человек читает разбор, нажимает закрытый вопрос, попадает на тарифы —
 * и обратной дороги нет: приходится заново вводить дату. Это теряет людей
 * ровно в тот момент, когда они ближе всего к оплате.
 *
 * КАК ЭТО УСТРОЕНО. Ссылка, уводящая с разбора, кладёт точку возврата
 * в state перехода:
 *
 *   <Link to="/tarify" state={backToReport(location, openSphereId)}>
 *
 * Страница тарифов достаёт её из state и показывает кнопку возврата.
 * Пришёл из меню — state пустой, кнопки нет. Это не «запомнили последнюю
 * страницу», а именно «этот переход был сделан отсюда»: иначе кнопка
 * висела бы и после того, как человек ушёл из разбора совсем.
 *
 * State перехода браузер хранит в записи истории, поэтому точка возврата
 * переживает перезагрузку страницы и кнопку «назад».
 *
 * АДРЕС ВОЗВРАТА включает раскрытую сферу (?section=relations) —
 * человек возвращается на то же место, а не в начало разбора.
 */

/** Даты из адреса разбора: /sovmestimost/13-07-1998/09-04-1992 → «13.07.1998 и 09.04.1992». */
export function datesFromPath(pathname) {
  const dates = String(pathname || '')
    .split('/')
    .filter((part) => /^\d{2}-\d{2}-\d{4}$/.test(part))
    .map((part) => part.replace(/-/g, '.'));
  return dates.length ? dates.join(' и ') : '';
}

/**
 * Точка возврата на страницу разбора, с раскрытой сферой.
 * Кладётся в state ссылки: <Link to="/tarify" state={backToReport(...)}>.
 */
export function backToReport(location, sectionId) {
  const dates = datesFromPath(location.pathname);
  if (!dates) return backToPage(location.pathname, 'Вернуться назад');
  return {
    back: {
      to: location.pathname + (sectionId ? `?section=${sectionId}` : ''),
      label: `Вернуться к разбору ${dates}`,
    },
  };
}

/** Точка возврата на страницу без дат: наставник, кабинет. */
export function backToPage(to, label) {
  return { back: { to, label } };
}

/**
 * Точка возврата текущей страницы или null.
 * Значение считает макет один раз и раздаёт вниз — так его видят
 * и страница тарифов, и модалка входа, и обе показывают одно и то же.
 */
const BackContext = createContext(null);

export const BackProvider = BackContext.Provider;

export const useBackPoint = () => useContext(BackContext);

/** Разбирает state текущего перехода. Зовётся только в макете. */
export function useResolveBackPoint() {
  const location = useLocation();
  const back = location.state && location.state.back;
  return back && back.to ? back : null;
}
