const router = require("express").Router();
const {
    createCycle,
    updateCycle,
    getCycle,
} = require("../controllers/cycle.controller");

router.post("/", createCycle);
router.put("/", updateCycle);
router.get("/", getCycle);

module.exports = router