import mongoose from 'mongoose';

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
//participants array
const RoomSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    participants: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      default: undefined,
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

const RoomModel = model('rooms', RoomSchema);

export default RoomModel;
