const router = require("express").Router();
const { createUser } = require("../controllers/user.controller");
const { createUserValidator } = require("../middleware/validator.middleware");

router.post("/create", createUserValidator, createUser);

module.exports = router;
