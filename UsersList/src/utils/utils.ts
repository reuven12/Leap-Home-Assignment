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

// מחלקת האב
class Excel<THeaders extends readonly string[]> {
  headersType!: THeaders; // הגדרת ה-Type בלבד
}

// מחלקת הבת
class ExcelPeople extends Excel<HeaderType> {
  // פונקציה סטטית שמחזירה את מערך ה-Headers המתאים
  static getHeaders(condition: string) {
    const headersMap = {
      basic: ["name", "age"] as const,
      detailed: ["name", "age", "rank", "address"] as const,
      minimal: ["name"] as const,
    };

    // מחזיר את המערך המתאים לפי התנאי
    return headersMap[condition];
  }
}

// הגדרת ה-Type בצורה אוטומטית על בסיס הפונקציה
type HeaderType = ReturnType<typeof ExcelPeople["getHeaders"]>;

// שימוש
const headers = ExcelPeople.getHeaders("detailed"); // מחזיר ["name", "age", "rank", "address"]
const minimalHeaders = ExcelPeople.getHeaders("minimal"); // מחזיר ["name"]

// בדוגמה זו, ה-Type משתנה בהתאם למערך שהוחזר

  
