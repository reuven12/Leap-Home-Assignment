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

.card {
  width: 200px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  direction: rtl;
  cursor: pointer;
  position: relative;
}

.icon-wrapper {
  width: 24px;
  height: 24px;
  position: relative;

  .icon {
    position: absolute;
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  .icon.user {
    opacity: 1;
    transform: scale(1);
  }

  .icon.eye {
    opacity: 0;
    transform: scale(0.8);
  }
}

.card:hover .icon.user {
  opacity: 0;
  transform: scale(0.8);
}

.card:hover .icon.eye {
  opacity: 1;
  transform: scale(1);
}



  import React from "react";
import { FaUser, FaEye } from "react-icons/fa";
import "./PersonCard.less"; // ייבוא קובץ ה-LESS

const PersonCard: React.FC = () => {
  return (
    <div className="card">
      <div>שם המשתמש</div>
      <div className="icon-wrapper">
        <span className="icon user">
          <FaUser size={24} />
        </span>
        <span className="icon eye">
          <FaEye size={24} />
        </span>
      </div>
    </div>
  );
};

export default PersonCard;

