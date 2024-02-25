import { NextFunction, Request, Response } from 'express';
import { UsersRepository } from './users.repository';
import { User } from '../interfaces/users.interface';

export class UsersController {
  private usersRepository: UsersRepository;
  constructor() {
    this.usersRepository = new UsersRepository();
  }

  async getUsersByPage(req: Request, res: Response, next: NextFunction) {
    try {
      const page: number = parseInt(req.params.page);
      const users = await this.usersRepository.getUsersByPage(page);
      res.status(200).send(users);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const id: number = parseInt(req.params.id);
      const user = this.usersRepository.getUserById(id);
      res.status(200).send(user);
    } catch (error) {
      next(error);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const createUserRequest: User = req.body;
      const user = this.usersRepository.createUser(createUserRequest);
      res.status(200).send(user);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const updateUserRequest: Partial<User> = {
        id: req.params.id,
        ...req.body,
      };
      const user = this.usersRepository.updateUser(updateUserRequest);
      res.status(200).send(user);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id: number = parseInt(req.params.id);
      const user = this.usersRepository.deleteUser(id);
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  }
}
