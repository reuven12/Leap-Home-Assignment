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

function normalizeUser(user: any): any {
  const normalizedUser = { ...user };

  for (const key in normalizedUser) {
    if (normalizedUser[key] instanceof Date) {
      normalizedUser[key] = normalizedUser[key].toISOString(); // המרת תאריכים ל-ISO
    }
  }

  return normalizedUser;
}

// נרמול המשתמש הקיים
const normalizedExistingUser = normalizeUser(existingUser);

for (const key in data) {
  if (Object.hasOwn(data, key) && !_.isEqual(data[key], normalizedExistingUser[key])) {
    updatedFields[key] = data[key];
  }
}


function compareDates(clientObj: any, mongoObj: any): boolean {
  // עבור על כל השדות של האובייקט של הלקוח
  for (let key in clientObj) {
    if (clientObj.hasOwnProperty(key)) {
      const clientValue = clientObj[key];
      const mongoValue = mongoObj[key];

      // אם הערך הוא מחרוזת שנראית כתאריך
      if (typeof clientValue === 'string' && !isNaN(Date.parse(clientValue))) {
        const clientDate = new Date(clientValue);
        const mongoDate = new Date(mongoValue);

        // אם התאריכים שונים
        if (clientDate.toISOString() !== mongoDate.toISOString()) {
          console.log(`The date field "${key}" is different.`);
          return false; // אם התאריכים שונים, נחזיר false
        }
      }
    }
  }

  // אם לא מצאנו הבדל
  return true;
}


function hasDateChanged(clientDate: any, mongoDate: any): boolean {
  // אם התאריך מהמונגו הוא כבר Date, אז אין צורך להמיר אותו
  const clientDateObj = new Date(clientDate);
  const mongoDateObj = new Date(mongoDate);

  // השוואת התאריכים כ-ISO string (כל תאריך בפורמט אחיד)
  return clientDateObj.toISOString() !== mongoDateObj.toISOString();
}
