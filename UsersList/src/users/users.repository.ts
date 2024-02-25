import { Repository } from 'typeorm';
import { AppDataSource } from '../db/dataSource';
import { UserEntity } from '../db/users.entity';
import { User, FetchBy } from '../interfaces/users.interface';
import config from '../config';
import { fetchExternalUsers } from '../utils/utils';
import {
  ApplicationError,
  NotFoundError,
  ServerError,
} from '../utils/errors/errorTypes';

export class UsersRepository {
  private userRepository: Repository<UserEntity>;
  private usersByExternalAPI: string;
  constructor() {
    this.userRepository = AppDataSource.getRepository(UserEntity);
    this.usersByExternalAPI = config.externalUsersApi.url;
  }

  async getUsersByPage(page: number): Promise<User[]> {
    try {
      let users: User[];
      const existingUsers: UserEntity[] = await this.userRepository.find({
        where: { page },
      });
      if (existingUsers.length > 0) users = existingUsers;
      else {
        const getExternalUsers = (await fetchExternalUsers(
          page,
          FetchBy.PAGE
        )) as User[];
        const usersToSave = getExternalUsers.map((user) => {
          const userEntity = new UserEntity();
          userEntity.page = page;
          userEntity.id = user.id as number;
          userEntity.first_name = user.first_name;
          userEntity.last_name = user.last_name;
          userEntity.email = user.email;
          userEntity.avatar = user.avatar;
          return userEntity;
        });
        await this.userRepository.save(usersToSave);
        users = usersToSave;
      }
      const response: User[] = users.map((user: User) => ({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        avatar: user.avatar,
      }));
      return response;
    } catch (error) {
      if (error instanceof ApplicationError) throw error;
      throw new ServerError();
    }
  }

  async getUserById(id: number): Promise<User | null> {
    try {
      const existingUser = await this.userRepository.findOneBy({ id });
      if (existingUser) return existingUser;
      else return (await fetchExternalUsers(id, FetchBy.ID)) as User;
    } catch (error) {
      if (error instanceof ApplicationError) throw error;
      throw new ServerError();
    }
  }

  async createUser(createUserRequest: User): Promise<User> {
    try {
      const userEntity = new UserEntity();
      userEntity.first_name = createUserRequest.first_name;
      userEntity.last_name = createUserRequest.last_name;
      userEntity.email = createUserRequest.email;
      userEntity.avatar = createUserRequest.avatar;
      await this.userRepository.save(userEntity);
      return userEntity as User;
    } catch (error) {
      if (error instanceof ApplicationError) throw error;
      throw new ServerError();
    }
  }

  async updateUser(updateUserRequest: Partial<User>): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({
        id: updateUserRequest.id,
      });
      if (!user) throw new NotFoundError('User not found');
      return await this.userRepository.save({
        ...user,
        ...updateUserRequest,
      });
    } catch (error) {
      if (error instanceof ApplicationError) throw error;
      throw new ServerError();
    }
  }

  async deleteUser(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) throw new NotFoundError('User not found');
      return await this.userRepository.remove(user);
    } catch (error) {
      if (error instanceof ApplicationError) throw error;
      throw new ServerError();
    }
  }
}
