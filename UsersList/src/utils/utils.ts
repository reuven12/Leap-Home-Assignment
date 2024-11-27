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



async createOrUpdateUsers(users: any[], batchSize: number = 50): Promise<any> {
  const session = await this.repository.startTransaction();

  try {
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);

      const promises = batch.map(async (user) => {
        try {
          return await this.createOrUpdateUser(user, session);
        } catch (error) {
          // יצירת שגיאה מותאמת אישית לפי סוג השגיאה
          let customError;
          if (error.code === 11000) { // Duplicate key error
            customError = new DuplicateError(
              "Duplicate key error",
              409,
              "DUPLICATE_KEY",
              { user, error }
            );
          } else if (error.validationError) { // Validation error
            customError = new ValidationError(
              "Validation error occurred",
              400,
              "VALIDATION_ERROR",
              { user, errorDetails: error.errors }
            );
          } else {
            customError = new Error(
              `Failed to process user ${JSON.stringify(user)}: ${error.message}`
            );
          }

          customError.user = user; // לשמירת פרטי היוזר
          throw customError; // זריקת שגיאה מותאמת אישית
        }
      });

      await Promise.all(promises);
    }

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();

    if (error.user) {
      throw new Error(
        `Transaction failed for user: ${JSON.stringify(error.user)} - ${error.message}`
      );
    }

    throw error; // זריקת שגיאה כללית אם אין מידע על יוזר
  } finally {
    await session.endSession();
  }
}





