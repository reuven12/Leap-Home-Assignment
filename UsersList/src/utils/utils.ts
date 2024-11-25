import axios from 'axios';
import config from '../config';
import { ServerError, NotFoundError } from '../utils/errors/errorTypes';
import { User } from '../interfaces/users.interface';
import { FetchBy } from '../interfaces/users.interface';
import { UserEntity } from '../db/users.entity';
import cors from 'cors';

export const allowedOrigins = [
  "http://localhost:3000",
  "https://www.google.com",
  "https://www.facebook.com",
];
export const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
};

export const fetchExternalUsers = async (
  id: number,
  fetchUsersBy: FetchBy
): Promise<User[] | User | undefined> => {
  try {
    if (fetchUsersBy === FetchBy.PAGE) {
      return (await axios.get(`${config.externalUsersApi.url}?page=${id}`)).data
        .data;
    } else if (fetchUsersBy === FetchBy.ID) {
      return (await axios.get(`${config.externalUsersApi.url}/${id}`)).data;
    }
  } catch (error: any) {
    if (error.response.status === 404)
      throw new NotFoundError('User not found');
    throw new ServerError();
  }
};

export const generateUser = (user: User): UserEntity => {
  const userEntity = new UserEntity();
  userEntity.first_name = user.first_name;
  userEntity.last_name = user.last_name;
  userEntity.email = user.email;
  userEntity.avatar = user.avatar;
  return userEntity;
};

// interfaces/IUserRepository.ts
export interface IUserRepository {
  createUser(data: any): Promise<any>;
  getUserById(id: string): Promise<any>;
  updateUser(id: string, data: any): Promise<any>;
  deleteUser(id: string): Promise<void>;
}


    // repositories/MongoUserRepository.ts
import { IUserRepository } from "../interfaces/IUserRepository";
import { UserModel } from "../models/UserModel";

export class MongoUserRepository implements IUserRepository {
  async createUser(data: any): Promise<any> {
    const user = new UserModel(data);
    return await user.save();
  }

  async getUserById(id: string): Promise<any> {
    return await UserModel.findById(id).exec();
  }

  async updateUser(id: string, data: any): Promise<any> {
    return await UserModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deleteUser(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id).exec();
  }
}

// services/UserService.ts
import { IUserRepository } from "../interfaces/IUserRepository";

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  async createUser(data: any): Promise<any> {
    return await this.userRepository.createUser(data);
  }

  async getUserById(id: string): Promise<any> {
    return await this.userRepository.getUserById(id);
  }

  async updateUser(id: string, data: any): Promise<any> {
    return await this.userRepository.updateUser(id, data);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.deleteUser(id);
  }
}

//הזרקת תלויות ב server
const userRepository = new MongoUserRepository(); // ניתן להחליף ל-SQLUserRepository
const userService = new UserService(userRepository);
const userController = new UserController(userService);
