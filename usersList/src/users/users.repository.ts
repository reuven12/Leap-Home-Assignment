import { User } from "../interfaces/users.entity";

export class UsersRepository {
  async getUsers(): Promise<User[]> {
    try {
      const users = await User.find();
      return users;
    } catch (error) {
      console.log("Error while trying to get users");
      return [];
    }
  }

  async getUserById(): Promise<User> {
    console.log("Get User By Id");
    return new User();
  }

  async getUserByName(): Promise<User> {
    console.log("Get User By Name");
    return new User();
  }

  async createUser(): Promise<User> {
    console.log("Create User");
    return new User();
  }

  async updateUser(): Promise<User> {
    console.log("Update User");
    return new User();
  }

  async deleteUser(): Promise<User> {
    console.log("Delete User");
    return new User();
  }
}
