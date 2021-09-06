import express from 'express';
import CreateError from 'http-errors';
import { JWTAuthMiddleware } from '../auth/middlewares.js';
import UserSchema from '../models/userSchema.js';
import { JWTAuthenticate } from "./tools.js"

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

usersRouter.post("/login", async (req, res, next) => {
    try {
      const { email, password } = req.body
      // 1. verify credentials
      const user = await UserSchema.checkCredentials(email, password)
  
      if (user) {
        // 2. Generate token if credentials are ok
        const accessToken = await JWTAuthenticate(user)
        // 3. Send token back as a response
        res.send({ accessToken })
      } else {
        next(createError(401, "Credentials not valid!"))
      }
    } catch (error) {
      next(error)
    }
  })

export default usersRouter;