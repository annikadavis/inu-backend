const { authMiddleware } = require("../middleware/auth.middleware");
const router = require("express").Router();
const {
  // addPhase,
  // deletePhase,
  // getOnePhase,
  getAllPhase,
  // updatePhase,
  createPhase,
} = require("../controllers/phases.controller");

router.post("/", createPhase);
// router.put("/:phaseid", updatePhase);
router.get("/", authMiddleware, getAllPhase);
// router.get("/:phaseid", getOnePhase);
// router.delete("/:phaseid", deletePhase);

module.exports = router;
