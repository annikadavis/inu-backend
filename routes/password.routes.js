const { Router } = require("express");
const {resetPassword, forgotPassword} = require("../controllers/password.controller");
const passwordRouter = Router();



passwordRouter.post("/user/forgot-password", forgotPassword);

passwordRouter.post("/user/reset-password", resetPassword);

module.exports = passwordRouter;