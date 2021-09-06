import express from 'express';
import CreateError from 'http-errors';
import { JWTAuthMiddleware } from '../auth/middlewares.js';
import UserSchema from '../models/userSchema.js';

const usersRouter = express.Router();

usersRouter.post('/register', async (req, res, next) => {
  try {
    const newUser = new UserSchema(req.body);
    const { _id } = await newUser.save();

    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});
usersRouter.get('/', JWTAuthMiddleware, async (req, res, next) => {
  try {
    const users = await UserSchema.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
