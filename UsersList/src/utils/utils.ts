import axios from "axios";
import config from "../config";
import { ServerError } from "../utils/errors/errorTypes";
import { User } from "../interfaces/users.interface";
import { FetchBy } from "../interfaces/users.interface";
import { UserEntity } from "../db/users.entity";
export const corsOptions = {
  origin: [
    "https://localhost",
    "https://www.google.com",
    "https://www.facebook.com",
  ],
  optionsSuccessStatus: 200,
};

export const fetchExternalUsers = async (
  id: number,
  fetchUsersBy: FetchBy
): Promise<User[] | User | undefined> => {
  try {
    if (fetchUsersBy === FetchBy.PAGE) {
      return (await axios.get(`${config.externalUsersApi.url}?page=${id}`))
        .data;
    } else if (fetchUsersBy === FetchBy.ID) {
      return (await axios.get(`${config.externalUsersApi.url}/${id}`)).data;
    }
  } catch (error: any) {
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
