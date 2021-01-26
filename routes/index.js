const router = require("express").Router();
const userRouter = require("./user.routes");
const authRouter = require("./auth.routes");
const phaseRouter = require("./phases.routes");
const cyclesRouter = require("./cycles.routes");

router.use("/phases", phaseRouter);
router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/cycles", cyclesRouter);

module.exports = router;
