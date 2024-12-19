const emoji = require("node-emoji");
const { bot } = require("@/models/telegramBot");
const { createChat } = require("@/controllers/fomsChatController");
const { doesChatExist } = require("@/controllers/fomsChatController");
const { createMessage } = require("@/controllers/fomsChatMessageController");
const { kgFlag, ruFlag, warning, errorAttention } = require("@/utils/emoji");
const { createChatAppeal } = require("@/controllers/fomsChatAppealController");

const regexPatterns = [/\/start/, /\/help/i];
const firstFeedbackMessage = `${kgFlag} _Кайрылууңуз үчүн рахмат. Биздин операторлор мүмкүн болушунча тез арада сурооңузга жооп беришет!_\n\n${ruFlag} _Спасибо за ваш запрос. Наши операторы ответят на ваш вопрос как можно скорее!_`;
const errorMessage = `_${errorAttention} Бир жерден ката кетти, бир нече мүнөттөн кийин аракет кылып көрүңүз!_\n\n _${errorAttention} Что-то пошло не так. Попробуйте через несколько минут!_`;

const initializeBot = (connectedClients) => {
  bot.onText(/\/start/, (message) => {
    const chatId = message.chat.id;
    const userName = message.from.first_name || "";

    const greetingMessage = `${kgFlag} Саламатсызбы, *${userName}!* _Биздин ботко кош келиңиз. Сизге кандай жардам бере алам?_\n\n${ruFlag} Здравствуйте, *${userName}!*! Добро пожаловать в нашего бота. Чем я могу вам помочь?`;

    sendMessage(chatId, greetingMessage);
  });

  bot.on("message", (msg) => {
    if (msg.text) {
      handleTextMessage(msg, connectedClients);
    } else if (msg.video) {
      bot.sendMessage(chatId, "You sent a video!");
    } else if (msg.document) {
      bot.sendMessage(chatId, "You sent a document!");
    } else if (msg.photo) {
      bot.sendMessage(chatId, "You sent a photo!");
    } else if (msg.audio) {
      bot.sendMessage(chatId, "You sent an audio file!");
    } else {
      bot.sendMessage(chatId, "Unknown message type!");
    }
  });
};

const sendMessage = (chatId, message) => {
  bot.sendMessage(chatId, emoji.emojify(message), {
    parse_mode: "Markdown",
  });
};

const handleTextMessage = async (message, connectedClients) => {
  const matchedPattern = regexPatterns.find((regex) =>
    regex.test(message.text)
  );

  if (!matchedPattern) {
    const chatId = message.chat.id;
    const availableChat = await doesChatExist(chatId);

    if (availableChat) {
      console.log(availableChat, "the user texted before");
    } else {
      sendMessage(chatId, firstFeedbackMessage);

      try {
        const chatAppealData = await createChatAppeal(message);
        if (!createChatAppeal) cancelTheAction(chatId);

        const chatData = await createChat(chatAppealData, chatId);
        if (!chatData) cancelTheAction(chatId);

        const messageData = await createMessage(
          chatAppealData,
          chatData,
          message
        );

        if (!messageData) cancelTheAction(chatId);

        const data = {
          chatId,
          messageData: messageData,
          chatData: chatData,
        };

        for (const client of connectedClients) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
          }
        }
      } catch (error) {
        console.error("Error handling chat or message creation:", error);
        sendMessage(chatId, errorMessage);
      }
    }
  }
};

const cancelTheAction = (chatId) => {
  sendMessage(chatId, errorMessage);
  return;
};

module.exports = { initializeBot };
