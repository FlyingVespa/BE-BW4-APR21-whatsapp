import express from 'express';
import { JWTAuthMiddleware } from '../auth/middlewares.js';
import RoomModel from '../models/roomSchema.js';
import { sockets } from '../server.js';
import { onlineUsers } from '../server.js';
const roomRouter = express.Router();

// GET

roomRouter.get('/', async (req, res, next) => {
  try {
    const rooms = await RoomModel.find({}).populate({
      path: 'participants',
      select: '-password',
    });

    res.status(200).send(rooms);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

roomRouter.get('/user/:id', JWTAuthMiddleware, async (req, res) => {
  const room = await RoomModel.findOne({
    $and: [{ participants: req.params.id }, { participants: req.user._id }],
  }).populate('participants');

  console.log('req params id', req.params.id);
  console.log('req user id', req.user._id);
  console.log('--------- after populate -----------');

  if (room !== null) {
    res.status(200).send(room);
  } else {
    const emptyRoom = {
      participants: [req.params.id, req.user._id],
    };
    const _room = new RoomModel(emptyRoom);
    await _room.save();
    const _room_ = await RoomModel.findOne({
      $and: [{ participants: req.params.id }, { participants: req.user._id }],
    }).populate({
      path: 'participants',
      select: '-password',
    });

    console.log('--------------------');
    console.log('sockets:', sockets);
    console.log('req.params.id:', req.params.id);
    console.log('req.user._id:', req.user._id);

    sockets[req.params.id].join(_room_._id.toString());
    sockets[req.user._id].join(_room_._id.toString());
    console.log('--------------------');

    res.status(200).send(_room_);
  }
});

// ??? path check~~
// roomRouter.get('/:id', async (req, res) => {
//   try {
//     const room = await RoomModel.findById(req.params.id);
//     res.status(200).send({ messages: asd });
//   } catch (error) {
//     console.log(error);
//   }
// });

// POST
roomRouter.post('/', async (req, res, next) => {
  try {
    const newRoom = new RoomModel(req.body);
    console.log(newRoom);

    await newRoom.save();

    res.status(201).send(newRoom);
  } catch (error) {
    console.log(error);
    error.status = 400;
    next(error);
  }
});

roomRouter.get('/history/:id', async (req, res) => {
  const room = await RoomModel.findById(req.params.id);
  res.status(200).send({ chatHistory: room.chatHistory });
});

// need to check history soon

roomRouter.get('/me', JWTAuthMiddleware, async (req, res, next) => {
  try {
    console.log('HELLLO THIS IS MY CONSOLE LOG!!!', req.user._id.toString());
    const find = await RoomModel.find({
      participants: req.user._id.toString(),
    }).populate({
      path: 'participants',
      select: '-password',
    });

    // this person's socket must join all the rooms in which s/he is already present

    const rooms = await RoomModel.find({ participants: userId });
    console.log('userid', userId);
    for (let room of rooms) {
      onlineUsers
        .find((element) => element.userId === userId)
        .socket.join(room.id);
    }
    res.send(rooms);

    // res.send(find);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// PUT (edit)

// DELETE

// roomsRouter.get('/', async (req, res) => {

//   try {
//       const rooms = await RoomsModel.find({})
//       res.status(200).send({ rooms })
//   } catch (error) {
//       console.log(error)
//   }
// })

export default roomRouter;
