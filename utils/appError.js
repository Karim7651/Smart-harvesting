class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; //creating instance without a required field / route doesn't exist /mongoose/ etc...
    Error.captureStackTrace(this, this.constructor); //log where error happens
  }
}

export default AppError;