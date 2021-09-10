import mongoose from "mongoose";

const { Schema, model } = mongoose;

export const MessageSchema = new Schema({
  message: {
    type: String,
    required: true,
    default:"Default"
  },
  sender: { 
    type: Schema.Types.ObjectId,
     ref: "user", 
     required: true 

},
  
});
//participants array
const RoomSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
    },
    participants: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "user",
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

const RoomModel = model("rooms", RoomSchema);

export default RoomModel;
