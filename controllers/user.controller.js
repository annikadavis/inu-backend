const validator = require("validator");
const db = require("../config/db");

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
    const error = new Error("Passwords dont match!");
    error.status = 400;
    next(error);
    return;
  }

  const [foundUser] = await db.$queryRaw(
    `select * from users where email= ?`,
    email
  );

  if (foundUser) {
    const error = new Error(
      `User with email address: ${email} already exists. We are redirecting you to login`
    );
    error.status = 409;
    next(error);

    return;
  }

  try {
    await db.$queryRaw(`
      INSERT INTO users(name, email, password) 
      VALUES('${name}','${email}', '${password}')`);
  } catch (error) {
    next(error);
    return;
  }

  res.json({ message: "Created user" });
};

const loginUser = async (req, res, next) => {
  // STEP 1, get email and password the user gives us from the body
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("One of the required information is missing");
    error.status = 400;
    next(error);
    return;
  }

  // STEP 2, get a user with that combinations from database
  // Write fields one by one so that we don't send back the password
  // or any other unneeded information
  const [foundUser] = await db.$queryRaw(`
    SELECT id, name, email, created_date FROM users 
    WHERE email='${email}' AND password='${password}'`); // this is equal to doing:

  // STEP 3, if user DOES NOT exist, send error
  if (!foundUser) {
    const error = new Error("No such user with the provided email and password combination in database",);
    error.status = 401;
    next(error);
    return;
  }

  // STEP 4, if user exists, send found user
  return res.json(foundUser);
};

module.exports = { createUser, loginUser };
