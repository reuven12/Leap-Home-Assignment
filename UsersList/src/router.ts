import { Router } from 'express';
import { UsersController } from './users/users.controller';
import { UsersValidator } from './utils/users.validator';
const usersController = new UsersController();
const UsersRouter = Router();

UsersRouter.get(
  '/getUsers/:page',
  UsersValidator.validateGetUsersByPage,
  usersController.getUsersByPage
);
UsersRouter.get(
  '/getUser/:id',
  UsersValidator.validateGetUserById,
  usersController.getUserById
);
UsersRouter.post(
  '/createUser',
  UsersValidator.validateCreateUser,
  usersController.createUser
);
UsersRouter.put(
  '/updateUser/:id',
  UsersValidator.validateUpdateUserById,
  usersController.updateUser
);
UsersRouter.delete(
  '/deleteUser/:id',
  UsersValidator.validateDeleteUser,
  usersController.deleteUser
);

export default UsersRouter;
