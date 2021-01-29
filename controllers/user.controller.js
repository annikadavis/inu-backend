const validator = require("validator");
const db = require("../config/db");
const bcrypt = require("bcrypt");
const { users } = require("../config/db");

const createUser = async (req, res, next) => {
  const { name, email, password, repeatPassword } = req.body;

  if (!name || !email || !password || !repeatPassword) {
    const error = new Error("One of the required information is missing");
    error.status = 400;
    next(error);
    return;
  } else if (!validator.isEmail(email)) {
    const error = new Error("Please Enter correct email address");
    error.status = 400;
    next(error);
    return;
  }
  if (password != repeatPassword) {
    const error = new Error("Passwords don't match!");
    error.status = 400;
    next(error);
    return;
  }

  const foundUser = await db.users.findUnique({ where: { email } });
  console.log("this is found user: ", foundUser);

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
  //res.json({ message: "Created user" });
};

module.exports = { createUser };
