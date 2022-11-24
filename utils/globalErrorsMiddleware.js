/* eslint-disable no-param-reassign */
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      err,
    });
  }

  if (process.env.NODE_ENV === "PRODUCTION") {
    if (err.operationalError) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    // Handling other errors
    res.status(err.statusCode).json({
      status: "error",
      message: "Something went wrong.",
    });
  }
  next();
};
