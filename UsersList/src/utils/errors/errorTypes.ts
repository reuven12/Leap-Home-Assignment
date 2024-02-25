export class ApplicationError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super();

    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message || "Error: Undefined Application Error";
    this.status = status || 500;
  }
}

export class ServerError extends ApplicationError {
  constructor(message = "Internal Server Error", status = 500) {
    super(message, status);
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message = "Resource not found", status = 404) {
    super(message, status);
  }
}

export class ValidationError extends ApplicationError {
  constructor(message = "Validation error", status = 400) {
    super(message, status);
  }
}
