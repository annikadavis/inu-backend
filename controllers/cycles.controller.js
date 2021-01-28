const { PrismaClient } = require("@prisma/client");
const client = new PrismaClient();

exports.createCycle = async (req, res, next) => {
  // id            Int      @id @default(autoincrement())
  // cycle_length  Int
  // period_length Int
  // createdAt     DateTime @default(now())
  // updatedAt     DateTime
  // user_id       Int
  // user          Users    @relation(fields: [user_id], references: [id])

  try {
    const { cycleLength, periodLength } = req.body;
    console.log(req.userId);
    const createdCycle = await client.cycle.create({
      data: {
        cycle_length: cycleLength,
        period_length: periodLength,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: { connect: { id: req.userId } },
      },
    });
    res.status(200).json(createdCycle);
  } catch (err) {
    next(err);
  }
};

exports.getAllCycles = async (req, res, next) => {
  try {
    const allCycles = await client.cycle.findMany({
      where: { user: { id: req.userId } },
    });
    res.status(200).json(allCycles);
  } catch (err) {
    next(err);
  }
};
