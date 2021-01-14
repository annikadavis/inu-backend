const { nanoid } = require("nanoid"); // generates random unique strings
const validator = require("validator");

const mail = require("@sendgrid/mail");
const db = require("../config/db");

// we set the API KEY here.
// it's a free account from https://www.sendgrid.com/
// it can only send 100 emails per day.
mail.setApiKey(process.env.SENDGRID_API_KEY);

const resetPassword = async (req, res, next) => {
  // STEP 1, get reset token and new password the user gives us from the body
  const { newPassword, resetToken, repeatPassword } = req.body;

  if (!resetToken || !newPassword || !repeatPassword) {
    const error = new Error("One of the required information is missing");
    error.status = 400;
    next(error);
    return;
  }

  if (newPassword != repeatPassword) {
    const error = new Error("Passwords dont match");
    error.status = 400;
    next(error);
    return;
  }

  // STEP 2, get the password reset request from db
  const [foundPasswordReset] = await db.$queryRaw(`
    SELECT * FROM password_reset 
    WHERE reset_token='${resetToken}'`);

  // STEP 3, if password reset request DOES NOT exist, send error
  if (!foundPasswordReset) {
    const error = new Error("invalid password reset token");
    error.status = 401;
    next(error);
    return;
  }

  // if it didn't return above, it means it exists.
  // the reason is: there is a return in that if statement so it would never come here.
  // STEP 4, if password reset request exists, update found user
  await db.$queryRaw(
    `UPDATE users
    SET password = ?
    WHERE email = ?`,
    newPassword,
    foundPasswordReset.email
  );

  // STEP 5, Clean up so they can reset their password again later.
  await db.$queryRaw(
    `DELETE FROM password_reset where email='${foundPasswordReset.email}'`
  );

  res.json({ message: "your password has been reset" });
};

const forgotPassword = async (req, res, next) => {
  // STEP 1. Get the email that needs the password reset.
  const { email } = req.body;
  const { name } = req.body;
  // STEP 2. required info check
  if (!email || !name) {
    const error = new Error("One of the required information is missing");
    error.status = 400;
    next(error);
    return;
  }
  if (!validator.isEmail(email)) {
    const error = new Error("Please Enter correct email address");
    error.status = 400;
    next(error);
    return;
  }

  // STEP 3. Check if email exists in db.
  const [foundUser] = await db.$queryRaw(
    `select * from users where email='${email}'`
  );

  // STEP 4. if email exists in db, send a password reset link.
  if (foundUser) {
    // nanoid npm package generates random ids that are not easily guessable. https://www.npmjs.com/package/nanoid
    const resetToken = nanoid();
    try {
      // STEP 4.A - DELETE THE EXISTING REQUEST! So that we can send a new one.
      await db.$queryRaw(`DELETE FROM password_reset where email = ?`, email);

      // STEP 4.B insert token and related email into the new table to keep track.
      await db.$queryRaw(`
        INSERT INTO password_reset(email, reset_token) 
        VALUES('${email}', '${resetToken}')`);

      // STEP 4.C create a link for users to click on to reset their password.
      const frontEndURL = process.env.FRONT_END_URL; // I put localhost:3000 because thats the default address for a react app.
      const resetLink = `${frontEndURL}/reset-password?token=${resetToken}`;
      //  This link should go to a front-end which has a form,
      // and it should send the reset token along with the new password to /reset-password as seen below on line 179.
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
      next(error);
      return;
    }
  }

  // STEP 5. Send a vague message back instead of saying invalid email
  // because we don't want hackers to know which emails are available in our database
  res.status(200).json({
    message:
      "We have sent an email with the forgot password link if you are registered!",
  });
};

module.exports = { resetPassword, forgotPassword };
