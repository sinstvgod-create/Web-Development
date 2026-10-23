const errorMiddleware = (
  error,
  req,
  res,
  next
) => {
  console.error(
    "Server Error:",
    error
  );

  const statusCode =
    error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message:
      error.message ||
      "Something went wrong on the server"
  });
};

export default errorMiddleware;