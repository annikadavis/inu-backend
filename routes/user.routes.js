const { Router } = require("express");
const { loginUser, createUser } = require("../controllers/user.controller");

const userRouter = Router();

userRouter.post("/login", loginUser);

userRouter.post("/create", createUser);

module.exports = userRouter;
