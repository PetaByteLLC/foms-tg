const emoji = require("node-emoji");
const { bot } = require("@/models/telegramBot");
const { doesChatExist } = require("@/controllers/fomsChatController");
const { createChatAppeal } = require("@/controllers/fomsChatAppealController");
const { kyrgyzstanFlag: kgFlag, russiaFlag: ruFlag } = require("@/utils/emoji");

const regexPatterns = [/\/start/, /\/help/i];
const startChatFeedback = `${kgFlag} _Кайрылууңуз үчүн рахмат. Биздин операторлор мүмкүн болушунча тез арада сурооңузга жооп беришет!_\n\n${ruFlag} _Спасибо за ваш запрос. Наши операторы ответят на ваш вопрос как можно скорее!_`;

const initializeBot = () => {
  bot.onText(/\/start/, (message) => {
    const chatId = message.chat.id;
    const userName = message.from.first_name || "";

    const greetingMessage = `${kgFlag} Саламатсызбы, *${userName}!* _Биздин ботко кош келиңиз. Сизге кандай жардам бере алам?_\n\n${ruFlag} Здравствуйте, *${userName}!*! Добро пожаловать в нашего бота. Чем я могу вам помочь?`;

    sendMessage(chatId, greetingMessage);
  });

  bot.on("message", async (message) => {
    const matchedPattern = regexPatterns.find((regex) =>
      regex.test(message.text)
    );

    if (!matchedPattern) {
      const chatId = message.chat.id;
      const isChatAvailable = await doesChatExist(chatId);

      if (isChatAvailable) {
        console.log("The user texted before!");
      } else {
        sendMessage(chatId, startChatFeedback);
        // createChatAppeal(message);
      }
    }
  });
};

const sendMessage = (chatId, message) => {
  bot.sendMessage(chatId, emoji.emojify(message), {
    parse_mode: "Markdown",
  });
};

module.exports = { initializeBot };
