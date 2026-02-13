import express from "express";
import { Player } from "../models/player.js";
import { Team } from "../models/team.js";
import { protegerRuta } from '../auth/auth.js';
import moment from "moment";

const playerRouter = express.Router();

// Listar todos los jugadores

playerRouter.get("/", protegerRuta(), async (req, res) => {
  try {
    const players = await Player.find();
    res.render('players_list', { players: players });
  } catch (e) {
    res.render('error', { error: e.message });
  }
});

//Búsqueda por name

playerRouter.get("/find", protegerRuta(), async (req, res) => {
  try {
    if (!req.query.name) {
      return res.render('error', { error: 'error' })
    }
    const players = await Player.find({
      name: { $regex: req.query.name, $options: "i" },
    });
    if (!players) {
      return res.render('error', { error: 'error' })
    }
    return res.render('players_list', { players: players });
  } catch (err) {
    return res.render('error', { error: err.message })
  }
});
playerRouter.put("/:id", protegerRuta("admin"), async (req, res) => {
  try {
    const idPlayerFound = await Player.findById(req.params.id);
    if (!idPlayerFound) {
      res.render('error')
    }
    const { nickname } = req.body;
    const existingPlayer = await Player.findOne({ nickname });
  } catch (e) {
    res.render('error', { error: e.message })
  }
});
//Añadir un jugador
playerRouter.get('/new', protegerRuta("admin"), async (req, res) => {
  res.render('player_add');
});

playerRouter.post("/", protegerRuta("admin"), async (req, res) => {
  try {
    const { name, nickname, country, birthDate, role } = req.body;

    if (!name || !nickname || !country || !role || !birthDate) {
      return res.render('error', { error: 'error' })
    }
    const existingPlayer = await Player.findOne({ nickname });

    if (existingPlayer) {
      return res.render('error', { error: 'error' })
    }
    const player = new Player(req.body);
    const savedPlayer = player.save();

    if (savedPlayer) {
      res.status(201).send({ ok: true, result: savedPlayer });
    }
  } catch (e) {
    res.render('error', { error: e.message })
  }
});

// Información de un jugador by ID (Ficha de detalles)
playerRouter.get("/:id", protegerRuta(), async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);

    if (player) {

      res.render('player_detail', { player: player });
    } else {
      res.render('error', { error: 'Jugador no encontrado en la base de datos' });
    }
  } catch (e) {
    res.render('error', { error: 'ID de jugador no válido' });
  }
});

// Ruta para MOSTRAR el formulario de edición
playerRouter.get("/:id/edit", protegerRuta("admin"), async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.render('error', { error: 'Jugador no encontrado' });

    // Renderiza tu vista de formulario (ej: player_form.njk)
    res.render('player_edit', { player: player });
  } catch (e) {
    res.render('error', { error: e.message });
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
      return res.render('error', { error: 'error' })
    }
    const deletedPlayer = await Player.findByIdAndDelete(req.params.id);

    if (!deletedPlayer) {
      res.render('error', { error: 'error' })
    }
    return res.status(200).send({ ok: true, result: "Player deleted" });
  } catch (e) {
    res.render('error', { error: e.message })
  }
});

export default playerRouter;
