import { Router } from 'express';
import { UsersController } from './users/users.controller';

const UsersRouter = Router();

UsersRouter.get('/getUsers/:page', UsersController.getUsers);
UsersRouter.get('/getUser/:id', UsersController.getUser);
UsersRouter.post('/createUser', UsersController.createUser);
UsersRouter.put('/updateUser/:id', UsersController.updateUser);
UsersRouter.delete('/deleteUser/:id', UsersController.deleteUser);

export default UsersRouter;
