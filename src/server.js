import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";
import UserModel from "./models/userSchema.js";
import RoomModel from "./models/roomSchema.js";
// ERROR HANDLER import
import {
  forbiddenErrHandler,
  serverErrHandler,
  badReqErrHandler,
  notFoundErrHandler,
} from "./errorHandlers.js";
import usersRouter from "./auth/auth.js";
import userRouter from "./services/users.js";
import roomRouter from "./services/room.js";

// CHAT ROUTER import
const PORT = process.env.PORT || 4545;
const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();

const server = createServer(app);
// const server = createServer;
// const io = new Server(server, { true})
const io = new Server(server, { allowEIO3: true });
// app.use(router? user )
app.use("/auth", usersRouter);
app.use("/users", userRouter);
app.use("/room", roomRouter);
// app.use('/', messageRouter);

// app.use( errohandlers)
app.use(badReqErrHandler);
app.use(notFoundErrHandler);
app.use(forbiddenErrHandler);
app.use(serverErrHandler);

export const sockets = {};

io.on("connection", (socket) => {
  socket.on("did-connect", async (userId) => {
    sockets[userId] = socket;
    try {
      const rooms = await RoomModel.find({ participants: userId });
      for (let room of rooms) socket.join(room._id.toString());
    } catch (error) {
      console.log("error:", error);
    }
  });

  socket.on("joinRoom", async (roomId) => {
    socket.join(roomId);
  });

  socket.on("sendMessage", async ({ message, roomId }) => {
    socket.join(roomId);
    const room = await RoomModel.findById(roomId);

    await RoomModel.findOneAndUpdate(
      { _id: roomId },
      {
        $push: { chatHistory: message },
      }
    );
    socket.to(roomId).emit("message", message);
  });

  socket.on("login", ({ username, room }) => {
    onlineUsers.push({ username, id: socket.id, room });

    socket.join(room);
    console.log(socket.rooms);

    // Emits to everyone excluding this client
    socket.broadcast.emit("newLogin");
    socket.emit("loggedin");
  });

  socket.on("disconnect", (userId) => {
    delete sockets[userId];
    console.log("disconnected");
  });
});

mongoose.connect(process.env.MONGODB_CONNECT).then(() => {
  console.log("SUCCESS: connected to MONGODB");
  app.listen(PORT, () => {
    listEndpoints(app);
    console.log("SERVER listening on: " + PORT);
  });
});
