const axios = require("axios");
const { BASE_URL, getAuthTokens } = require("@/utils/auth");

const createChat = async (chatAppealData, tgChatId) => {
  const { csrfToken, jSessionId } = await getAuthTokens();

  if (!!csrfToken && !!jSessionId) {
    const url = `${BASE_URL}/foms/ws/rest/com.axelor.apps.msg.db.Chat`;
    const requestBody = {
      data: {
        chatId: `${tgChatId}`,
        typeChats: "1",
        appeal: {
          id: chatAppealData.id,
        },
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
      return response.data.data[0];
    } else {
      return null;
    }
  }
};

const doesChatExist = async (chatId) => {
  const { csrfToken, jSessionId } = await getAuthTokens();

  if (!!csrfToken && !!jSessionId) {
    const url = `${BASE_URL}/foms/ws/rest/com.axelor.apps.msg.db.Chat/search`;

    const requestBody = {
      offset: 0,
      data: {
        criteria: [
          {
            operator: "and",
            criteria: [
              {
                fieldName: "chatId",
                operator: "=",
                value: `${chatId}`,
              },
            ],
          },
        ],
      },
    };

    const requestHeader = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Cookie: `${csrfToken}; ${jSessionId}`,
      },
    };

    try {
      const response = await axios.post(url, requestBody, requestHeader);

      console.log(response)
      if (
        response.status === 200 &&
        response.data.status === 0 &&
        response.data.total > 0
      ) {
        return response.data.data[0];
      } else {
        return null;
      }
    } catch (error) {
      console.error("Request error:", error.message);
      throw error;
    }
  } else {
    return false;
  }
};

module.exports = { doesChatExist, createChat };
