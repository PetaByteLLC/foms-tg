const axios = require("axios");
const { getAuthTokens, BASE_URL } = require("@/utils/auth");

const createChat = () => {};

const doesChatExist = async (chatId) => {
  const { csrfToken, jSessionId } = await getAuthTokens();

  if (!!csrfToken && !!jSessionId) {
    const url = `${BASE_URL}/foms/ws/rest/com.axelor.apps.msg.db.Chat/search`;

    const requestBody = {
      offset: 0,
      data: {
        _domainContext: {
          chatId: `${chatId}`,
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

    try {
      const response = await axios.post(url, requestBody, requestHeader);

      if (response.status === 200) {
        const data = response.data;
        return (data.status === 0 && data.total > 0);
      } else {
        throw new Error("Request failed");
      }
    } catch (error) {
      console.error("Request error:", error.message);
      throw error;
    }
  } else {
    return false;
  }
};

module.exports = { doesChatExist };
