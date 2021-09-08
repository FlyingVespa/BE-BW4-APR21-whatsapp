import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import listEndpoints from 'express-list-endpoints';
import dotenv from 'dotenv';

import { createServer } from 'http';
import { Server } from 'socket.io';
// ERROR HANDLER import
import {
  forbiddenErrHandler,
  serverErrHandler,
  badReqErrHandler,
  notFoundErrHandler,
} from './errorHandlers.js';
import usersRouter from './auth/auth.js';
import userRouter from './services/users.js';
import roomRouter from './services/room.js';

dotenv.config();
// Model import

// CHAT ROUTER import
const PORT = process.env.PORT || 4545;
const app = express();
app.use(cors());
app.use(express.json());

// const server = createServer;
// const io = new Server(server, { true})

// app.use(router? user )
app.use('/auth', usersRouter);
app.use('/users', userRouter);
app.use('/room', roomRouter);
// app.use('/', messageRouter);

// app.use( errohandlers)
app.use(badReqErrHandler);
app.use(notFoundErrHandler);
app.use(forbiddenErrHandler);
app.use(serverErrHandler);

mongoose.connect(process.env.MONGODB_CONNECT).then(() => {
  console.log('SUCCESS: connected to MONGODB');
  app.listen(PORT, () => {
    listEndpoints(app);
    console.log('SERVER listening on: ' + PORT);
  });
});
