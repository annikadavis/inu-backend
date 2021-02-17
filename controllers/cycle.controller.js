const { PrismaClient } = require("@prisma/client");
const client = new PrismaClient();

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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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
    console.log(user_id);
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
            updatedAt: new Date().toISOString(),
          },
        },
      },
      include: { cycle: true },
    });
    res.status(200).json({ cycle: updatedCycle.cycle, id: updatedCycle.id });
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

    //console.log(userCycle);
    res.status(200).json({ id: userCycle.id, cycle: userCycle.cycle });
  } catch (err) {
    next(err);
  }
};
