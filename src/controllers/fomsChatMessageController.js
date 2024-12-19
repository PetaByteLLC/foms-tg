const axios = require("axios");
const { BASE_URL, getAuthTokens } = require("@/utils/auth");

const createMessage = async (chatAppealData, chatData, messageObject) => {
  const { csrfToken, jSessionId } = await getAuthTokens();

  if (!!csrfToken && !!jSessionId) {
    const url = `${BASE_URL}/foms/ws/chats/message`;
    const requestBody = {
      type: "text",
      status: "sent",
      appealType: "telegram",
      body: messageObject.text,
      timestamp: messageObject.date,
      chat: {
        id: chatData.id,
      },
      appeal: {
        id: chatAppealData.id,
      },
    };

    const requestHeader = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Cookie: `${csrfToken}; ${jSessionId}`,
      },
    };

    const response = await axios.post(url, requestBody, requestHeader);
   
    if (response.status === 200 && response.data.status === 0) {
      return response.data.data;
    } else {
      return null;
    }
  }
};

module.exports = { createMessage };
