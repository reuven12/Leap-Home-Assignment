import {
  getUsersByPageSchema,
  getUserByIdSchema,
  deleteUserSchema,
  createUserSchema,
  updateUserSchema,
} from "./users.schema";
import { NextFunction, Request, Response } from "express";

export class UsersValidator {
  private static validateRequest(schema: any) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req);
      if (error) {
        res.status(400).send("Invalid request");
        return;
      }
      next();
    };
  }

  static validateGetUsersByPage =
    UsersValidator.validateRequest(getUsersByPageSchema);
  static validateGetUserById =
    UsersValidator.validateRequest(getUserByIdSchema);
  static validateDeleteUser = UsersValidator.validateRequest(deleteUserSchema);
  static validateCreateUser = UsersValidator.validateRequest(createUserSchema);
  static validateUpdateUserById =
    UsersValidator.validateRequest(updateUserSchema);
}
