export interface User {
  id?: number;
  page?: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface CreateUser extends Omit<User, 'id' | 'page'> {}

export enum FetchBy {
  PAGE = 'Page',
  ID = 'User ID',
}

export enum UserActionsType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}
