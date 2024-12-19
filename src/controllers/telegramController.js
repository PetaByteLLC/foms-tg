const emoji = require("node-emoji");
const { bot } = require("@/models/telegramBot");
const { doesChatExist } = require("@/controllers/fomsChatController");
const { createChatAppeal } = require("@/controllers/fomsChatAppealController");
const { kyrgyzstanFlag: kgFlag, russiaFlag: ruFlag } = require("@/utils/emoji");

const regexPatterns = [/\/start/, /\/help/i];
const firstFeedbackMessage = `${kgFlag} _Кайрылууңуз үчүн рахмат. Биздин операторлор мүмкүн болушунча тез арада сурооңузга жооп беришет!_\n\n${ruFlag} _Спасибо за ваш запрос. Наши операторы ответят на ваш вопрос как можно скорее!_`;

const initializeBot = (connectedClients) => {
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
        sendMessage(chatId, firstFeedbackMessage);
        const chatAppealData = createChatAppeal(message);
        console.log(chatAppealData);

        const data = {
          chatId: chatId,
          type: "telegramMessage",
          title: `${message.from.first_name} ${message.from.last_name}`,
          titleColor: "blue",
          messageType: "text",
          date: formattedDate(message),
          text: message.text,
          isOwnMessage: false,
        };

        for (const client of connectedClients) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
          }
        }
      }
    }
  });
};

const sendMessage = (chatId, message) => {
  bot.sendMessage(chatId, emoji.emojify(message), {
    parse_mode: "Markdown",
  });
};

const formattedDate = (message) => {
  const options = {
    timeZone: "Asia/Bishkek",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  const formatter = new Intl.DateTimeFormat("en-GB", options);
  const parts = formatter.formatToParts(new Date(message.date * 1000));
  const formattedDate = `${parts[4].value}-${parts[2].value}-${parts[0].value} ${parts[6].value}:${parts[8].value}:${parts[10].value}`;

  return formattedDate;
};

module.exports = { initializeBot };
