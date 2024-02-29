import { NextFunction, Request, Response } from 'express';
import { UsersRepository } from './users.repository';
import { User } from '../interfaces/users.interface';

export class UsersController {
  private usersRepository: UsersRepository;
  constructor() {
    this.usersRepository = new UsersRepository();
  }

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.usersRepository.getUsers();
      res.status(200).send(users);
    } catch (error) {
      next(error);
    }
  };

  getUsersByPage = async (req: Request, res: Response, next: NextFunction) => {
    const page: number = parseInt(req.params.page);
    try {
      const users = await this.usersRepository.getUsersByPage(page);
      res.status(200).send(users);
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: number = parseInt(req.params.id);
      const user = await this.usersRepository.getUserById(id);
      res.status(200).send(user);
    } catch (error) {
      next(error);
    }
  };

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createUserRequest: User = { ...req.body };
      const user = await this.usersRepository.createUser(createUserRequest);
      res.status(200).send(user);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updateUserRequest: Partial<User> = {
        id: req.params.id,
        ...req.body,
      };
      const user = await this.usersRepository.updateUser(updateUserRequest);
      res.status(200).send(user);
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: number = parseInt(req.params.id);
      const user = await this.usersRepository.deleteUser(id);
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  };
}
