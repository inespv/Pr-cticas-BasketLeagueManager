import express from "express";
import { protegerRuta } from '../auth/auth.js';
import { Match } from "./../models/match.js";

let matchesRouter = express.Router();

//Listar todos los matches

matchesRouter.get("/", protegerRuta(), async (req, res) => {
  try {
    const matches = await Match.find()
      .populate("homeTeam", "name")
      .populate("awayTeam", "name");

    if (matches) {
      res.status(200).send({ result: matches });
    } else {
      res.status(404).send({ error: "No matches found", result: null });
    }
  } catch (e) {
    res.status(500).send({ error: "Internal server error" });
  }
});

//Muestra un partido por ID

matchesRouter.get("/:id", protegerRuta(), async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate("homeTeam")
      .populate("awayTeam");

    if (match) {
      res.status(200).send({ result: match });
    } else {
      res.status(404).send({ error: "Match not found", result: null });
    }
  } catch (e) {
    res.status(500).send({ error: "Internal server error" });
  }
});

// Crea un nuevo partido
matchesRouter.post("/", protegerRuta("admin", "manager"), async (req, res) => {
  try {
    const {
      tournament,
      date,
      stage,
      homeTeam,
      awayTeam,
      homeScore,
      awayScore,
      playerStats,
    } = req.body;

    if (
      !tournament ||
      !date ||
      !stage ||
      !homeTeam ||
      !awayTeam ||
      homeScore === undefined ||
      awayScore === undefined
    ) {
      return res.status(400).send({ error: "Missing required fields" });
    }

    if (homeTeam === awayTeam) {
      return res
        .status(400)
        .send({ error: "Home team and away team cannot be the same" });
    }

    const newMatch = new Match({
      tournament,
      date,
      stage,
      homeTeam,
      awayTeam,
      homeScore,
      awayScore,
      playerStats,
    });

    const savedMatch = await newMatch.save();

    await savedMatch.populate("homeTeam awayTeam");

    res.status(201).send({ result: savedMatch });
  } catch (e) {
    res.status(500).send({ error: "Internal server error" });
  }
});

// Elimina un partido

matchesRouter.delete("/:id", protegerRuta("admin", "manager"), async (req, res) => {
  try {
    const deletedMatch = await Match.findByIdAndDelete(req.params.id);

    if (deletedMatch) {
      res.status(200).send({ result: deletedMatch });
    } else {
      res.status(404).send({ error: "Match not found" });
    }
  } catch (e) {
    res.status(500).send({ error: "Internal server error" });
  }
});

export default matchesRouter;
