import { Request, Response } from "express";
import { UsersRepository } from "./users.repository";

export class UsersController {
 private usersRepository: UsersRepository;
  constructor() {
    this.usersRepository = new UsersRepository();
  }

  async getUsers(req: Request, res: Response) {
    try {
      const users = this.usersRepository.getUsers();
      res.status(200).send(users);
    } catch (error) {
      res.status(500).send("Error while trying to get users");
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const user = this.usersRepository.getUserById();
      res.status(200).send(user);
    } catch (error) {
      res.status(500).send("Error while trying to get user");
    }
  }

  async getUserByName(req: Request, res: Response) {
    try {
      const user = this.usersRepository.getUserByName();
      res.status(200).send(user);
    } catch (error) {
      res.status(500).send("Error while trying to get user");
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const user = this.usersRepository.createUser();
      res.status(200).send(user);
    } catch (error) {
      res.status(500).send("Error while trying to create user");
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const user = this.usersRepository.updateUser();
      res.status(200).send(user);
    } catch (error) {
      res.status(500).send("Error while trying to update user");
    }
    console.log("Update User");
    res.status(200).send("Update User");
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const user = this.usersRepository.deleteUser();
      res.status(200).send(user);
    } catch (error) {
      res.status(500).send("Error while trying to delete user");
    }
  }
}
