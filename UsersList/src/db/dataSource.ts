import { DataSource } from 'typeorm';
import config from '../config';

export const AppDataSource = new DataSource(config.db);

AppDataSource.initialize()
  .then(() => console.log('Data Source has been initialized!'))
  .catch((err) =>
    console.error('Error during Data Source initialization', err)
  );
