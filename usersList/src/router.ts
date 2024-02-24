import { Router } from 'express';
import { UsersController } from './users/users.controller';
const usersController = new UsersController();
const UsersRouter = Router();

UsersRouter.get('/getUsers/:page', usersController.getUsers);
UsersRouter.get('/getUser/:id', usersController.getUserById);
UsersRouter.get('/getUser/:name', usersController.getUserByName);
UsersRouter.post('/createUser', usersController.createUser);
UsersRouter.put('/updateUser/:id', usersController.updateUser);
UsersRouter.delete('/deleteUser/:id', usersController.deleteUser);

export default UsersRouter;
