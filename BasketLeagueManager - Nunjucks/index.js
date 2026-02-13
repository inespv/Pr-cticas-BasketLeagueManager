import express from "express";
import nunjucks from "nunjucks";
import mongoose from "mongoose";

import { generarToken } from "./auth/auth.js";
import cookieParser from "cookie-parser";
import matchesRouter from "./routes/matches.js";
import playerRouter from "./routes/players.js";
import teamsRouter from "./routes/teams.js";
import authRouter from "./routes/auth.js";
import indexRouter from "./routes/index.js";

import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

mongoose.connect("mongodb://localhost:27017/basketleaguemanager");

//Define el middleware necesario (carga de enrutadores).
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
    const token = req.cookies.token;
    res.locals.isAuthenticated = false;
    if (token) {
        const user = generarToken(token);
        if (user) {
            res.locals.isAuthenticated = true;
            res.locals.user = user;
        }
    }
    next();
});
const env = nunjucks.configure('views', {
    autoescape: true,
    express: app
});

nunjucks.configure('views', {
    autoescape: true,
    express: app
});
app.set('view engine', 'njk');

app.use(express.static(join(__dirname, 'node_modules/bootstrap/dist')));
app.use('/public', express.static(__dirname + '/public'));

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/players", playerRouter);
app.use("/teams", teamsRouter);
app.use("/matches", matchesRouter);

app.listen(8080, () => {
    console.log("escuchando en el 8080");
});