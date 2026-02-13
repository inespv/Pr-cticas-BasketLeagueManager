import { mongoose, Schema } from "mongoose";

const playerStatsSchema = new mongoose.Schema({
  player: {
    type: Schema.Types.ObjectId,
    ref: "players",
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: "team",
  },
  points: {
    type: Number,
  },
  rebounds: {
    type: Number,
  },
  assits: {
    type: Number,
  },
  steals: {
    type: Number,
  },
  fouls: {
    type: Number,
  },
  mvp: {
    type: Boolean,
  },
});

const matchSchema = new mongoose.Schema({
  tournament: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },

  date: {
    type: Date,
    required: true,
  },

  stage: {
    type: String,
    required: true,
    enum: ["Group", "Quarterfinal", "Semifinal", "Final"],
  },

  homeTeam: {
    type: Schema.Types.ObjectId,
    ref: "team",
    required: true,
    minlength: 3,
    maxlength: 70,
  },

  awayTeam: {
    type: Schema.Types.ObjectId,
    ref: "team",
    required: true,
    minlength: 3,
    maxlength: 70,
  },

  homeScore: {
    type: Number,
    required: true,
    minlength: 0,
  },

  awayScore: {
    type: Number,
    required: true,
    minlength: 0,
  },

  playerStats: {
    type: [playerStatsSchema],
  },
});

matchSchema.index({ tournament: 1, date: 1, homeTeam: 1, awayTeam: 1 }, { unique: true });

export const Match = mongoose.model("match", matchSchema);
