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



  
  
import { Subject } from "rxjs";

class MySystem {
  private changesSubject = new Subject<void>();

  // פונקציה שתאפשר האזנה
  public getChangesObservable() {
    return this.changesSubject.asObservable();
  }

  // פליטת שינויים
  private emitChange(): void {
    this.changesSubject.next();
  }

  // דוגמה לעדכון מידע
  public updateData(newData: any): void {
    // בצע עדכון...
    this.emitChange();
  }
}

export const mySystem = new MySystem();



  import React, { useEffect, useState } from "react";
import { mySystem } from "./MySystem";

const MyComponent: React.FC = () => {
  const [data, setData] = useState<string>("Initial Data");

  useEffect(() => {
    const subscription = mySystem.getChangesObservable().subscribe(() => {
      // עדכון סטייט או כל פעולה אחרת
      setData("Data Updated");
    });

    // ניקוי הסבסקריפשן
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <div>Data: {data}</div>;
};

export default MyComponent;

  
