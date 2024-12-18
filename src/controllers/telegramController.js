const { bot } = require("@/models/telegramBot");
const { doesChatExist } = require("@/controllers/fomsController");  

const regexPatterns = [/\/start/, /\/help/i];
const startChatFeedback =
  "Сурооңуз үчүн, ахмат. Биздин операторлор мүмкүн болушунча тез арада сурооңузга жооп беришет!";

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
    const matchedPattern = regexPatterns.find((regex) => regex.test(msg.text));

    if (!matchedPattern) {
      const chatId = msg.chat.id;
      doesChatExist(chatId);

      bot.sendMessage(chatId, "Welcome to the bot! How can I assist you?");
    }
  });
};

module.exports = { initializeBot };
