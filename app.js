const WebSocket = require("ws");
require("module-alias/register");
const dotenv = require("dotenv").config();
const { app, server } = require("@/config/server");
const { initializeBot } = require("@/controllers/telegramController");

const webSocketServer = new WebSocket.Server({
  server,
  handleProtocols: (protocols, request) => {
    const origin = request.headers.origin;
    const allowedOrigins = ["http://localhost:3000"];

    if (allowedOrigins.includes(origin)) {
      return true;
    } else {
      return false;
    }
  },
});

webSocketServer.on("connection", (webSocketServer) => {
  console.log("New client connected");

  webSocketServer.on("message", (message) => {
    console.log(`Received: ${message}`);
    webSocketServer.send("Message received");
  });

  webSocketServer.on("close", () => {
    console.log("Client disconnected");
  });
});

const port = process.env.PORT || 5000;

app.get("*", (req, res) => {
  res.send("init page");
});

initializeBot();

server.listen(port, () => {
  console.log(`Server is running on: http://localhost:${port}`);
});
