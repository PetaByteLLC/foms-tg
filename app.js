const cors = require("cors");
const WebSocket = require("ws");
require("module-alias/register");
const dotenv = require("dotenv").config();
const { app, server } = require("@/config/server");
const { initializeBot } = require("@/controllers/telegramController");

const allowedOrigins = [
  "https://foms.brisklyminds.com",
  "https://call-center.foms.kg",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

const webSocketServer = new WebSocket.Server({
  server,
  handleProtocols: (protocols, request) => {
    const origin = request.headers.origin;

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
