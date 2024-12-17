const dotenv = require("dotenv").config();
const { app, server } = require("./src/config/server");
const { initializeBot } = require("./src/controllers/telegramController");

const port = process.env.PORT || 5000;

initializeBot();

server.listen(port, () => {
  console.log(`Server is running on: http://localhost:${port}`);
});
