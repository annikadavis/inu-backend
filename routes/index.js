const router = require("express").Router();
const userRouter = require("./user.routes");
const authRouter = require("./auth.routes");
const phaseRouter = require("./phases.routes");

router.use("/phases", phaseRouter);
router.use("/user", userRouter);
router.use("/auth", authRouter);

module.exports = router;
