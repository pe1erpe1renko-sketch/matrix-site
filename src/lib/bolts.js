import { createStore } from './devStore.js';
import { PLAN_LIMITS, BOLT_COST } from './plans.js';

/**
 * МОЛНИИ — БАЛАНС И СПИСАНИЯ
 * ==========================
 * Молнии тратятся ТОЛЬКО на то, что считает нейросеть: сообщение
 * наставнику, AI-образ, разбор сверх тарифа. Всё остальное — чтение
 * разборов, расчёт матрицы, аркан дня, PDF — бесплатно всегда.
 * Цены лежат в plans.js (BOLT_COST), здесь только кошелёк.
 *
 * ЦЕНА ВИДНА ДО НАЖАТИЯ. Кнопка подписана «⚡1», «⚡5», «⚡50»,
 * баланс висит в шапке. Человек не должен узнавать о списании после него.
 *
 * ЕСЛИ НЕ ХВАТАЕТ — кнопку не блокируем: spend() вернёт отказ, и интерфейс
 * покажет окно с недостачей и ценой пакета. Заблокированная кнопка не
 * объясняет ничего, а это лучший момент рассказать про тариф.
 *
 * ЭТО ЗАГЛУШКА. Настоящий баланс придёт с бэкенда вместе с оплатой
 * (lib/payment.js). Здесь он живёт в localStorage, чтобы на предпросмотре
 * можно было пощёлкать списания и увидеть механику.
 */

const store = createStore('matrix.bolts', { balance: 40, log: [] }, (saved, initial) => ({
  balance: typeof saved.balance === 'number' ? saved.balance : initial.balance,
  log: Array.isArray(saved.log) ? saved.log.slice(0, 50) : [],
}));

const now = () => new Date().toISOString();

export const useBolts = () => store.useStore();
export const boltBalance = () => store.get().balance;

/**
 * Списать. Вернёт { ok: true } или { ok: false, short: сколько не хватает }.
 * Интерфейс по отказу показывает окно докупки, а не ошибку.
 */
export function spendBolts(cost, what) {
  const state = store.get();
  if (state.balance < cost) return { ok: false, short: cost - state.balance, balance: state.balance };
  store.set({
    balance: state.balance - cost,
    log: [{ at: now(), delta: -cost, what }, ...state.log].slice(0, 50),
  });
  return { ok: true, balance: state.balance - cost };
}

/** Начислить: покупка пакета, ежемесячная выдача по тарифу, подарок к разовому. */
export function grantBolts(amount, what) {
  if (!amount) return;
  const state = store.get();
  store.set({
    balance: state.balance + amount,
    log: [{ at: now(), delta: amount, what }, ...state.log].slice(0, 50),
  });
}

/** Хватит ли на действие — чтобы подписать кнопку заранее. */
export const canAfford = (cost) => store.get().balance >= cost;

/**
 * Сколько всего действий можно сделать на текущий баланс.
 * Нужно на экране после покупки пакета: «хватит на 30 образов или 3 разбора».
 */
export function boltsWorth(balance) {
  return {
    messages: Math.floor(balance / BOLT_COST.message),
    images: Math.floor(balance / BOLT_COST.image),
    reports: Math.floor(balance / BOLT_COST.report),
  };
}

/** Сколько молний даёт тариф — для экрана после оплаты и для допродажи. */
export const planBolts = (plan) => PLAN_LIMITS[plan]?.bolts ?? 0;
