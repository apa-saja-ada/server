function errorHandler(error, req, res, next) {
  let message = {
    status: false,
    statusCode: "FAILED",
    message: "Internal Server Error",
  };
  let code = 500;

  switch (error.name) {
    case "SequelizeValidationError":
    case "SequelizeUniqueConstraintError":
    case "BadRequest":
      code = 400;
      message = {
        status: false,
        statusCode: "Bad Request",
        message: error.errors[0].message,
      };
      break;
    case "JsonWebTokenError":
    case "NoToken":
    case "Unauthorized":
      code = 401;
      message = {
        status: false,
        statusCode: "Unauthorized",
        message: error.errors[0].message,
      };
      break;
    case "Forbidden":
      code = 403;
      message = "Forbidden";
      break;
    case "NotFound":
      code = 404;
      message = error.errors[0].message;
      break;
  }
  res.status(code).json(message);
}

module.exports = errorHandler;
