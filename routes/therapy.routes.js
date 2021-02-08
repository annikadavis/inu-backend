const router = require("express").Router();
const { uploadFile } = require("../middleware/upload.middleware");
const {
  createTherapy,
  updateTherapy,
  getAllTherapies,
  deleteTherapy,
} = require("../controllers/therapy.controller");

router.post("/", uploadFile, createTherapy);
router.put("/:therapyId", uploadFile, updateTherapy);
router.get("/", getAllTherapies);
router.delete("/:therapyId", deleteTherapy);

module.exports = router;
