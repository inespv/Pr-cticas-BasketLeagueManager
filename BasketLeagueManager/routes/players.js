import express from "express";
import { Player } from "../models/player.js";
import { Team } from "../models/team.js";
import { protegerRuta } from '../auth/auth.js';

const playerRouter = express.Router();

// Listar todos los jugadores

playerRouter.get("/", protegerRuta(), async (req, res) => {
  try {
    const players = await Player.find();
    if (players) {
      res.status(200).send({ ok: true, result: players });
    } else {
      res.status(404).send({ result: "Players not found" });
    }
  } catch (e) {
    res.status(500).send({ result: "Internal serve error " });
  }
});

//Búsqueda por name

playerRouter.get("/find", protegerRuta(), async (req, res) => {
  try {
    if (!req.query.name) {
      return res
        .status(400)
        .send({ result: "Missing search parameter: name" });
    }
    const player = await Player.findOne({
      name: { $regex: req.query.name, $options: "i" },
    });
    if (!player) {
      return res.status(404).send({ result: "Player not found" });
    }
    return res.status(200).send({ ok: true, result: player });
  } catch (err) {
    return res.status(500).send({ result: err.message });
  }
});

//Añadir un jugador

playerRouter.post("/", protegerRuta("admin"), async (req, res) => {
  try {
    const { name, nickname, country, birthDate, role } = req.body;

    if (!name || !nickname || !country || !role || !birthDate) {
      return res.status(400).send({ result: " Missing parameter" });
    }

    const existingPlayer = await Player.findOne({ nickname });

    if (existingPlayer) {
      return res
        .status(400)
        .send({ result: "Player with nickname already exists" });
    }
    const player = new Player(req.body);
    const savedPlayer = player.save();

    if (savedPlayer) {
      res.status(201).send({ ok: true, result: savedPlayer });
    }
  } catch (e) {
    res.status(500).send({ result: "Internal serve error " });
  }
});

//Información de un jugador by ID

playerRouter.get("/:id", protegerRuta(), async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (player) {
      res.status(200).send({ ok: true, result: player });
    } else {
      res.status(404).send({ result: "Player id not found" });
    }
  } catch (e) {
    res.status(500).send({ result: "Internal serve error " });
  }
});

//Actualizar los datos de un jugador

playerRouter.put("/:id", protegerRuta("admin"), async (req, res) => {
  try {
    const idPlayerFound = await Player.findById(req.params.id);

    if (!idPlayerFound) {
      res.status(404).send({ result: "Id not found" });
    }
    const { nickname } = req.body;
    const existingPlayer = await Player.findOne({ nickname });

    if (existingPlayer) {
      return res
        .status(400)
        .send({ result: "Player with nickname already exists" });
    }
    const updatedPlayer = await Player.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).send({ ok: true, result: updatedPlayer });
  } catch (e) {
    res.status(500).send({ result: "Internal serve error " });
  }
});

//Eliminar jugador

playerRouter.delete("/:id", protegerRuta("admin"), async (req, res) => {
  try {
    const activePlayer = await Team.findOne({
      "roster.player": req.params.id,
      "roster.active": true,
    });

    if (activePlayer) {
      return res
        .status(400)
        .send({ result: "Player is active on a team" });
    }
    const deletedPlayer = await Player.findByIdAndDelete(req.params.id);

    if (!deletedPlayer) {
      res.status(404).send({ result: "Player not found" });
    }
    return res.status(200).send({ ok: true, result: "Player deleted" });
  } catch (e) {
    res.status(500).send({ result: "Internal serve error " });
  }
});

export default playerRouter;
