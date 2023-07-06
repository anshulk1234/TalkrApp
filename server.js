const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getgroupUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "TalkrApp";

// Run when client connects
io.on("connection", (socket) => {
  socket.on("joingroup", ({ username, group }) => {
    const user = userJoin(socket.id, username, group);

    socket.join(user.group);

    // Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to TalkrApp!"));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.group)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the group`)
      );

    // Send users and group info
    io.to(user.group).emit("groupUsers", {
      group: user.group,
      users: getgroupUsers(user.group),
    });
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    
    io.to(user.group).emit("message", formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.group).emit(
        "message",
        formatMessage(botName, `${user.username} has left the group`)
      );

      // Send users and group info
      io.to(user.group).emit("groupUsers", {
        group: user.group,
        users: getgroupUsers(user.group),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
