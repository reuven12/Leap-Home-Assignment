import { Request, Response } from 'express';

export class UsersController {
  static getUsers(req: Request, res: Response) {
    console.log('Get Users');
    res.status(200).send('Get Users');
  }

  static getUser(req: Request, res: Response) {
    console.log('Get User');
    res.status(200).send('Get User');
  }

  static createUser(req: Request, res: Response) {
    console.log('Create User');
    res.status(200).send('Create User');
  }

  static updateUser(req: Request, res: Response) {
    console.log('Update User');
    res.status(200).send('Update User');
  }

  static deleteUser(req: Request, res: Response) {
    console.log('Delete User');
    res.status(200).send('Delete User');
  }
}
