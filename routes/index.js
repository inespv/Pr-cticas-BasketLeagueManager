import express from "express";

const indexRouter = express.Router();

indexRouter.get("/", async (req, res) => {
    res.redirect('../public/index.html');
});

export default indexRouter;