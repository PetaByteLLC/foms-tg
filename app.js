const { Server } = require("socket.io");
const dotenv = require("dotenv").config();
const { app, server } = require("./src/config/server");
const { initializeBot } = require("./src/controllers/telegramController");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("message", (data) => {
    console.log("Received message:", data);

    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

const port = process.env.PORT || 5000;

initializeBot();

server.listen(port, () => {
  console.log(`Server is running on: http://localhost:${port}`);
});
