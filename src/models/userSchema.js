import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema, model } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    maxLength: 80,
  },
  avatar: {
    type: String,
  },
  password: {
    type: String,
  },
});

export default model('User', UserSchema);
