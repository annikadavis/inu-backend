const { nanoid } = require("nanoid"); // generates random unique strings
const validator = require("validator");

const mail = require("@sendgrid/mail");
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { users } = require("../config/db");

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
  const foundPasswordReset = await db.password_reset.findUnique({
    where: { reset_token: resetToken },
  });

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
  const hashedNewPassword = await bcrypt.hash(newPassword, 12);
  await db.users.update({
    where: { email: foundPasswordReset.email },
    data: {
      password: hashedNewPassword,
    },
  });

  // STEP 5, Clean up so they can reset their password again later.
  await db.password_reset.delete({
    where: { email: foundPasswordReset.email },
  });

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
  const foundUser = await db.users.findUnique({
    where: {
      email: email,
    },
  });

  console.log(foundUser);

  // STEP 4. if email exists in db, send a password reset link.
  if (foundUser) {
    // nanoid npm package generates random ids that are not easily guessable. https://www.npmjs.com/package/nanoid
    const resetToken = nanoid();
    try {
      // STEP 4.A - DELETE THE EXISTING REQUEST! So that we can send a new one.
      const existingResetReq = await db.password_reset.findFirst({
        where: { email: email },
      });
      if (existingResetReq) {
        await db.password_reset.delete({ where: { email: email } });
      }

      // STEP 4.B insert token and related email into the new table to keep track.
      await db.password_reset.create({
        data: {
          email: email,
          reset_token: resetToken,
        },
      });

      // STEP 4.C create a link for users to click on to reset their password.
      const frontEndURL = process.env.FRONT_END_URL;
      const resetLink = `${frontEndURL}/reset-password?token=${resetToken}`;

      // STEP 4.D prepare email
      const message = {
        to: email, // where to send
        from: "automailsenderrobot@gmail.com", // this is a new email I created, not something magic. I just named it like this.
        subject: "password reset link for INU HEALTH",
        html: `<p>Your password reset link: <a href="${resetLink}">${resetLink}</a> </p>`,
      };

      // STEP 4.E  send email using sendgrid.
      await mail.send(message);
      console.log("mail sent?");
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

const loginUser = async (req, res, next) => {
  // STEP 1, get email and password the user gives us from the body
  const { email, password } = req.body;
  if (!email || !password) {
    const error = new Error("One of the required information is wrong");
    error.status = 400;
    next(error);
    return;
  }

  // STEP 2, get a user with that combinations from database
  const foundUser = await db.users.findFirst({
    where: {
      email: email,
    },
    select: {
      id: true,
      email: true,
      password: true,
    },
  });

  // STEP 3, if user DOES NOT exist, send error
  const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);

  if (!isPasswordCorrect) {
    const error = new Error(
      "No such user with the provided email and password combination in database"
    );
    error.status = 401;
    next(error);
    return;
  }

  const token = jwt.sign({ id: foundUser.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  // STEP 4, if user exists, send found user
  res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
  res.status(200).json({ token });
};

module.exports = { resetPassword, forgotPassword, loginUser };
