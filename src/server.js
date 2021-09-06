import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import listEndpoints from "express-list-endpoints";

import { createServer } from "http";
import { Server } from "socket.io";
// ERROR HANDLER import
import {
  forbiddenErrHandler,
  serverErrHandler,
  badReqErrHandler,
  notFoundErrHandler,
} from "./errorHandlers";
// Model import

// CHAT ROUTER import
const PORT = process.env.PORT || 4545;
const app = express();
app.use(cors());
app.use(express.json());

const server = createServer;
// const io = new Server(server, { true})

// app.use(router? user )
// app.use(router?  chat)

// app.use( errohandlers)
app.use(badReqErrHandler);
app.use(notFoundErrHandler);
app.use(forbiddenErrHandler);
app.use(serverErrHandler);

mongoose.connect(process.env.MONGODB_CONNECT).then(() => {
  console.log("SUCCESS: connected to MONGODB");
  server.listen(PORT, () => {
    listEndpoints(app);
    console.log("SERVER listenign on: " + PORT);
  });
});
