import HttpClient from '../utils/http.client';
import config from '../config';
import { User } from '../models/users.interfaces';
const { users, baseUrl } = config.api;

export class UsersService {
  static getUsersByPage = async (page: number): Promise<User[]> => {
    const response = await HttpClient.get(`${baseUrl}${users}/getUsers/${page}`);
    return (await HttpClient.get(`${baseUrl}${users}/getUsers/${page}`)).data as User[];
  };

  static getUsersByUserId = async (id: number): Promise<User[]> => {
    return (await HttpClient.get(`${baseUrl}${users}/getUser/${id}`)).data as User[];
  };

  static createUser = async (newUser: User): Promise<void> => {
    await HttpClient.post(`${baseUrl}${users}/createUser`, newUser);
  };

  static updateUser = async (
    id: number,
    updatedUser: Partial<User>
  ): Promise<void> => {
    await HttpClient.put(`${baseUrl}${users}/updateUser/${id}`, updatedUser);
  };

  static deleteUser = async (id: number): Promise<void> => {
    await HttpClient.delete(`${baseUrl}${users}/deleteUser/${id}`);
  };
}
