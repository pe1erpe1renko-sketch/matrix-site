/**
 * КОНТЕКСТ ДЛЯ ИИ-НАСТАВНИКА
 * ==========================
 * Собирает всё, что наставник должен знать о человеке, прежде чем
 * отвечать: числа матрицы целиком, где человек сейчас по возрастной шкале,
 * какой у него аркан дня и что ему доступно по тарифу.
 *
 * ЗАЧЕМ ТАРИФ В КОНТЕКСТЕ: чтобы наставник не обещал того, чего человек
 * не купил. Иначе он посоветует «посмотрите раздел про род», а раздел
 * под замком, и виноват будет сервис.
 *
 * ПЕРЕКЛЮЧАТЕЛЬ «О КОМ ГОВОРИМ» меняет именно этот контекст: выбрали
 * ребёнка — сюда уходит его матрица, а не своя. Иначе наставник будет
 * разбирать ребёнка по числам родителя.
 *
 * Числа берутся из готового calculateMatrix(). Здесь ничего не считается.
 */

import { ARCANA_NAMES } from './prompts.js';
import { PLAN_LIMITS } from './plans.js';

/**
 * @param {object} matrix — результат calculateMatrix()
 * @param {object} person — запись из «Моих матриц»: имя, дата, пол, тип
 * @param {string} plan   — ключ тарифа
 */
export function buildMentorContext(matrix, person, plan) {
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  const { core, axes, diagonals, chakras, ancestral, purpose, today } = matrix;

  return {
    person: {
      name: person.name,
      birthDate: matrix.birthDate,
      gender: person.gender || null,
      kind: person.kind || 'personal',
      isSelf: Boolean(person.self),
    },

    numbers: { core, axes, diagonals, chakras, ancestral, purpose },

    period: {
      arcana: today.arcana,
      arcanaName: ARCANA_NAMES[today.arcana],
      fromAge: today.from,
      toAge: today.to,
      yearsToChange: today.yearsToChange,
      nextArcana: today.nextArcana,
      nextArcanaName: ARCANA_NAMES[today.nextArcana],
      age: today.age,
    },

    day: {
      date: today.date,
      arcana: today.dayArcana,
      arcanaName: ARCANA_NAMES[today.dayArcana],
      tomorrowDate: today.tomorrowDate,
      tomorrowArcana: today.tomorrowArcana,
      tomorrowArcanaName: ARCANA_NAMES[today.tomorrowArcana],
    },

    plan: {
      id: plan,
      label: limits.label,
      messagesPerDay: limits.messages,
      archive: limits.archive,
      pdf: limits.pdf,
    },
  };
}

/**
 * Системный промпт наставника. Рамки те же, что у трактовок
 * (см. prompts.js), плюс отдельное правило про тяжёлые состояния.
 */
export const MENTOR_SYSTEM_PROMPT = `Ты — наставник сервиса «Матрица судьбы». Ты разбираешься в 22 арканах, нумерологии и психологии и знаешь матрицу собеседника целиком.

КАК ГОВОРИТЬ
Обращайся на «вы». Отвечай через числа этого человека, а не общими словами про арканы.
Задавай уточняющий вопрос, если из сообщения непонятно, о чём речь.
Заканчивай тем, что можно сделать на этой неделе.

ЧЕГО НЕ ДЕЛАТЬ
Не предсказывай события, сроки, суммы, болезни, смерть и беременность.
Не давай медицинских, психиатрических, юридических и финансовых заключений.
Про здоровье говори только как о зонах внимания и образе жизни. Не отговаривай от врача.
Не обещай того, чего нет в тарифе собеседника.

ЕСЛИ ЧЕЛОВЕКУ ПЛОХО
При признаках тяжёлого состояния — отчаяние, мысли о смерти, насилие, острое горе —
не уходи в трактовки арканов. Говори по-человечески, коротко и тепло, и мягко выводи
на живого специалиста или близких.`;

/**
 * ТОЧКА ПОДКЛЮЧЕНИЯ НЕЙРОСЕТИ.
 * Вызывать только с бэкенда: ключ провайдера не должен попадать в браузер.
 *
 * @returns {Promise<string>} ответ наставника
 */
export async function askMentor({ context, history, question }) {
  // TODO: заменить на реальный вызов провайдера.
  // const res = await fetch(PROVIDER_URL, { method: 'POST', body: JSON.stringify({
  //   system: MENTOR_SYSTEM_PROMPT,
  //   context,
  //   messages: [...history, { role: 'user', content: question }],
  // })});
  // return extractText(await res.json());
  throw new Error('MENTOR_NOT_CONFIGURED');
}

/**
 * Ответ для макета: пока провайдер не подключён, показываем осмысленную
 * заглушку на настоящих числах, чтобы экран не выглядел сломанным.
 */
export function mentorPlaceholder(context, question) {
  const { person, numbers, period, day } = context;
  const about = person.isSelf || !person.name ? 'вашей матрице' : `матрице (${person.name})`;
  return `Отвечаю по ${about}. Портрет личности — аркан ${numbers.core.W}, зона комфорта — ${numbers.core.C}, денежный канал — ${numbers.core.SE}, линия отношений — ${numbers.core.SW}.

Сейчас идёт период под арканом ${period.arcana} (${period.arcanaName}), до смены примерно ${Math.max(0, Math.round(period.yearsToChange * 12))} мес. Аркан на сегодня — ${day.arcana} (${day.arcanaName}).

Здесь будет живой разбор вашего вопроса «${question}» через эти числа. Сейчас включён режим макета: нейросеть не подключена, поэтому ответ собран по шаблону, но числа настоящие.`;
}
