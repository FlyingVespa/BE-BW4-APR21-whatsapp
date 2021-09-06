import express from "express";
import RoomSchema from "../models/schema";

const messageRouter = express.Router();

// GET

// ??? path check~~
messageRouter.get("/room/:id", async (req, res) => {
  const room = await RoomSchema.findById(req.params.id);
  res.status(200).send({ messages: asd });
});

// POST

// PUT (edit)

// DELETE
