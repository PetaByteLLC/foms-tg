const TelegramBot = require("node-telegram-bot-api");

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const initializeBot = () => {
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name || "дос | там ";

    const message = `
        Салам, *${userName}!* _Биздин ботко кош келиңиз. Сизге кандай жардам бере алам?_\n
        Привет, *${userName}!* _Добро пожаловать в наш бот. Чем я могу вам помочь?_\n
        `;

    bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
  });

  bot.on("message", (msg) => {
    const chatId = msg.chat.id;

    if (msg.text !== "/start") {
      bot.sendMessage(chatId, "I'm sorry, I don't understand that command.");
    }
  });
};

module.exports = { initializeBot };
