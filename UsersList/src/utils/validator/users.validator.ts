import {
  idParamSchema,
  getUsersByPageSchema,
  createUserSchema,
  updateUserSchema,
} from './users.schema';
import * as Joi from 'joi';
import { ValidationError } from '../errors/errorTypes';
import { NextFunction, Request, Response } from 'express';
export class UsersValidator {
  private static validateObject = (
    objectToValidate: any,
    joiSchema: Joi.ObjectSchema<any>
  ) => {
    const { error } = joiSchema.validate(objectToValidate);
    if (error) {
      throw new ValidationError(
        error.details
          .map((errorDetails: any) => errorDetails.message.replace(/"/gi, ''))
          .join(', ')
      );
    }
  };

  static validateGetUsersByPage = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    UsersValidator.validateObject(req.params, getUsersByPageSchema);
    next();
  };

  static validateGetUserById = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    UsersValidator.validateObject(req.params, idParamSchema);
    next();
  };
  static validateDeleteUser = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    UsersValidator.validateObject(req.params, idParamSchema);
    next();
  };
  static validateCreateUser = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    UsersValidator.validateObject(req.body, createUserSchema);
    next();
  };
  static validateUpdateUserById = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    UsersValidator.validateObject(req.params, idParamSchema);
    UsersValidator.validateObject(req.body, updateUserSchema);
    next();
  };
}
