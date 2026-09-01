/**
 * КОНТАКТЫ ПОДДЕРЖКИ — ОДИН СПИСОК НА ВЕСЬ САЙТ
 * =============================================
 * Показываются в панели поддержки в шапке и на страницах юридических
 * документов. Меняются здесь — меняются везде.
 *
 * name  — способ связи
 * value — что видит человек
 * href  — куда ведёт нажатие (null — просто строка)
 * copy  — что кладётся в буфер по кнопке копирования (null — кнопки нет)
 *
 * У MAX ссылка длинная и без имени, показывать её целиком нельзя —
 * в строке стоит понятное «Написать в MAX», а адрес живёт в href.
 */
export const SUPPORT_EMAIL = 'support@era2.ai';
export const SUPPORT_TELEGRAM = 'https://t.me/matrika_supportbot';
export const SUPPORT_MAX = 'https://max.ru/u/f9LHodD0cOL9xEhx6C_olBibk_3j3dGXXYLdtNvjhbkpeTGrXqndAvuy1JU';

export const SUPPORT_WAYS = [
  {
    id: 'telegram',
    name: 'Telegram',
    value: '@matrika_supportbot',
    href: SUPPORT_TELEGRAM,
    copy: null,
  },
  {
    id: 'max',
    name: 'MAX',
    value: 'Написать в MAX',
    href: SUPPORT_MAX,
    copy: null,
  },
  {
    id: 'mail',
    name: 'Почта',
    value: SUPPORT_EMAIL,
    href: `mailto:${SUPPORT_EMAIL}`,
    copy: SUPPORT_EMAIL,
  },
];

/** Способ связи по имени: supportWay('mail'). */
export function supportWay(id) {
  return SUPPORT_WAYS.find((w) => w.id === id) || null;
}
