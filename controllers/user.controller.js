const validator = require("validator");
const db = require("../config/db");
const bcrypt = require("bcrypt");

const createUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  const foundUser = await db.users.findUnique({ where: { email } });

  if (foundUser) {
    const error = new Error(
      `User with this email address ${email} already exists.`
    );
    error.status = 409;
    next(error);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const newUser = await db.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // the cycle is created with the user and changed after the user enters data
    const newCycle = await db.cycle.create({
      data: {
        cycle_length: 28,
        period_length: 5,
        last_period: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: { connect: { id: newUser.id } },
      },
    });
    res
      .status(200)
      .json({ newCycle, user: newUser.id, message: "Created user" });
  } catch (error) {
    next(error);
    return;
  }

  //res.json({ message: "Created user" });
};

const getAllUsers = async (req, res, next) => {
  const allUsers = await db.users.findMany();
  res.status(200).json(allUsers);
};

module.exports = { createUser, getAllUsers };
