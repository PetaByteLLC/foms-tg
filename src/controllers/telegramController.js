const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");

const token = process.env.BOT_TOKEN;

const url = `https://api.telegram.org/bot${token}/deleteWebhook`;

axios
  .post(url)
  .then((response) => {
    console.log("Webhook deleted:", response.data);
  })
  .catch((error) => {
    console.error("Error deleting webhook:", error);
  });

const bot = new TelegramBot(token, { polling: false });

const initializeBot = () => {
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name || "дос ";

    const message = `
        Салам, *${userName}!* _Биздин ботко кош келиңиз. Сизге кандай жардам бере алам?_\n
        `;

    bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
  });

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;

    await bot.sendChatAction(chatId, "typing");

    setTimeout(() => {
      bot.sendMessage(chatId, "Welcome to the bot! How can I assist you?");
    }, 10000);
  });
};

module.exports = { initializeBot };
