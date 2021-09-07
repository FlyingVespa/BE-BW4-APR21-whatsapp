import express from 'express';
import RoomModel from '../models/roomSchema.js';

const roomRouter = express.Router();

// GET

// ??? path check~~
roomRouter.get('/:id', async (req, res) => {
  try {
    const room = await RoomModel.findById(req.params.id);
    res.status(200).send({ messages: asd });
  } catch (error) {
    console.log(error);
  }
});

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
