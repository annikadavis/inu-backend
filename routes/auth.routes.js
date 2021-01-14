const { Router } = require("express");
const {resetPassword, forgotPassword} = require("../controllers/password.controller");
const passwordRouter = Router();



passwordRouter.post("/forgot-password", forgotPassword);

passwordRouter.post("/reset-password", resetPassword);

module.exports = passwordRouter;