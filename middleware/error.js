import ErrorHandler from "../utils/ErrorHandler";

export const ErrorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Wrong MongoDb Id Error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = "Json Web Token is invalid, try again";
    err = new ErrorHandler(message, 401);
  }

  // Jwt expired error
  if (err.name === "TokenExpiredError") {
    const message = `Your token has expired, Please Log in again`;
    err = new ErrorHandler(message, 401);
  }

  // Sanitize Error message in production
  const sanitizedMessage = process.env.NODE_ENV === 'production'
  ? 'An error occured'
  : err.message;

  console.error(err)

  res.status(err.statusCode).json({
    success: false,
    message: sanitizedMessage,
    ...(process.env.NODE_ENV !== 'production' && {stack: err.stack}),
  });
};

// Handle unhandled Promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise rejection`);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
});
