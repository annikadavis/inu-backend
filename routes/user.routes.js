const { Router } = require("express");
const { loginUser, createUser } = require("../controllers/user.controller");

const userRouter = Router();

userRouter.post("/user/login", loginUser);

userRouter.post("/user/create", createUser);

module.exports = userRouter;
