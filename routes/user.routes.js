const userRouter = require("express").Router();
const { loginUser, createUser } = require("../controllers/user.controller");


userRouter.post("/login", loginUser);

userRouter.post("/register", createUser);

module.exports = userRouter;
