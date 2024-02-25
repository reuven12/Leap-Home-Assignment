export interface User {
  id?: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export enum FetchBy {
  PAGE = 'page',
  ID = 'id',
}
