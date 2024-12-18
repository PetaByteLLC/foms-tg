const axios = require("axios");

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
let storedCSRFToken = null;
let storedJSessionId = null;

const authURL = `${BASE_URL}/foms/callback`;
const AXELOR_USER = process.env.NEXT_PUBLIC_AXELOR_USER;
const AXELOR_PASSWORD = process.env.NEXT_PUBLIC_AXELOR_PASSWORD;

const getAuthTokens = async () => {
  if (!!storedCSRFToken && !!storedJSessionId)
    return { storedCSRFToken, storedJSessionId };

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

      if (!cookies) return { csrfToken: undefined, jSessionId: undefined };

      const jSessionId = cookies
        .find((cookie) => cookie.startsWith("JSESSIONID"))
        .split(";")[0];
      const csrfToken = cookies
        .find((cookie) => cookie.startsWith("CSRF-TOKEN"))
        .split(";")[0];

      storedJSessionId = jSessionId;
      storedCSRFToken = csrfToken;

      return { csrfToken, jSessionId };
    } else {
      throw new Error("Authorization failed");
    }
  } catch (error) {
    console.error("Authorization error:", error.message);
    throw error;
  }
};

module.exports = { getAuthTokens, BASE_URL };
