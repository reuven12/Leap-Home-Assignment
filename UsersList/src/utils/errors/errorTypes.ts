export class ApplicationError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super();

    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message || 'Error: Undefined Application Error';
    this.status = status || 500;
  }
}

export class ServerError extends ApplicationError {
  constructor(message = 'Internal Server Error') {
    super(message, 500);
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

export class ValidationError extends ApplicationError {
  constructor(message = 'Validation error') {
    super(message, 400);
  }
}
