import { mongoose, Schema, SchemaType } from "mongoose";

const tournamentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
    trim: true,
  },
  year: {
    type: Number,
    required: true,
    minlength: 1900,
    maxlength: 2100,
  },
  season: {
    type: String,
    required: true,
    enum: ["Spring", "Summer", "Autumn", "Winter"],
    trim: true,
  },
  organizer: {
    type: String,
    required: false,
    minlength: 3,
    maxlength: 70,
  },

  teams: {
    type: [Schema.Types.ObjectId],
    ref: "teams",
    required: false,
    trim: true,
  },
});

tournamentSchema.index({ title: 1, year: 1, season: 1 }, { unique: true });
export const Tournament = mongoose.model("tournament", tournamentSchema);
