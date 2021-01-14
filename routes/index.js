const router = require("express").Router();
const phaseRouter = require("./phases.routes");
const userRouter = require("./routes/user.routes");
const passwordRouter = require("./routes/password.routes");

router.use("/phases", phaseRouter);
router.use("/user", userRouter);
router.use("/password", passwordRouter);

module.exports = mainRouter;
