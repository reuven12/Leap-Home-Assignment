import {
  getUsersByPageSchema,
  getUserByIdSchema,
  deleteUserSchema,
  createUserSchema,
  updateUserSchema,
} from './users.schema';
import { NextFunction, Request, Response } from 'express';

export class UsersValidator {
  static validateGetUsersByPage(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { error } = getUsersByPageSchema.validate(req);
    if (error) {
      res.status(400).send;
      return;
    }
    next();
  }

  static validateGetUserById(req: Request, res: Response, next: NextFunction) {
    const { error } = getUserByIdSchema.validate(req);
    if (error) {
      res.status(400).send;
      return;
    }
    next();
  }

  static validateDeleteUser(req: Request, res: Response, next: NextFunction) {
    const { error } = deleteUserSchema.validate(req);
    if (error) {
      res.status(400).send;
      return;
    }
    next();
  }

  static validateCreateUser(req: Request, res: Response, next: NextFunction) {
    const { error } = createUserSchema.validate(req);
    if (error) {
      res.status(400).send;
      return;
    }
    next();
  }

  static validateUpdateUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { error } = updateUserSchema.validate(req);
    if (error) {
      res.status(400).send;
      return;
    }
    next();
  }
}
