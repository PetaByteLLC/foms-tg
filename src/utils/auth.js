const axios = require("axios");

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const authURL = `${BASE_URL}/foms/callback`;
const AXELOR_USER = process.env.NEXT_PUBLIC_AXELOR_USER;
const AXELOR_PASSWORD = process.env.NEXT_PUBLIC_AXELOR_PASSWORD;

const getAuthTokens = async () => {
  try {
    const response = await axios.post(
      authURL,
      {
        username: AXELOR_USER,
        password: AXELOR_PASSWORD,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      const cookies = response.headers["set-cookie"];

      if (!cookies) {
        return { csrfToken: undefined, jSessionId: undefined };
      }

      const jSessionId = cookies
        .find((cookie) => cookie.startsWith("JSESSIONID"))
        ?.split(";")[0];
      const csrfToken = cookies
        .find((cookie) => cookie.startsWith("CSRF-TOKEN"))
        ?.split(";")[0];

      const tokens = { csrfToken, jSessionId };

      return tokens;
    } else {
      throw new Error("Authorization failed");
    }
  } catch (error) {
    console.error("Authorization error:", error.message);
    throw error;
  }
};

const primaryResponseCondition = (response) => {
  return response.data.status === 0 && response.data.total > 0;
};

module.exports = { getAuthTokens, BASE_URL, primaryResponseCondition };
