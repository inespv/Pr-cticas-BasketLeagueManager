import express from "express";
import { User } from "../models/users.js";
import { generarToken, protegerRuta } from "../auth/auth.js";

const authRouter = express.Router();

authRouter.use((req, res, next) => {
    console.log('Request from: ', req.ip, 'to Auth');
    next();
});

authRouter.get('/login', async (req, res) => {
    res.render('login');
});

authRouter.post("/login", async (req, res) => {
    try {
        if (req.body.login && req.body.password) {
            const user = await User.findOne({ login: req.body.login, password: req.body.password })
            if (user && user.password === req.body.password) {
                const token = generarToken(user);
                res.cookie("token", token, {
                    httpOnly: true,
                    sameSite: "lax",
                });
                return res.redirect('/'); // Añadir return aquí
            }
        }
        return res.render('login', { error: "Unauthorized" });
    } catch (e) {
        res.render('error', { error: `Internal server error, ${e.message}` });
    }
});

authRouter.get('/logout', protegerRuta(), (req, res) => {
    // res o req ? 
    res.clearCookie('token');
    res.redirect('/auth/login');
});

export default authRouter;