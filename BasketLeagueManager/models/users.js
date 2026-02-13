import { mongoose } from "mongoose";

let usersSchema = new mongoose.Schema({
  login: {
    type: String,
    required: true,
    minlength: 4,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
  },

  rol: {
    type: String,
    required: true,
    trim: true,
    enum :["admin","manager","user"]
  },
});

export const User = mongoose.model("users", usersSchema);
