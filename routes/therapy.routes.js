const router = require("express").Router();
const {
  createTherapy,
  updateTherapy,
  getAllTherapies,
  deleteTherapy,
} = require("../controllers/therapy.controller");

router.post("/", createTherapy);
router.put("/:therapyId", updateTherapy);
router.get("/", getAllTherapies);
router.delete("/:therapyId", deleteTherapy);

module.exports = router
