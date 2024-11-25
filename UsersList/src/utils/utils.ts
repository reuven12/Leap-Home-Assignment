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



import { createLogger, transports, format } from 'winston';
import ElasticsearchTransport from 'winston-elasticsearch';
import { Client } from '@elastic/elasticsearch';

const esClient = new Client({
  node: 'http://localhost:9200', // שנה לכתובת ה-Elasticsearch שלך
  auth: {
    username: 'your-username', // שם משתמש אם נדרש
    password: 'your-password', // סיסמא אם נדרש
  },
});

const esTransportOptions = {
  level: 'info', // רמת הלוגים שתשלח ל-Elasticsearch
  client: esClient,
  indexPrefix: 'app-logs', // פרפקס של האינדקס
  transformer: (logData: any) => ({
    '@timestamp': new Date().toISOString(),
    severity: logData.level,
    message: logData.message,
    fields: { ...logData.meta },
  }),
};

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(), // לוגים בקונסול
    new ElasticsearchTransport(esTransportOptions), // לוגים ב-Elasticsearch
  ],
});

export default logger;

    
