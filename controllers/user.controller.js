const validator = require("validator");
const db = require("../config/db");

const createUser = async (req, res) => {
  const { name, email, password, repeatPassword } = req.body;
  if (!name || !email || !password || !repeatPassword) {
    res
      .status(400)
      .json({ error: "One of the required information is missing" });
    return;
  } else if (!validator.isEmail(email)) {
    res.status(400).json({ error: "Please Enter correct email address" });
    return;
  }
  if (password != repeatPassword) {
    res.status(400).json({ error: "Passwords dont match!" });
    return;
  }

  console.log(email);
  const [foundUser] = await db.$queryRaw(
    `select * from users where email= ?`,
    email
  );
  console.log(foundUser);
  if (foundUser) {
    res.status(409).json({
      error: `User with email address: ${email} already exists. We are redirecting you to login`,
    });
    return;
  }

  try {
    await db.$queryRaw(`
      INSERT INTO users(
        
        
      name, email, password) 
      VALUES('${name}','${email}', '${password}')`);
  } catch (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json({ message: "Created user" });
};

const loginUser = async (req, res) => {
  // STEP 1, get email and password the user gives us from the body
  const { email, password } = req.body;

  if (!email || !password) {
    res
      .status(400)
      .json({ error: "One of the required information is missing" });
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
    res.status(401).json({
      error:
        "No such user with the provided email and password combination in database",
    });
    return;
  }

  // STEP 4, if user exists, send found user
  return res.json(foundUser);
};

module.exports = { createUser, loginUser };
