import express from "express";
import { generarToken } from "../auth/auth.js";
import {User} from "../models/users.js";
const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
  try {
    if (req.body.login && req.body.password) {
      const user = await User.findOne({ login: req.body.login, password: req.body.password });

      if (user && user.password === req.body.password) {
        return res.status(200).send({ error: null, resul: { token: generarToken(user) } });
      }
    }
    return res.status(401).send({ result: "", error: "Login incorrecto" });
  } catch (e) {
    res.status(500).send({ result: "Internal serve error " });
  }
});

export default authRouter;
