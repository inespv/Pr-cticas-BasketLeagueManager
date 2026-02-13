import express from "express";
import { Player } from "./../models/player.js";
import { Team } from "./../models/team.js";
import { protegerRuta } from '../auth/auth.js';
const teamsRouter = express.Router();

//Listar todos los equipos

teamsRouter.get("/", protegerRuta(), async (req, res) => {
  try {
    const teams = await Team.find();

    if (teams) {
      res.status(200).send({ result: teams });
    } else {
      res.status(404).send({ error: "Teams not found", result: null });
    }
  } catch (e) {
    res.status(500).send({ error: "Internal server error " });
  }
});

// Añadir un equipo

teamsRouter.post("/", protegerRuta("admin"), async (req, res) => {
  try {
    const { name, foundedAt, roster } = req.body;
    if (!name || !foundedAt || !roster) {
      return res
        .status(400)
        .send({ error: " Missing parameter", result: null });
    }
    const existingTeam = await Team.findOne({ name });
    if (existingTeam) {
      return res
        .status(400)
        .send({ error: "Team name already exists", result: null });
    }
    const team = new Team(req.body);
    const savedTeam = team.save();
    if (savedTeam) {
      res.status(201).send({ result: savedTeam });
    }
  } catch (e) {
    res.status(500).send({ result: "Internal server error " });
  }
});

//Añadir un nuevo jugador al roster

teamsRouter.post("/:id/roster", protegerRuta("admin", "manager"), async (req, res) => {
  try {
    const { player, joinDate, active } = req.body;

    if (!player || !joinDate || !active) {
      return res.status(400).send({ result: " Missing parameter" });
    }

    const existingTeam = await Team.findById(req.params.id);
    const existingPlayer = await Player.findById(req.params.id);

    if (!existingTeam) {
      return res.status(404).send({ result: "Team not found" });
    }
    if (!existingPlayer) {
      return res.status(404).send({ result: "Player not found" });
    }

    const playerActiveOnDifferentTeam = await Team.findOne({
      "roster.player": player,
    });
    const playerActiveOnRoster = await Team.findOne({
      "roster.player": player,
      "roster.active": true,
    });

    if (playerActiveOnDifferentTeam) {
      return res
        .status(400)
        .send({ error: "The player is active on a team", result: null });
    }
    if (playerActiveOnRoster) {
      return res.status(400).send({
        error: "The player is active on the roaster's team",
        result: null,
      });
    }
    const activeInThisTeam = existingTeam.roster.find(
      (p) => p.player.toString() === player.toString() && p.active
    );
    if (activeInThisTeam) {
      return res
        .status(400)
        .send({ error: "Player is already active in this team", result: null });
    }
    const team = new Team(req.body);
    team.roster.push({ player, joinDate, active });
    const updatedTeam = await team.save();

    const populatedTeam = await Team.findById(req.params.id).populate(
      "roster.player"
    );

    res.status(200).send({ result: "The player was added succesfully" });
  } catch (e) {
    res.status(500).send({ result: "Internal server error " });
  }
});

//Información de un equipo por ID

teamsRouter.get("/:id", protegerRuta(), async (req, res) => {
  try {
    // const activeTeam = await Team.find({
    //   "roster.Team": req.params.id,
    //   "roster.active": true,
    // });

    const teams = await Team.findById(req.params.id);
    if (teams) {
      res.status(200).send({ result: teams });
    } else {
      res.status(404).send({ result: "Team id not found" });
    }
  } catch (e) {
    res.status(500).send({ result: "Internal server error " });
  }
});

//Dar de baja a un jugador en el roster
teamsRouter.delete("/:id/roster/:playerId", protegerRuta("admin","manager"), async (req, res) => {
  try {
    const existingPlayer = await Player.findById(req.params.playerId);
    if (!existingPlayer) {
      return res.status(404).send({ error: "Player not found", result: null });
    }

    const team = await Team.findById(req.params.id).populate("roster.player");
    if (!team) {
      return res.status(404).send({ error: "Team not found", result: null });
    }

    const activeInThisTeam = team.roster.find((p) => p.player._id.toString() === req.params.playerId && p.active);
    if (!activeInThisTeam) {
      return res.status(404).send({ error: "Player is not active in this team's roster", result: null });
    }

    activeInThisTeam.active = false;

    const updatedTeam = await team.save();

    res.status(200).send({ error: null, result: updatedTeam });
  } catch (err) {
    res.status(500).send(`{error: Internal server error: ${err.message}", result: null }`);
  }
});

// Eliminar un equipo

teamsRouter.delete("/:id", protegerRuta("admin"), async (req, res) => {
  try {
    const deletedteam = await Team.findByIdAndDelete(req.params.id);

    if (deletedteam) {
      res.status(200).send({ result: deletedteam });
    } else {
      res.status(404).send({ error: "team not found" });
    }
  } catch (e) {
    res.status(500).send({ error: "Internal server error" });
  }
});

export default teamsRouter;
