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

import mongoose from "mongoose";

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  async createOrUpdateUsers(users: any[]): Promise<any[]> {
    // יצירת session
    const session = await mongoose.startSession();

    try {
      // פתיחת transaction
      session.startTransaction();

      // קריאה ל-Promise.all עם שימוש בלוגיקה קיימת
      const results = await Promise.all(
        users.map(async (user) => {
          return this.createOrUpdateUser(user, session); // העברת ה-session
        })
      );

      // ביצוע commit ל-transaction אם הכל עבר בהצלחה
      await session.commitTransaction();
      return results;
    } catch (error) {
      // ביצוע rollback במקרה של שגיאה
      await session.abortTransaction();
      throw new Error(`Transaction failed: ${error.message}`);
    } finally {
      // סגירת ה-session
      session.endSession();
    }
  }

  async createOrUpdateUser(data: any, session?: mongoose.ClientSession): Promise<any> {
    const { uniqueKey } = data;

    // חיפוש משתמש קיים עם session
    const existingUser = await this.userRepository.findByUniqueKey(uniqueKey, session);

    if (existingUser) {
      const updatedFields: Record<string, any> = {};

      for (const key in data) {
        if (Object.hasOwn(data, key) && data[key] !== existingUser[key]) {
          updatedFields[key] = data[key];
        }
      }

      if (Object.keys(updatedFields).length > 0) {
        return await this.userRepository.updateByUniqueKey(uniqueKey, updatedFields, session);
      }

      return existingUser; // אם אין שדות לעדכן
    } else {
      // יצירת משתמש חדש עם session
      return await this.userRepository.createUser(data, session);
    }
  }
}

import { UserModel } from "../models/UserModel";
import mongoose from "mongoose";

export class MongoUserRepository {
  async findByUniqueKey(uniqueKey: string, session?: mongoose.ClientSession): Promise<any> {
    return await UserModel.findOne({ uniqueKey }).session(session || null).lean().exec();
  }

  async updateByUniqueKey(uniqueKey: string, updatedFields: any, session?: mongoose.ClientSession): Promise<any> {
    return await UserModel.updateOne({ uniqueKey }, { $set: updatedFields }).session(session || null).exec();
  }

  async createUser(data: any, session?: mongoose.ClientSession): Promise<any> {
    const user = new UserModel(data);
    return await user.save({ session });
  }
}

