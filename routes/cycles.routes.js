const { authMiddleware } = require("../middleware/auth.middleware");
const router = require("express").Router();
const {
  getAllCycles,
  createCycle,
} = require("../controllers/cycles.controller");

router.post("/", authMiddleware, createCycle);
// router.put("/:phaseid", updatePhase);
router.get("/", authMiddleware, getAllCycles);
// router.get("/:phaseid", getOnePhase);
// router.delete("/:phaseid", deletePhase);

module.exports = router;
