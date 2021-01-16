module.exports = (err, req, res, next) => {
  err.status = err.status || 500; // default is 500
  console.log(err.message);
  if (process.env.NODE_ENV === "production" && err.status === 500) {
    err.message = "Something went wrong";
  }

  res.status(err.status);
  res.json({ error: err.message });
};
