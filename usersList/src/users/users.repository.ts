export class UsersRepository {
 async getUsers(page: number) {
  return [
   {
    id: 1,
    name: 'John Doe',
   },
   {
    id: 2,
    name: 'Jane Doe',
   },
  ];
 }
}