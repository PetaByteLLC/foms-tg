const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");

const token = process.env.BOT_TOKEN;
const url = `https://api.telegram.org/bot${token}/deleteWebhook`;

axios
  .post(url)
  .then((response) => {})
  .catch((error) => {
    console.error("Error deleting webhook:", error);
  });

const bot = new TelegramBot(token, { polling: true });

module.exports = { bot };
