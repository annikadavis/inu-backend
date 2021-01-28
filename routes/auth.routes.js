const router = require("express").Router();
const {
  forgotPassword,
  resetPassword,
  loginUser,
} = require("../controllers/auth.controller");

router.post("/reset-password", resetPassword);
router.post("/forgot-password", forgotPassword);
router.post("/login", loginUser);

module.exports = router;
