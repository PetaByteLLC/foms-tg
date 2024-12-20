const emoji = require("node-emoji");
const { kgFlag, ruFlag, warning, errorAttention } = require("@/utils/emoji");

const emojify = emoji.emojify;

const languageButtons = {
  kg: [{ text: emojify(`${kgFlag} Кыргызча`), callback_data: "kg" }],
  ru: [{ text: emojify(`${ruFlag} Русский`), callback_data: "ru" }],
};

module.exports = { languageButtons };
