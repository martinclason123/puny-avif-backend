module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log the error (you can also integrate more sophisticated logging solutions here)
  console.error(err);

  res.status(statusCode).json({
    status: "error",
    message: message,
    // In development mode, you might want more detailed error
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
