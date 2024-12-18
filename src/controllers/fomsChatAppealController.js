const axios = require("axios");
const { getAuthTokens, BASE_URL } = require("@/utils/auth");

const createChatAppeal = async (msgObj) => {
  const { csrfToken, jSessionId } = await getAuthTokens();

  if (!!csrfToken && !!jSessionId) {
    const url = `${BASE_URL}/foms/ws/rest/com.axelor.apps.msg.db.Appeal`;
    const requestBody = {
      offset: 0,
      data: {
        name: "",
        firstName: "",
        phoneNumber: "",
        status: "", // 1 - Available, 2 -In Progress, 3- Сompleted
        transferMessage: "",
        commentary: "",
      },
    };

    const requestHeader = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Cookie: `${csrfToken}; ${jSessionId}`,
      },
    };

    console.log(msgObj);
    console.log(requestBody);
  }
};

module.exports = { createChatAppeal };
