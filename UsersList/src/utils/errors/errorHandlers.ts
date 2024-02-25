import express from 'express';
import { ServerError, NotFoundError, ValidationError } from './errorTypes';

export const errorsHandler = (
  error: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (error instanceof ServerError) {
    console.error(
      `Server Error: ${error.name} was thrown with status ${error.status} and message ${error.message}`
    );
    res.status(error.status).json({
      type: error.name,
      message: error.message,
    });
  } else if (error instanceof NotFoundError) {
    console.error(`Not Found: ${error.message}`);
    res.status(error.status).json({
      type: error.name,
      message: error.message,
    });
  } else if (error instanceof ValidationError) {
    console.error(`Validation Error: ${error.message}`);
    res.status(error.status).json({
      type: error.name,
      message: error.message,
    });
  } else {
    console.error(`Unexpected Error: ${error.message}`);
    res.status(500).json({
      type: 'Unexpected Error',
      message: 'An unexpected error occurred',
    });
  }
};
