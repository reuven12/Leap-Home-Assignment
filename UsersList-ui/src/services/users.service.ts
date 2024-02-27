import HttpClient from "../utils/http.client";
import config from "../config";
import { User } from "../models/users.interfaces";
const { users, baseUrl } = config.api;

export class UsersService {
  static getUsersByPage = async (page: number): Promise<User[]> => {
    return (await HttpClient.get(`${baseUrl}${users}/getUsers/${page}`))
      .data as User[];
  };

  static getUserById = async (id: number): Promise<User> => {
    return (await HttpClient.get(`${baseUrl}${users}/getUser/${id}`))
      .data as User;
  };

  static createUser = async (newUser: User): Promise<User> => {
    return (await HttpClient.post(`${baseUrl}${users}/createUser`, newUser))
      .data as User;
  };

  static updateUser = async (
    id: number,
    updatedUser: Partial<User>
  ): Promise<User> => {    
    return (
      await HttpClient.put(`${baseUrl}${users}/updateUser/${id}`, updatedUser)
    ).data as User;
  };

  static deleteUser = async (id: number): Promise<void> => {
    await HttpClient.delete(`${baseUrl}${users}/deleteUser/${id}`);
  };
}
