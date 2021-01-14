const router = require("express").Router();
const { loginUser, createUser } = require("../controllers/user.controller.js");

router.post("/login", loginUser);

router.post("/create", createUser);

module.exports = router;
