const router = require("express").Router();
const userRouter = require("./user.routes");
const passwordRouter = require("./password.routes");

const phaseRouter = require("./phases.routes");




router.use("/phases", phaseRouter);
router.use("/user", userRouter);
router.use("/password", passwordRouter);

module.exports = router;
