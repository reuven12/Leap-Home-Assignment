import { Repository } from 'typeorm';
import { AppDataSource } from '../db/dataSource';
import { UserEntity } from '../db/users.entity';
import { SocketServer } from '../socket.server';
import { User, FetchBy } from '../interfaces/users.interface';
import config from '../config';
import { fetchExternalUsers, generateUser } from '../utils/utils';
import {
  ApplicationError,
  NotFoundError,
  ServerError,
} from '../utils/errors/errorTypes';

export class UsersRepository {
  private userRepository: Repository<UserEntity>;
  private usersByExternalAPI: string;
  private socketServer: SocketServer;
  constructor() {
    this.userRepository = AppDataSource.getRepository(UserEntity);
    this.usersByExternalAPI = config.externalUsersApi.url;
    this.socketServer = SocketServer.bootstrap();
  }

  async getUsers(): Promise<User[]> {
    try {
      const existingUsers: UserEntity[] = await this.userRepository.find();
      if (existingUsers.length > 0) return existingUsers;
      else {
        const getExternalUsers = [
          await fetchExternalUsers(1, FetchBy.PAGE),
          await fetchExternalUsers(2, FetchBy.PAGE),
        ] as User[];
        if (getExternalUsers.length === 0)
          throw new NotFoundError('Users not found');
        await this.userRepository.save(getExternalUsers);
        return getExternalUsers;
      }
    } catch (error: any) {
      if (error instanceof ApplicationError) throw error;
      throw new ServerError(error.message);
    }
  }

  async getUsersByPage(page: number): Promise<User[]> {
    try {
      const existingUsers: UserEntity[] = await this.userRepository.find({
        where: { page },
      });
      if (existingUsers.length > 0) return existingUsers;
      else {
        const getExternalUsersByPage = (await fetchExternalUsers(
          page,
          FetchBy.PAGE
        )) as User[];
        if (getExternalUsersByPage.length === 0)
          throw new NotFoundError('Users not found');
        const usersToSave: User[] = getExternalUsersByPage.map((user) =>
          generateUser(user)
        );
        usersToSave.forEach((user) => (user.page = page));
        await this.userRepository.save(usersToSave);

        return usersToSave.map((user: User) => {
          const { page, ...userWithoutPage } = user;
          return userWithoutPage;
        });
      }
    } catch (error: any) {
      if (error instanceof ApplicationError) throw error;
      throw new ServerError(error.message);
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      const existingUser = await this.userRepository.findOneBy({ id });
      if (existingUser) return existingUser;
      else {
        const getExternalUsers: User = (await fetchExternalUsers(
          id,
          FetchBy.ID
        )) as User;
        const user: User = generateUser(getExternalUsers);
        await this.userRepository.save(user);
        return user;
      }
    } catch (error: any) {
      if (error instanceof ApplicationError) throw error;
      throw new ServerError(error.message);
    }
  }

  async createUser(createUserRequest: User): Promise<User> {
    try {
      const newUser = generateUser(createUserRequest);
      await this.userRepository.save(newUser);
      this.socketServer.emitNewUser(newUser);
      return newUser;
    } catch (error: any) {
      if (error instanceof ApplicationError) throw error;
      throw new ServerError(error.message);
    }
  }

  async updateUser(updateUserRequest: Partial<User>): Promise<User> {
    try {
      const user: User | null = await this.userRepository.findOneBy({
        id: updateUserRequest.id,
      });
      if (!user) {
        throw new NotFoundError('User not found');
      }
      const userUpdated: User = {
        ...user,
        ...updateUserRequest,
      };
      await this.userRepository.update(updateUserRequest.id!, {
        ...userUpdated,
      });
      this.socketServer.emitUpdatedUser(userUpdated);
      return userUpdated as User;
    } catch (error: any) {
      if (error instanceof ApplicationError) throw error;
      throw new ServerError(error.message);
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) throw new NotFoundError('User not found');
      await this.userRepository.remove(user);
      this.socketServer.emitDeletedUser(id);
    } catch (error: any) {
      if (error instanceof ApplicationError) throw error;
      throw new ServerError(error.message);
    }
  }
}
