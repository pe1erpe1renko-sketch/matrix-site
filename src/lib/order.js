import {
  PLAN_LIMITS, PLAN_PRICE, PLAN_COPY, boltPack, money, BOLT_COST,
} from './plans.js';
import { urlDateToHuman } from './urlDate.js';

/**
 * ЧТО ИМЕННО ПОКУПАЮТ
 * ===================
 * Оформление открывается тремя адресами, и каждый описывает свой товар:
 *
 *   /checkout?plan=circle                     — подписка
 *   /checkout?product=matrix&date=13-07-1998  — разбор одной даты
 *   /checkout?product=bolts&pack=150          — пакет молний
 *
 * Разбор порядка вынесен сюда, чтобы страница оформления не занималась
 * разбором адреса, а экран после оплаты знал, что именно куплено,
 * из того же места.
 *
 * ЦЕНА ЗДЕСЬ — ПРЕДВАРИТЕЛЬНАЯ. Настоящую считает сервер при создании
 * платежа (lib/payment.js): всё, что пришло из браузера, — подсказка.
 */
export function readOrder(params) {
  const planId = params.get('plan');
  const product = params.get('product');

  if (planId && PLAN_LIMITS[planId]) {
    const limits = PLAN_LIMITS[planId];
    const copy = PLAN_COPY[planId] || {};
    return {
      kind: limits.kind === 'sub' ? 'plan' : 'plan-once',
      id: planId,
      recurrent: limits.kind === 'sub',
      title: limits.label,
      sub: limits.kind === 'sub' ? `Подписка · ${(copy.theme || '').toLowerCase()}` : copy.theme,
      price: PLAN_PRICE[planId].amount,
      lines: copy.items || [],
      note: limits.kind === 'sub' ? null : 'Списание однократное. Автопродление не подключается.',
      backLabel: 'Выбрать другой тариф',
    };
  }

  if (product === 'bolts') {
    const pack = boltPack(params.get('pack')) || boltPack('150');
    return {
      kind: 'bolts',
      id: pack.id,
      recurrent: false,
      bolts: pack.n,
      title: `${pack.n} молний`,
      sub: `Пакет · ${pack.per}`,
      price: pack.price,
      lines: [
        `Хватит на ${Math.floor(pack.n / BOLT_COST.message)} сообщений наставнику`,
        `или на ${Math.floor(pack.n / BOLT_COST.image)} AI-образов`,
        `или на ${Math.floor(pack.n / BOLT_COST.date)} дополнительных дат`,
      ],
      note: 'Списание однократное. Молнии не сгорают, пока активна подписка.',
      backLabel: 'Другие пакеты молний',
    };
  }

  /* По умолчанию — разбор: самый частый вход в оплату. Дат может быть две
     (совместимость, бизнес, мама и ребёнок) — тогда это один разбор
     по набору дат, как и записано в правиле оплаты. */
  const dates = params.getAll('date').filter(Boolean);
  const date = dates[0] || null;
  const copy = PLAN_COPY.once;
  const human = dates.map(urlDateToHuman).join(' и ');
  return {
    kind: 'report',
    id: 'once',
    recurrent: false,
    date,
    dates,
    title: dates.length > 1 ? 'Разбор по двум датам' : 'Разбор одной даты',
    sub: human || 'дата выбирается в разборе',
    price: PLAN_PRICE.once.amount,
    lines: [
      dates.length > 1 ? 'Все вопросы по этим датам' : 'Все 92 вопроса по этой дате',
      'Все 10 типов разбора',
      'PDF со всем разбором',
      `${PLAN_LIMITS.once.bolts} молний в подарок`,
    ],
    note: 'Списание однократное. Автопродление не подключается.',
    backLabel: 'Посмотреть тарифы',
    copy,
  };
}

/** Дата следующего списания — ровно через месяц. */
export function nextChargeDate() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

export { money };
