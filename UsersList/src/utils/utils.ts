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

// מחלקת הבסיס
class Base<THeaders extends readonly string[]> {
  // מחלקת הבסיס אינה צריכה את headers בקונסטרוקטור
  protected headersType!: THeaders;

  printHeadersType() {
    console.log(this.headersType);
  }
}

// מחלקת האקסל
class PeopleExcel extends Base<typeof PeopleExcel.headers> {
  // headers מוגדר במחלקה הנגזרת
  static headers = ["age", "name", "address"] as const;

  constructor() {
    super(); // קריאה לקונסטרוקטור מחלקת הבסיס
  }

  // פונקציה שמחזירה את headers בזמן ריצה
  getHeaders(): typeof PeopleExcel.headers {
    return PeopleExcel.headers;
  }
}

// שימוש
const peopleExcel = new PeopleExcel();
const headers = peopleExcel.getHeaders(); // ["age", "name", "address"]
console.log(headers);

// חילוץ הטייפ
type PeopleHeaders = (typeof PeopleExcel.headers)[number];

// שימוש בטייפ
const exampleHeader: PeopleHeaders = "name"; // תקין
// const invalidHeader: PeopleHeaders = "invalid"; // שגיאה
