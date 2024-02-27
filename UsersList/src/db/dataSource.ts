import { DataSource } from 'typeorm';
import config from '../config';

export const AppDataSource = new DataSource(config.db);
export const initDatabase = async () => {
  AppDataSource.initialize()
    .then(() => console.log('Data Source has been initialized!'))
    .catch((err:any) =>
      console.error('Error during Data Source initialization', err)
    );
};
