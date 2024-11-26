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

import { UserModel } from "../models/UserModel";

export class MongoUserRepository {
  async findByUniqueKey(uniqueKey: string): Promise<any | null> {
    return await UserModel.findOne({ uniqueKey }).lean().exec(); // שימוש ב-lean()
  }

  async updateByUniqueKey(uniqueKey: string, updatedFields: any): Promise<any> {
    return await UserModel.updateOne({ uniqueKey }, { $set: updatedFields }).exec();
  }

  async createUser(data: any): Promise<any> {
    const user = new UserModel(data);
    return await user.save();
  }
}

import { IUserRepository } from "../repositories/IUserRepository";

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  async createOrUpdateUser(data: any): Promise<any> {
    const { uniqueKey } = data;

    // חיפוש משתמש קיים
    const existingUser = await this.userRepository.findByUniqueKey(uniqueKey);

    if (existingUser) {
      // המשתמש קיים - בדיקת השדות שהשתנו
      const updatedFields: Record<string, any> = {};
      for (const key in data) {
        if (data[key] !== existingUser[key]) {
          updatedFields[key] = data[key];
        }
      }

      // אם יש שדות לעדכון, מבצעים עדכון
      if (Object.keys(updatedFields).length > 0) {
        await this.userRepository.updateByUniqueKey(uniqueKey, updatedFields);
      }

      // מחזירים את האובייקט המשולב
      return { ...existingUser, ...updatedFields };
    } else {
      // המשתמש לא קיים - יצירה
      return await this.userRepository.createUser(data);
    }
  }
}




