const router = require("express").Router()
const {
  deletePhase,
  getOnePhase,
  getAllPhase,
  updatePhase,
  createPhase,
  createSuggestion,
  getAllSuggestions,
  getOneSuggestion,
  getRandomSuggestion,
  updateSuggestion,
  deleteSuggestion,
} = require("../controllers/phases.controller");

router.post("/", createPhase );
router.put("/:phaseId", updatePhase);
router.get("/", getAllPhase);
router.get("/:phaseId", getOnePhase);
router.delete("/:phaseId", deletePhase);

router.post("/:phaseId/suggestions", createSuggestion );
router.get("/:phaseId/suggestions", getAllSuggestions );
router.get("/:phaseId/suggestions/:suggestionId", getOneSuggestion);
router.get("/:phaseId/suggestions/random", getRandomSuggestion);
router.put("/:phaseId/suggestions/:suggestionId", updateSuggestion);
router.delete("/:phaseId/suggestions/:suggestionId", deleteSuggestion);


module.exports = router