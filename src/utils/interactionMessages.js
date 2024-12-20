const { kgFlag, ruFlag, warning, errorAttention } = require("@/utils/emoji");

const firstFeedbackMessage = {
  kg: `${kgFlag} _Кайрылууңуз үчүн рахмат. Биздин операторлор мүмкүн болушунча тез арада сурооңузга жооп беришет!_`,
  ru: `${ruFlag} _Спасибо за ваш запрос. Наши операторы ответят на ваш вопрос как можно скорее!_`,
};
const errorMessage = {
  kg: `_${errorAttention} Бир жерден ката кетти, бир нече мүнөттөн кийин аракет кылып көрүңүз!_`,
  ru: `_${errorAttention} Что-то пошло не так. Попробуйте через несколько минут!_`,
};

module.exports = { firstFeedbackMessage, errorMessage };
