const router = require("express").Router();
const { createUser, getAllUsers } = require("../controllers/user.controller");
//const { createUser } = require("../controllers/user.controller");
const { createUserValidator } = require("../middleware/validator.middleware");

router.post("/create", createUserValidator, createUser);
router.get("/", getAllUsers);

module.exports = router;
