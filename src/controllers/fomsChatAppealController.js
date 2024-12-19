const axios = require("axios");
const {
  getAuthTokens,
  BASE_URL,
  primaryResponseCondition,
} = require("@/utils/auth");

const createChatAppeal = async (msgObj) => {
  const { csrfToken, jSessionId } = await getAuthTokens();

  if (!!csrfToken && !!jSessionId) {
    const url = `${BASE_URL}/foms/ws/rest/com.axelor.apps.msg.db.Appeal`;
    const requestBody = {
      data: {
        name: msgObj.from.username,
        firstName: msgObj.from.first_name,
        status: "1", // 1 - Available, 2 -In Progress, 3- Сompleted
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

    // console.log(response.status === 200)
    // console.log(response.data)

    // if (response.status === 200 && primaryResponseCondition(response)) {
    //   return response.data.data;
    // } else {
    //   return null;
    // }
  }
};

module.exports = { createChatAppeal };
