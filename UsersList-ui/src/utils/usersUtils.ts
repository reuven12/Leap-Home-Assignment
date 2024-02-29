import { FetchBy, User } from '../models/users.interfaces';
import { UsersService } from '../services/users.service';

export const handleUserCreated = async (newUser: User) => {
  await UsersService.createUser(newUser);
};

export const handleUserDeleted = async (id: number) => {
  await UsersService.deleteUser(id);
};

export const handleUserUpdated = async (
  id: number,
  updateUser: Partial<User>
) => {
  await UsersService.updateUser(id, updateUser);
};

export const searchOptions = [
  { label: FetchBy.PAGE, value: 'Page' },
  { label: FetchBy.ID, value: 'User ID' },
];
