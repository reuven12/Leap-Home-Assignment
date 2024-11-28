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


async createUsers(users: any[], batchSize: number = 50): Promise<void> {
  const session = await mongoose.startSession();
  try {
    // שלב 1: ולידציה מוקדמת
    console.log('Starting validation...');
    for (const user of users) {
      await this.validateUser(user);
    }
    console.log('Validation successful.');

    // שלב 2: שמירה בטרנזקציות
    session.startTransaction();
    console.log('Starting to save users in batches...');

    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize); // יצירת ה-Batch הנוכחי

      // שמירת ה-Batch בטרנזקציה
      await this.userRepository.bulkWrite(
        batch.map((user) => ({
          insertOne: { document: user }, // יצירת המסמך
        })),
        { session }
      );

      console.log(`Batch ${i / batchSize + 1} saved successfully.`);
    }

    await session.commitTransaction();
    console.log('All users saved successfully.');
  } catch (error) {
    console.error('An error occurred, aborting transaction...', error);
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw error; // זריקת השגיאה החוצה
  } finally {
    session.endSession();
    console.log('Session ended.');
  }
}

// פונקציה לבדיקה מקדימה של משתמש
async validateUser(user: any): Promise<void> {
  // בדיקת קיום משתמש עם אותו ID
  const existingUser = await this.userRepository.findOne({ id: user.id });
  if (existingUser) {
    throw new Error(`Duplicate user found with ID: ${user.id}`);
  }

  // בדיקת שדות חובה (לדוגמה)
  if (!user.name || !user.email) {
    throw new Error(`Validation failed for user: ${JSON.stringify(user)}`);
  }

  // ניתן להוסיף בדיקות נוספות לפי הצורך
}



//in repository

async createOrUpdateUsers(users: any[], session: any): Promise<void> {
  const operations = users.map((user) => ({
    updateOne: {
      filter: { id: user.id }, // קריטריון למציאת המסמך
      update: { $set: user },  // עדכון המסמך
      upsert: true,            // צור מסמך אם לא נמצא
    },
  }));

  try {
    await this.userRepository.bulkWrite(operations, { session });
  } catch (error) {
    throw new Error(`Failed to execute bulkWrite: ${error.message}`);
  }
}


