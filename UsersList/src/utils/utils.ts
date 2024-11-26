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


export interface IRepository {
  startTransaction(): Promise<any>; // התחלת טרנזקציה
  commitTransaction(session: any): Promise<void>; // שמירת טרנזקציה
  abortTransaction(session: any): Promise<void>; // ביטול טרנזקציה
  endSession(session: any): Promise<void>; // סיום session
  // פונקציות קיימות כמו findByUniqueKey, updateByUniqueKey וכו'.
}


import mongoose from "mongoose";

export class MongoRepository implements IRepository {
  async startTransaction(): Promise<mongoose.ClientSession> {
    const session = await mongoose.startSession();
    session.startTransaction();
    return session;
  }

  async commitTransaction(session: mongoose.ClientSession): Promise<void> {
    await session.commitTransaction();
  }

  async abortTransaction(session: mongoose.ClientSession): Promise<void> {
    await session.abortTransaction();
  }

  async endSession(session: mongoose.ClientSession): Promise<void> {
    session.endSession();
  }

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



async createOrUpdateUsers(users: any[]): Promise<any> {
  const session = await this.repository.startTransaction();
  try {
    // יצירת רשימת הבטחות עם מידע על כל יוזר
    const promises = users.map(async (user) => {
      try {
        return await this.createOrUpdateUser(user, session);
      } catch (error) {
        // הוספת פרטי היוזר לשגיאה
        error.user = user;
        throw error;
      }
    });

    // הרצת כל ההבטחות במקביל
    const results = await Promise.all(promises);

    // שמירת הטרנזקציה אם הכל הצליח
    await session.commitTransaction();
    return results;
  } catch (error) {
    // ביטול הטרנזקציה במקרה של שגיאה
    await session.abortTransaction();
    if (error.user) {
      throw new Error(
        `Transaction failed for user: ${JSON.stringify(error.user)} - ${error.message}`
      );
    }
    throw error;
  } finally {
    // סגירת ה-session
    await session.endSession();
  }
}


