import mongoose from "mongoose";

const { Schema, model } = mongoose;

export const MessageSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
});

export const RoomSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    chatHistory: {
      type: [MessageSchema],
      required: true,
      default: [],
    },
  },
  { timestamps: true }
);

export default model("rooms", RoomSchema);
