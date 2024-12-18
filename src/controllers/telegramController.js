const { bot } = require("@/models/telegramBot");
const { doesChatExist } = require("@/controllers/fomsChatController");

const regexPatterns = [/\/start/, /\/help/i];
const startChatFeedback =
  "Кайрылууңуз үчүн рахмат. Биздин операторлор мүмкүн болушунча тез арада сурооңузга жооп беришет!";

const initializeBot = () => {
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name || "дос ";

    const message = `
        Саламатсызбы, *${userName}!* _Биздин ботко кош келиңиз. Сизге кандай жардам бере алам?_\n
        `;

    bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
  });

  bot.on("message", async (msg) => {
    const matchedPattern = regexPatterns.find((regex) => regex.test(msg.text));

    if (!matchedPattern) {
      const chatId = msg.chat.id;
      const isChatAvailable = await doesChatExist(chatId);

      if (isChatAvailable) {
        console.log("The user texted before!");
      } else {
        bot.sendMessage(chatId, startChatFeedback);
      }
    }
  });
};

module.exports = { initializeBot };
