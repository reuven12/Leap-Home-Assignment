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


class Item {
  constructor(public id: number, public name: string) {}
}

// מערך הפריטים הראשי
const items: Item[] = [
  new Item(1, "Item 1"),
  new Item(2, "Item 2"),
  new Item(3, "Item 3"),
  new Item(4, "Item 4"),
];

// מערך ה-IDs שמקושרים
const linkedIds: number[] = [2, 4];

// טיפוס מורחב שמוסיף isLinked לפריטים
type ExtendedItem = Item & { isLinked: boolean };

// פעולת מיון והרחבה
const sortedExtendedItems: ExtendedItem[] = items
  .map((item) => ({
    ...item,
    isLinked: linkedIds.includes(item.id), // הרחבת ה-Type עם isLinked
  }))
  .sort((a, b) => {
    if (a.isLinked && !b.isLinked) return -1; // מקושרים קודם
    if (!a.isLinked && b.isLinked) return 1;  // לא מקושרים אחר כך
    return 0; // שמירה על הסדר הקיים
  });

console.log(sortedExtendedItems);


  
