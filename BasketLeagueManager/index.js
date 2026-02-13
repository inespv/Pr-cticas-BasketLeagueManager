import express from "express";
import mongoose from "mongoose";

import matchesRouter from "./routes/matches.js";
import playerRouter from "./routes/players.js";
import teamsRouter from "./routes/teams.js";
import authRouter from "./routes/auth.js";

mongoose.connect("mongodb://localhost:27017/basketleaguemanager");

//Define el middleware necesario (carga de enrutadores).
const app = express();

app.use(express.json());
app.use("/players", playerRouter);
app.use("/teams", teamsRouter);
app.use("/matches", matchesRouter);
app.use("/auth", authRouter);

app.listen(8080);