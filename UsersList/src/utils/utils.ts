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

//scripts/helper

import mongoose from 'mongoose';

export async function syncCollection(
  prodDb: mongoose.Connection,
  devDb: mongoose.Connection,
  collectionName: string,
  schema: mongoose.Schema
) {
  const ProdModel = prodDb.model(collectionName, schema);
  const DevModel = devDb.model(collectionName, schema);

  console.log(`Starting sync for collection: ${collectionName}...`);

  const latestDevRecord = await DevModel.findOne()
    .sort({ createdAt: -1 })
    .exec();

  const lastSyncDate = latestDevRecord ? latestDevRecord.createdAt : new Date(0);

  console.log(`Last sync date for ${collectionName}: ${lastSyncDate}`);

  const newRecords = await ProdModel.find({
    createdAt: { $gt: lastSyncDate },
  }).exec();

  if (newRecords.length > 0) {
    await DevModel.insertMany(newRecords);
    console.log(`Synced ${newRecords.length} records to ${collectionName}.`);
  } else {
    console.log(`No new records to sync for ${collectionName}.`);
  }
}



//syncData 
import mongoose from 'mongoose';
import { Anticipation } from '../models/anticipation.model';
import { syncCollection } from './helpers/syncCollection';

const prodDb = mongoose.createConnection(process.env.PROD_DB_URI!, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const devDb = mongoose.createConnection(process.env.DEV_DB_URI!, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function syncDatabases() {
  try {
    await syncCollection(prodDb, devDb, 'Anticipation', Anticipation.schema);
    await syncCollection(prodDb, devDb, 'NegativeAnticipation', Anticipation.schema);
  } catch (error) {
    console.error('Error syncing databases:', error);
  } finally {
    await prodDb.close();
    await devDb.close();
    console.log('Database connections closed.');
  }
}

if (require.main === module) {
  syncDatabases().catch(console.error);
}



