const { getAuthTokens } = require("@/utils/auth");


const doesChatExist = async (chatId) => {
  const {csrfToken, jSessionId} = await getAuthTokens();
  console.log(csrfToken);
  console.log(jSessionId);
};

module.exports = { doesChatExist };
