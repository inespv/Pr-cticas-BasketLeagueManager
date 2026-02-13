import { mongoose } from "mongoose";

let playerSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    trim: true,
  },
  country: {
    required:true,
    minlength:2,
    type: String,
    match: /^[A-Z]{2}$/,
  },

  birthDate: {
    type: Date,
    required: true,
    trim: true,
  },

  role: {
    type: String,
    required: true,
    trim: true,
    enum: ["base", "escolta", "alero", "ala-pivot", "pivot", "polivalente"],
  },
});

export const Player = mongoose.model("player", playerSchema);
