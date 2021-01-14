const router = require("express").Router;
const {
  addPhase,
  deletePhase,
  getOnePhase,
  getAllPhase,
  updatePhase,
} = require("../conrollers/phases.controller");

router.post("/");
router.put("/:phaseid", updatePhase);
router.get("/", getAllPhase);
router.get("/:phaseid", getOnePhase);
router.delete("/:phaseid", deletePhase);
