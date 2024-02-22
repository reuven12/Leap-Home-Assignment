import express from 'express';
import { ServerError } from './errorTypes';

export const serverErrorHandler = (
  error: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (error instanceof ServerError) {
    console.log(
      `Server Error
      ${error.name} was thrown with status ${error.status} and message ${error.message}`
    );
    res.status(error.status).send({
      type: error.name,
      message: error.message,
    });
  } else {
    next(error);
  }
};
