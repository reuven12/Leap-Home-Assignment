import { UsersRepository } from './users.repository';

export class UsersManager {
  private usersRepository: UsersRepository;
  constructor() {
    this.usersRepository = new UsersRepository();
  }
  static getUsers() {
    console.log('Get Users');
    return 'Get Users';
  }

  static getUser() {
    console.log('Get User');
    return 'Get User';
  }

  static createUser() {
    console.log('Create User');
    return 'Create User';
  }

  static updateUser() {
    console.log('Update User');
    return 'Update User';
  }

  static deleteUser() {
    console.log('Delete User');
    return 'Delete User';
  }
}
