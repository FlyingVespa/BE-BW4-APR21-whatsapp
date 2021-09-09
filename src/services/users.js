import express from 'express';
import multer from 'multer';
import createError from 'http-errors';
import { JWTAuthMiddleware } from '../auth/middlewares.js';
import UserModel from '../models/userSchema.js';
import { JWTAuthenticate } from '../auth/tools.js';
import { pipeline } from 'stream';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import shared from '../shared.js';
// import MODELS

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'users',
  },
});

const uploadOnCloudinary = multer({ storage: cloudinaryStorage }).single(
  'avatar'
);

const userRouter = express.Router();

userRouter.get('/online', (req, res) => {
  res.send(shared.onlineUsers.map((user) => ({ ...user, socket: undefined })));
});

userRouter.put('/:id', JWTAuthMiddleware, async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      next(createError(404, `User with _id ${userId} not found`));
    }
  } catch (error) {
    next(
      createError(
        500,
        `An error occurred while updating user ${req.params.userId}`
      )
    );
  }
});

userRouter.post(
  '/me/upload',
  JWTAuthMiddleware,
  uploadOnCloudinary,
  async (req, res, next) => {
    try {
      const user = await UserModel.findById(req.user._id);
      user.avatar = req.file.path;
      await user.save();
      res.send(user.avatar);
    } catch (error) {
      next(error);
    }
  }
);

userRouter.post(
  '/:id/upload',
  JWTAuthMiddleware,
  uploadOnCloudinary,
  async (req, res, next) => {
    try {
      const user = await UserModel.findById(req.user._id);
      user.avatar = req.file.path;
      await user.save();
      res.send(user.avatar);
    } catch (error) {
      next(error);
    }
  }
);

userRouter.get('/', JWTAuthMiddleware, async (req, res, next) => {
  try {
    const response = await UserModel.find();
    res.status(201).send(response);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

userRouter.get('/me', JWTAuthMiddleware, async (req, res, next) => {
  try {
    // console.log(req.user);
    res.send(req.user);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

userRouter.get('/search/:query', JWTAuthMiddleware, async (req, res, next) => {
  try {
    const regex = new RegExp(req.params.query, 'i');
    // console.log(regex)
    const users = await UserModel.find({ username: { $regex: regex } });

    // console.log(req.params.query)
    // console.log(users)
    const otherUsers = users.filter(
      (user) => user._id.toString() !== req.user._id.toString()
    );

    res.send(users);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

userRouter.delete('/me', JWTAuthMiddleware, async (req, res, next) => {
  try {
    await req.user.deleteOne();
  } catch (error) {
    next(error);
  }
});

userRouter.post(
  '/me/setUsername',
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const user = await UserModel.findById(req.user._id);
      user.username = req.body.username;
      await user.save();
      console.log(user);
      res.send(user);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

userRouter.put('/me/status', JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);
    user.status = req.body.status;
    await user.save();
    res.send(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

userRouter.get('/:username', JWTAuthMiddleware, async (req, res, next) => {
  try {
    const regex = new RegExp(req.params.username, 'i');
    // console.log(regex)
    const users = await UserModel.find({ username: { $regex: regex } });

    //res.....
  } catch {}
});

userRouter.put('/:id/status', JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);
    user.status = req.body.status;
    await user.save();
    res.send(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

userRouter.delete('/:id', JWTAuthMiddleware, async (req, res, next) => {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
    if (deletedUser) {
      res.status(204).send();
    } else {
      next(createError(404, `User with _id ${req.params.id} not found!`));
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default userRouter;
// POST

// PUT

// DELETE
