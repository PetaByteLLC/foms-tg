const path = require("path");
const emoji = require("node-emoji");
const { bot } = require("@/models/telegramBot");
const { kgFlag, ruFlag } = require("@/utils/emoji");
const messages = require("@/utils/interactionMessages");
const { languageButtons } = require("@/utils/interactionButtons");
const { createChat } = require("@/controllers/fomsChatController");
const { doesChatExist } = require("@/controllers/fomsChatController");
const { createMessage } = require("@/controllers/fomsChatMessageController");
const { createChatAppeal } = require("@/controllers/fomsChatAppealController");

let language = "";

const regexPatterns = [/\/start/, /\/help/i];

const initializeBot = (connectedClients) => {
  bot.onText(/\/start/, (message) => {
    const chatId = message.chat.id;
    const userName = message.from.first_name || "";
    const greetingMessage = {
      kg: `${kgFlag} Саламатсызбы *${userName}*, _Биздин ботко кош келиңиз. Сизге кандай жардам бере алам?_`,
      ru: `${ruFlag} Здравствуйте *${userName}*, _Добро пожаловать в нашего бота. Чем я могу вам помочь?_`,
    };

    sendMessage(chatId, `${greetingMessage.kg}\n\n${greetingMessage.ru}`);

    bot.sendMessage(chatId, "Тилди тандаңыз / Выберите язык:", {
      reply_markup: {
        inline_keyboard: [kyrgyzLanguageBtn, russianLanguageBtn],
      },
    });
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

  bot.on("callback_query", (callbackQuery) => {
    const message = callbackQuery.message;
    const messageId = message.message_id;
    const chatId = callbackQuery.message.chat.id;

    if (callbackQuery.data === "kg") {
      language = "kg";
    } else if (callbackQuery.data === "ru") {
      language = "ru";
    }

    bot.deleteMessage(chatId, messageId).catch((err) => {
      console.error("Failed to delete message:", err);
    });
    bot.answerCallbackQuery(callbackQuery.id);
  });

  bot.on("polling_error", (error) => {
    console.log(`[polling_error] ${error.code}: ${error.message}`);
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

    // if (availableChat) {
    //   console.log(availableChat, "the user texted before");
    // } else {
    //   sendMessage(chatId, firstFeedbackMessage);

    //   try {
    //     const chatAppealData = await createChatAppeal(message);
    //     if (!createChatAppeal) cancelTheAction(chatId);

    //     const chatData = await createChat(chatAppealData, chatId);
    //     if (!chatData) cancelTheAction(chatId);

    //     const messageData = await createMessage(
    //       chatAppealData,
    //       chatData,
    //       message
    //     );

    //     if (!messageData) cancelTheAction(chatId);

    //     const data = {
    //       chatId,
    //       messageData: messageData,
    //       chatData: chatData,
    //     };

    //     for (const client of connectedClients) {
    //       if (client.readyState === WebSocket.OPEN) {
    //         client.send(JSON.stringify(data));
    //       }
    //     }
    //   } catch (error) {
    //     console.error("Error handling chat or message creation:", error);
    //     sendMessage(chatId, errorMessage);
    //   }
    // }
  }
};

const cancelTheAction = (chatId) => {
  sendMessage(chatId, errorMessage);
  return;
};

module.exports = { initializeBot };
