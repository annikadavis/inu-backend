require("dotenv").config();

const mail = require("@sendgrid/mail");
// we set the API KEY here.
// it's a free account from https://www.sendgrid.com/
// it can only send 100 emails per day.
mail.setApiKey(process.env.SENDGRID_API_KEY);

const { nanoid } = require("nanoid"); // generates random unique strings

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const PORT = process.env.PORT;

async function startServer() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST, // address of the server
    user: process.env.DB_USER, // username
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const app = express();
  // Automatically parses the body and makes it into a javascript object, if JSON.
  app.use(express.json());
  app.use(cors());
  // welcome message
  app.get("/", (req, res) => {
    res.json({ message: "Welcome to the Inu Health API" });
  });

  app.post("/user/login", async (req, res) => {
    // STEP 1, get email and password the user gives us from the body
    const { email, password } = req.body;
    console.log("DOES IT WORK:: email", email);

    if (!email || !password) {
      res
        .status(400)
        .json({ error: "One of the required information is missing" });
      return;
    }

    // STEP 2, get a user with that combinations from database
    // Write fields one by one so that we don't send back the password
    // or any other unneeded information
    const [results] = await db.execute(`
    SELECT id, name, email, reg_date FROM users 
    WHERE email='${email}' AND password='${password}'`); // this is equal to doing:
    // const databaseResult = await db.execute(`
    // SELECT id, name, email, reg_date FROM users
    // WHERE email='${email}' AND password='${password}'`);
    // const response = databaseResult[0];
    // BUT instead of doing it in two lines, I use array destructuring to name it quicker.
    // the reason that I am taking the first element of the array is:
    // database connection returns an array, consisting of two things:
    // first element is an array of data found. so if there are two users found, there would be:
    // [{
    //   email: "whatever"
    // },
    // {
    //   email: "another one"
    // }]
    // (NOTE: Understand that this is impossible at this code because email HAS TO BE unique.
    // Database will give you an error otherwise. If you searched for similar names, this would have multiple users for example.)
    // Second element in the results array is information on fields you requested. fields as in: `select field1, field2, field3 from tablename;`
    // so it gives you meta info on the column. This one is not so important for a beginner, so you can ignore it.

    // then we look for the first element in the returned results because the email is unique,
    // so there can't be more than one user anyways.
    const foundUser = results[0]; // the reason we do this is because even an empty array is always true!

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
  });

  app.post("/user/create", async (req, res) => {
    const { name, email, password } = req.body;
    const validator = require("validator");

    if (!name || !email || !password) {
      res
        .status(400)
        .json({ error: "One of the required information is missing" });
      return;
    } else if (!validator.isEmail(email)) {
      res.status(400).json({ error: "Please Enter correct email address" });
    }

    const [results] = await db.execute(
      `select * from users where email='${email}'`
    );
    const foundUser = results[0];
    console.log(foundUser);
    if (foundUser) {
      res.status(409).json({
        error: `User with email address: ${email} already exists.We are redirecting you to login`,
      });
      return;
    }

    try {
      await db.execute(`
      INSERT INTO users(
        
        
      name, email, password) 
      VALUES('${name}','${email}', '${password}')`);
    } catch (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ message: "Created user" });
  });

  app.post("/user/forgot-password", async (req, res) => {
    // STEP 1. Get the email that needs the password reset.
    const { email } = req.body;
    const { name } = req.body;
    const validator = require("validator");
    // STEP 2. required info check
    if (!email || !name) {
      res
        .status(400)
        .json({ error: "One of the required information is missing" });
      return;
    }
    if (!validator.isEmail(email)) {
      res.status(400).json({ error: "Please Enter correct email address" });
      return;
    }

    // STEP 3. Check if email exists in db.
    const [results] = await db.execute(
      `select * from users where email='${email}'`
    );
    const foundUser = results[0];

    // STEP 4. if email exists in db, send a password reset link.
    if (foundUser) {
      // nanoid npm package generates random ids that are not easily guessable. https://www.npmjs.com/package/nanoid
      const resetToken = nanoid();
      try {
        // STEP 4.A - DELETE THE EXISTING REQUEST! So that we can send a new one.
        await db.execute(`DELETE FROM password_reset where email=?`, [email]);

        // STEP 4.B insert token and related email into the new table to keep track.
        await db.execute(`
        INSERT INTO password_reset(email, reset_token) 
        VALUES('${email}', '${resetToken}')`);

        // STEP 4.C create a link for users to click on to reset their password.
        const frontEndURL = process.env.FRONT_END_URL; // I put localhost:3000 because thats the default address for a react app.
        const resetLink = `${frontEndURL}/user/reset-password?token=${resetToken}`;
        //  This link should go to a front-end which has a form,
        // and it should send the reset token along with the new password to /user/reset-password as seen below on line 179.
        //
        // NOTE: when you are on browser (front-end) you can get the query param using this:
        // const urlParams = new URLSearchParams(window.location.search);
        // const resetToken = urlParams.get('token');

        // STEP 4.D prepare email
        const message = {
          to: email, // where to send
          from: "automailsenderrobot@gmail.com", // this is a new email I created, not something magic. I just named it like this.
          subject: "password reset link for INU HEALTH",
          html: `<p>Your password reset link: <a href="${resetLink}">${resetLink}</a> </p>`,
        };

        // STEP 4.E  send email using sendgrid.
        await mail.send(message);
      } catch (error) {
        res.status(500).json({ error: error.message });
        return;
      }
    }

    // STEP 5. Send a vague message back instead of saying invalid email
    // because we don't want hackers to know which emails are available in our database
    res.status(200).json({
      message:
        "We have sent an email with the forgot password link if we found a user with that email!",
    });
  });

  app.post("/user/reset-password", async (req, res) => {
    // STEP 1, get reset token and new password the user gives us from the body
    const { newPassword, resetToken, repeatPassword } = req.body;

    if (!resetToken || !newPassword || !repeatPassword) {
      console.log(resetToken, newPassword, repeatPassword);

      res
        .status(400)
        .json({ error: "One of the required information is missing" });
      return;
    }

    if (newPassword != repeatPassword) {
      res.status(400).json({ error: "Passwords dont match" });
      return;
    }

    // STEP 2, get the password reset request from db
    const [results] = await db.execute(`
    SELECT * FROM password_reset 
    WHERE reset_token='${resetToken}'`);

    const foundPasswordReset = results[0];

    // STEP 3, if password reset request DOES NOT exist, send error
    if (!foundPasswordReset) {
      res.status(401).json({
        error: "invalid password reset token",
      });
      return;
    }

    // if it didn't return above, it means it exists.
    // the reason is: there is a return in that if statement so it would never come here.
    // STEP 4, if password reset request exists, update found user
    await db.execute(`UPDATE users
    SET password='${newPassword}'
    WHERE email='${foundPasswordReset.email}'`);

    // STEP 5, Clean up so they can reset their password again later.
    await db.execute(
      `DELETE FROM password_reset where email='${foundPasswordReset.email}'`
    );

    return res.json({ message: "your password has been reset" });
  });

  // Migrations allow for you to define sets of schema changes so upgrading a database is a breeze.
  // Schema here refers to database Schema.
  // Upgrading a database can mean anything ranging from changing a column
  // or adding a new column or adding a new table.
  // The point is that database can change,
  // and for everyone to have the same changes on their computers
  // (remember you are cooperating with others), you have to make database changes that you did
  // happen automatically on all computers.
  // For further information: http://knexjs.org/#Migrations

  // The record (which one was run, which one was not run) for these migrations are kept in the database.
  // Table names used by default to keep record are knex_migrations and knex_migrations_lock.
  (async () => {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users(
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(30) NOT NULL,
        email VARCHAR(100) NOT NULL,
        password VARCHAR(100) NOT NULL,
        reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT email_unique UNIQUE (email)
      );
    `);

    // NEW table for keeping track of the password reset requests
    await db.execute(`
    CREATE TABLE IF NOT EXISTS password_reset(
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(100) NOT NULL,
      reset_token VARCHAR(100) NOT NULL,
      CONSTRAINT email_unique UNIQUE (email)
    );
  `);

    // runs migrations down (undoes the change as specified in the migration)
    // THIS MEANS ALL DATA GETS DELETED EVERY TIME THE APP RESTARTS!!!!
    // await db.migrate.down(); // DISABLE THIS LINE TO AVOID DELETION OF DATA

    // Runs migrations up (do the change as specified in the migration)
    // await db.migrate.latest();
  })();

  app.listen(PORT, () => {
    console.log(`serving on http://localhost:${PORT}`);
  });
}

startServer(); // The reason why we had to put the whole server creation into a function and execute that function is:
// because of this line:

// const db = await mysql.createConnection({
//   host: process.env.DB_HOST, // address of the server
//   user: process.env.DB_USER, // username
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// the new mysql createConnection HAS TO BE AWAITED. for it to finish. But we cannot await in the very top level.
// because you can ONLY AWAIT in async functions.
// so, we make an async function and put everything in it, and it works.
