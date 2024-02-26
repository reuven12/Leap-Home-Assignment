import { User } from '../models/users.interfaces';
import { UsersService } from '../services/users.service';

export const handleUserCreated = async (newWebsite: User) => {
  await UsersService.createUser(newWebsite);
};

export const handleUserDeleted = async (id: number) => {
  await UsersService.deleteUser(id);
};

export const handleUserUpdated = async (updatedWebsite: Partial<User>) => {
  await UsersService.updateUser(updatedWebsite.id!, updatedWebsite);
};
