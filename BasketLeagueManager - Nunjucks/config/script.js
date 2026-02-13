// BasketLeagueManager (ESM + Mongoose) correction: UTF-8 Fixed
import { mongoose } from "mongoose";
import { Player } from "../models/player.js";
import { Team } from "../models/team.js";
import { Tournament } from "../models/tournament.js";
import { Match } from "../models/match.js";
import { User } from "../models/users.js";

const MONGO_URI = "mongodb://localhost:27017/basketleaguemanager";

async function main() {
  await mongoose.connect(MONGO_URI);

  // Limpieza
  await Promise.all([Match.deleteMany({}), Tournament.deleteMany({}), Team.deleteMany({}), Player.deleteMany({}), User.deleteMany({})]);

  // =================
  // USERS
  // =================
  const usersData = [
    { login: "Inesu", password: "1234567", rol: "admin" },
    { login: "Hien", password: "2244661", rol: "manager" },
    { login: "AlicanteCity1", password: "4L1C4NT3", rol: "user" },
    { login: "Kaii37", password: "2233116", rol: "admin" },
  ];

  await User.insertMany(usersData);

  // =================
  // PLAYERS
  // =================
  const playersData = [
    { nickname: "sllull", name: "Sergio Llull", country: "ES", birthDate: new Date("1987-11-15"), role: "base" },
    { nickname: "wtavares", name: "Walter Tavares", country: "CV", birthDate: new Date("1992-03-22"), role: "pivot" },
    { nickname: "rfern", name: "Rudy Fernández", country: "ES", birthDate: new Date("1985-04-04"), role: "escolta" },
    { nickname: "aabrines", name: "Álex Abrines", country: "ES", birthDate: new Date("1993-08-01"), role: "escolta" },
    { nickname: "nlapro", name: "Nicolás Laprovíttola", country: "AR", birthDate: new Date("1990-01-31"), role: "base" },
    { nickname: "jvesely", name: "Jan Veselý", country: "CZ", birthDate: new Date("1990-04-24"), role: "ala-pivot" },
    { nickname: "mhoward", name: "Markus Howard", country: "US", birthDate: new Date("1999-03-03"), role: "escolta" },
    { nickname: "tsedek", name: "Tadas Sedekerskis", country: "LT", birthDate: new Date("1998-01-17"), role: "alero" },
    { nickname: "adiaz", name: "Alberto Díaz", country: "ES", birthDate: new Date("1994-04-23"), role: "base" },
    { nickname: "kperry", name: "Kendrick Perry", country: "ME", birthDate: new Date("1992-12-23"), role: "base" },
    { nickname: "bdublj", name: "Bojan Dubljević", country: "ME", birthDate: new Date("1991-10-24"), role: "pivot" },
    { nickname: "vclaver", name: "Víctor Claver", country: "ES", birthDate: new Date("1988-08-30"), role: "alero" },
    { nickname: "mhuertas", name: "Marcelinho Huertas", country: "BR", birthDate: new Date("1983-05-25"), role: "base" },
    { nickname: "gsherma", name: "Giorgi Shermadini", country: "GE", birthDate: new Date("1989-04-02"), role: "pivot" },
    { nickname: "ssalin", name: "Sasu Salin", country: "FI", birthDate: new Date("1991-06-11"), role: "escolta" },
    { nickname: "vspan", name: "Vasileios Spanoulis", country: "GR", birthDate: new Date("1982-08-07"), role: "escolta" },
    { nickname: "sloukas", name: "Kostas Sloukas", country: "GR", birthDate: new Date("1990-01-15"), role: "base" },
    { nickname: "calathes", name: "Nick Calathes", country: "US", birthDate: new Date("1989-02-07"), role: "base" },
    { nickname: "lpapapet", name: "Ioannis Papapetrou", country: "GR", birthDate: new Date("1994-03-30"), role: "alero" },
    { nickname: "vmicic", name: "Vasilije Micić", country: "RS", birthDate: new Date("1994-01-13"), role: "base" },
    { nickname: "lclyburn", name: "Will Clyburn", country: "US", birthDate: new Date("1990-05-17"), role: "alero" },
    { nickname: "mkleiza", name: "Keenan Evans", country: "US", birthDate: new Date("1996-08-23"), role: "escolta" },
    { nickname: "larkin", name: "Shane Larkin", country: "US", birthDate: new Date("1992-10-02"), role: "base" },
    { nickname: "melli", name: "Nicolò Melli", country: "IT", birthDate: new Date("1991-01-26"), role: "ala-pivot" },
    { nickname: "teodosic", name: "Miloš Teodosić", country: "RS", birthDate: new Date("1987-03-19"), role: "base" },
    { nickname: "pantarz", name: "Kevin Punter", country: "US", birthDate: new Date("1993-06-25"), role: "escolta" },
    { nickname: "leday", name: "Zach LeDay", country: "US", birthDate: new Date("1994-05-30"), role: "ala-pivot" },
    { nickname: "nedovic", name: "Nemanja Nedović", country: "RS", birthDate: new Date("1991-06-16"), role: "escolta" },
    { nickname: "campazzo", name: "Facundo Campazzo", country: "AR", birthDate: new Date("1991-03-23"), role: "base" },
    { nickname: "obst", name: "Andreas Obst", country: "DE", birthDate: new Date("1996-07-13"), role: "escolta" },
    { nickname: "theis", name: "Daniel Theis", country: "DE", birthDate: new Date("1992-04-04"), role: "pivot" },
    { nickname: "james", name: "Mike James", country: "US", birthDate: new Date("1990-08-18"), role: "escolta" },
    { nickname: "okobo", name: "Élie Okobo", country: "FR", birthDate: new Date("1997-10-23"), role: "base" },
    { nickname: "uptas", name: "Edgaras Ulanovas", country: "LT", birthDate: new Date("1992-07-07"), role: "alero" },
    { nickname: "motiej", name: "Donatas Motiejūnas", country: "LT", birthDate: new Date("1990-09-20"), role: "pivot" },
    { nickname: "baldwin", name: "Wade Baldwin IV", country: "US", birthDate: new Date("1996-03-29"), role: "escolta" },
    { nickname: "lorenzo", name: "Lorenzo Brown", country: "US", birthDate: new Date("1990-08-26"), role: "base" },
  ];

  const players = await Player.insertMany(playersData);
  const P = Object.fromEntries(players.map((pl) => [pl.nickname, pl]));

  // =============
  // TEAMS
  // =============
  const teamsData = [
    { name: "Real Madrid", foundedAt: new Date("1931-03-22") },
    { name: "FC Barcelona", foundedAt: new Date("1926-06-24") },
    { name: "Baskonia", foundedAt: new Date("1959-01-01") },
    { name: "Unicaja", foundedAt: new Date("1977-01-01") },
    { name: "Valencia Basket", foundedAt: new Date("1986-09-27") },
    { name: "Lenovo Tenerife", foundedAt: new Date("1939-01-01") },
    { name: "Olympiacos", foundedAt: new Date("1931-01-01") },
    { name: "Panathinaikos", foundedAt: new Date("1919-01-01") },
    { name: "Fenerbahçe", foundedAt: new Date("1913-01-01") },
    { name: "Anadolu Efes", foundedAt: new Date("1976-01-01") },
    { name: "Maccabi Tel Aviv", foundedAt: new Date("1932-01-01") },
    { name: "Virtus Bologna", foundedAt: new Date("1929-01-01") },
    { name: "Partizan Belgrade", foundedAt: new Date("1945-01-01") },
    { name: "Crvena zvezda", foundedAt: new Date("1945-01-01") },
    { name: "ALBA Berlin", foundedAt: new Date("1989-01-01") },
    { name: "Bayern Munich", foundedAt: new Date("1946-01-01") },
    { name: "AS Monaco", foundedAt: new Date("1928-01-01") },
    { name: "Žalgiris Kaunas", foundedAt: new Date("1944-01-01") },
  ];

  const teams = await Team.insertMany(teamsData);
  const T = Object.fromEntries(teams.map((t) => [t.name, t]));

  // Roster mínimo
  const join = new Date("2023-09-01");
  const rosterUpdates = [
    ["Real Madrid", ["sllull", "wtavares", "rfern"]],
    ["FC Barcelona", ["aabrines", "nlapro", "jvesely"]],
    ["Baskonia", ["mhoward", "tsedek"]],
    ["Unicaja", ["adiaz", "kperry"]],
    ["Valencia Basket", ["bdublj", "vclaver"]],
    ["Lenovo Tenerife", ["mhuertas", "gsherma", "ssalin"]],
    ["Olympiacos", ["vspan", "sloukas"]],
    ["Panathinaikos", ["calathes", "lpapapet"]],
    ["Anadolu Efes", ["larkin", "lclyburn"]],
    ["Fenerbahçe", ["vmicic", "melli"]],
    ["Maccabi Tel Aviv", ["baldwin", "lorenzo"]],
    ["Virtus Bologna", ["teodosic", "melli"]],
    ["Partizan Belgrade", ["pantarz", "leday"]],
    ["Crvena zvezda", ["nedovic", "teodosic"]],
    ["ALBA Berlin", ["obst", "theis"]],
    ["Bayern Munich", ["theis", "obst"]],
    ["AS Monaco", ["james", "okobo"]],
    ["Žalgiris Kaunas", ["uptas", "motiej"]],
  ];

  await Promise.all(
    rosterUpdates.map(([teamName, nicks]) =>
      Team.updateOne(
        { _id: T[teamName]._id },
        {
          $set: {
            roster: nicks
              .map((nk) => ({
                player: P[nk]?._id,
                joinDate: join,
                active: true,
              }))
              .filter((r) => r.player),
          },
        }
      )
    )
  );

  // =====================
  // TOURNAMENTS
  // =====================
  const tournaments = await Tournament.insertMany([
    {
      title: "Liga ACB",
      year: 2025,
      season: "Autumn",
      organizer: "ACB",
      teams: [T["Real Madrid"]._id, T["FC Barcelona"]._id, T["Baskonia"]._id, T["Unicaja"]._id, T["Valencia Basket"]._id, T["Lenovo Tenerife"]._id],
    },
    {
      title: "EuroLeague",
      year: 2025,
      season: "Autumn",
      organizer: "Euroleague Basketball",
      teams: Object.values(T).map(t => t._id),
    }
  ]);

  console.log("Seed completado con éxito y caracteres corregidos.");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Error en seed:", err?.message);
  process.exit(1);
});