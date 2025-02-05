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


type Event = {
  id: string;
  startTime: number;
  endTime: number;
};

// פונקציה לעדכון רשימת האירועים תוך שמירה על רפרנס קיים
const updateEvents = (currentEvents: Event[], newEvents: Event[], selectedTime: number): Event[] => {
  // סינון האירועים הישנים כך שיישארו רק אלה שעדיין רלוונטיים לנקודת הזמן החדשה
  const relevantOldEvents = currentEvents.filter(event => 
    selectedTime >= event.startTime && selectedTime <= event.endTime
  );

  // יצירת Map כדי לזהות אירועים חדשים שאין ברשימה הישנה
  const existingEventIds = new Set(relevantOldEvents.map(event => event.id));

  // הוספת אירועים חדשים שאינם קיימים ברשימה הישנה
  const mergedEvents = [
    ...relevantOldEvents, 
    ...newEvents.filter(event => !existingEventIds.has(event.id))
  ];

  return mergedEvents;
};

// דוגמה לשימוש:
let currentEvents: Event[] = [
  { id: "1", startTime: 100, endTime: 200 },
  { id: "2", startTime: 150, endTime: 250 }
];

const newEvents: Event[] = [
  { id: "2", startTime: 150, endTime: 250 }, // נשאר כי הוא רלוונטי
  { id: "3", startTime: 200, endTime: 300 }  // חדש
];

const selectedTime = 175;

currentEvents = updateEvents(currentEvents, newEvents, selectedTime);

console.log(currentEvents);



  
  
