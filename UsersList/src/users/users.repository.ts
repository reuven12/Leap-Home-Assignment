import { Repository } from "typeorm";
import { AppDataSource } from "../db/dataSource";
import { UserEntity } from "../db/users.entity";
import { User, FetchBy } from "../interfaces/users.interface";
import config from "../config";
import { fetchExternalUsers, generateUser } from "../utils/utils";
import {
  ApplicationError,
  NotFoundError,
  ServerError,
} from "../utils/errors/errorTypes";

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
      if (existingUsers.length > 0) {
        users = existingUsers;
      } else {
        const getExternalUsers = (await fetchExternalUsers(
          page,
          FetchBy.PAGE
        )) as User[];
        if (getExternalUsers.length === 0)
          throw new NotFoundError("Users not found");
        const usersToSave: User[] = getExternalUsers.map((user) =>
          generateUser(user)
        );
        await this.userRepository.save(usersToSave);
        users = usersToSave;
      }
      return users;
    } catch (error) {
      if (error instanceof ApplicationError) throw error;
      throw new ServerError();
    }
  }

  async getUserById(id: number): Promise<User | null> {
    try {
      const existingUser = await this.userRepository.findOneBy({ id });
      if (existingUser) return existingUser;
      else {
        const getExternalUsers = (await fetchExternalUsers(
          id,
          FetchBy.ID
        )) as User;
        const user: UserEntity = generateUser(getExternalUsers);
        await this.userRepository.save(user);
        return user;
      }
    } catch (error) {
      if (error instanceof ApplicationError) throw error;
      throw new ServerError();
    }
  }

  async createUser(createUserRequest: User): Promise<User> {
    try {
      const newUser = generateUser(createUserRequest);
      return await this.userRepository.save(newUser);
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
      if (!user) throw new NotFoundError("User not found");
      return await this.userRepository.save({
        ...user,
        ...updateUserRequest,
      });
    } catch (error) {
      if (error instanceof ApplicationError) throw error;
      throw new ServerError();
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) throw new NotFoundError("User not found");
      await this.userRepository.remove(user);
    } catch (error) {
      if (error instanceof ApplicationError) throw error;
      throw new ServerError();
    }
  }
}
