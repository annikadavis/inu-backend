const { PrismaClient } = require("@prisma/client");
const client = new PrismaClient();

// router.post("/userId", createCycle);
// router.put("/:userId", updateCycle);
// router.get("/userId", getCycle);

// id            Int      @id @default(autoincrement())
//   user_id       Int
//   cycle_length  Int
//   period_length Int?
//   last_period   DateTime

exports.createCycle = async (req, res, next) => {
  try {
    const { cycle_length, period_length, last_period } = req.body;
    const user_id = req.userId;
    console.log(user_id);

    const newCycle = await client.cycle.create({
      // user_id: user_id,
      data: {
        cycle_length: cycle_length,
        period_length: period_length,
        last_period: last_period,
        user: { connect: { id: user_id } },
      },
    });
    console.log(newCycle);
    res.status(200).json(newCycle);
  } catch (err) {
    next(err);
  }
};
exports.updateCycle = async (req, res, next) => {
  try {
    const { cycle_length, period_length, last_period } = req.body;
    const user_id = req.userId;
    //const user_id = Number(req.params.userId);
    const updatedCycle = await client.users.update({
      // user_id: user_id,
      where: { id: user_id },
      data: {
        cycle: {
          update: {
            cycle_length: cycle_length,
            period_length: period_length,
            last_period: last_period,
          },
        },
      },
      include: { cycle: true },
    });
    res.status(200).json(updatedCycle);
  } catch (err) {
    next(err);
  }
};
exports.getCycle = async (req, res, next) => {
  try {
    const user_id = req.userId;
    const userCycle = await client.users.findUnique({
      where: { id: user_id },
      include: { cycle: true },
    });
    res.status(200).json(userCycle);
  } catch (err) {
    next(err);
  }
};
