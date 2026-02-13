import { mongoose, Schema } from "mongoose";

const rosterSchema = new mongoose.Schema({
  player: {
    type: Schema.Types.ObjectId,
    ref: "players",
    required: true,
    trim: true,
  },
  joinDate: {
    type: Date,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    trim: true,
  },
  foundedAt: {
    type: Date,
    required: false,
  },
  roster: {
    type: [rosterSchema],
  },
});

export const Team = mongoose.model("team", teamSchema);
