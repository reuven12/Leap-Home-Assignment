import React, { useEffect, useState } from 'react';
import { UsersService } from '../services/users.service';
import '../assets/css/users.css';
import UserTable from '../components/usersTable';
import { User } from '../models/users.interfaces';
import ActionsUser from '../components/actionsUser';
// import { io, Socket } from 'socket.io-client';
import { Button } from 'primereact/button';

const Homepage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isUserFormVisible, setIsUserFormVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setUsers(await UsersService.getUsersByPage(1));
    };
    fetchUsers();
  }, []);

  const userCreated = (newUser: User) => {
    setUsers((prevState) => [...prevState, newUser]);
  };

  const userUpdated = (updatedUser: User) => {
    setUsers((prevState) => {
      return prevState.map((user) =>
        user.id === updatedUser.id ? { ...user, ...updatedUser } : user
      );
    });
  };

  const userDeleted = (userId: number) => {
    setUsers((prevState) => {
      return prevState.filter((user) => user.id !== Number(userId));
    });
  };

  return (
    <div className="main-layout">
      <div className="create-user">
        <Button
          label="Create New User"
          icon="pi pi-plus"
          className="p-button-create-user"
          onClick={() => {
            setIsUserFormVisible(true);
          }}
        />
      </div>
      <UserTable users={users} />
      {isUserFormVisible && (
        <ActionsUser
          user={null}
          onClose={() => {
            setIsUserFormVisible(false);
          }}
        />
      )}
    </div>
  );
};

export default Homepage;
