const router = require("express").Router()
const {
  // addPhase,
  // deletePhase,
  // getOnePhase,
  getAllPhase,
  // updatePhase,
  createPhase
} = require("../controllers/phases.controller");

router.post("/", createPhase );
// router.put("/:phaseid", updatePhase);
router.get("/", getAllPhase);
// router.get("/:phaseid", getOnePhase);
// router.delete("/:phaseid", deletePhase);



module.exports = router