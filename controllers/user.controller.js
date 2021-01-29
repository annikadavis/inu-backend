const validator = require("validator");
const db = require("../config/db");
const bcrypt = require("bcrypt");

const createUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  const foundUser = await db.users.findUnique({ where: { email } });

  if (foundUser) {
    const error = new Error(
      `User with email address: ${email} already exists. We are redirecting you to login`
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
    res.status(200).json(newUser);
  } catch (error) {
    next(error);
    return;
  }
};

module.exports = { createUser };
