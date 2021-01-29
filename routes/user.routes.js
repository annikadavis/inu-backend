const router = require("express").Router();
const { createUser, getAllUsers } = require("../controllers/user.controller");

router.post("/create", createUser);
router.get("/", getAllUsers);

module.exports = router;
