const { PrismaClient } = require("@prisma/client");
const client = new PrismaClient();


exports.createPhase = async (req, res, next) => {
  try {
    const name = req.body.name;
    const createdPhase = await client.phases.create({
      data: { name: name, updatedAt: new Date().toISOString() },
    });
    res.status(200).json(createdPhase);
  } catch (err) {
    next(err);
  }
};

exports.getAllPhase = async (req, res, next) => {
  try {
    const allPhases = await client.phases.findMany();
    res.status(200).json(allPhases);
  } catch (err) {
    next(err);
  }
};
