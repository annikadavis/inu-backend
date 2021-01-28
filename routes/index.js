const router = require("express").Router();
const userRouter = require("./user.routes");
const authRouter = require("./auth.routes");
const phaseRouter = require("./daily_suggestion.routes");
const therapyRouter = require("./therapy.routes");
const cycleRouter  = require("./cycle.routes")
const {fakeauthMiddleare} = require("../middleware/fakeauth.middleware");

router.use("/phases", phaseRouter);
router.use("/therapy", therapyRouter);
router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/cycle",fakeauthMiddleare ,cycleRouter);

module.exports = router;
