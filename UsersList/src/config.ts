import { DataSourceOptions } from 'typeorm';
import { UserEntity } from './db/users.entity';
import dotenv from 'dotenv';
dotenv.config();

const config: { server: any; db: DataSourceOptions; externalUsersApi: any } = {
  server: {
    port: process.env.PORT || 2000,
  },
  db: {
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT as string, 10) || 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'homework',
    entities: [UserEntity],
    synchronize: true,
  },
  externalUsersApi: {
    url: process.env.EXTERNAL_USERS_API_URL || 'https://reqres.in/api/users/',
  },
};

export default config;
