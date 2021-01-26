const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  //  We check if the cookie is present

  if (!req.cookies.token) {
    // if the cookie is not here we throw an error 401
    const error = new Error("Unauthorized");
    error.status = 401;
    throw new Error(error);
  } else {
    // If there is a cookie, we verify the cookie
    // Since we have the user id encoded in the JWT, we can then attach it
    // to the req object.
    // Then, since everything is valid, we can go to the next middleware
    // The user is allowed to continue
    jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        throw new Error(err);
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
};
