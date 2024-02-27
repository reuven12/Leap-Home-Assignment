import React, { useEffect, useState } from "react";
import { UsersService } from "../services/users.service";
import "../assets/css/users.css";
import UserTable from "../components/usersTable";
import { User, FetchBy } from "../models/users.interfaces";
import ActionsUser from "../components/actionsUser";
import { io, Socket } from 'socket.io-client';
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import {searchOptions} from "../utils/usersUtils";

const Homepage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isUserFormVisible, setIsUserFormVisible] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<number|null>();
  const [searchType, setSearchType] = useState(FetchBy.PAGE);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);

  useEffect(() => {
    const socket: Socket = io('http://localhost:8001');
    socket.on('websiteCreated', userCreated);
    socket.on('websiteUpdated', userUpdated);
    socket.on('websiteDeleted', userDeleted);
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    console.log("fetching users");

    const fetchUsers = async () => {
      setUsers(await UsersService.getUsersByPage(1));
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchValue) {
      const fetchUsers = async () => {
        if (searchType === FetchBy.ID) {  
          const user:User = await UsersService.getUserById(searchValue);  
          setFilteredUsers(user? [user]: []);
        } else if (searchType === FetchBy.PAGE) {
          setFilteredUsers(await UsersService.getUsersByPage(Number(searchValue)));
        }
      };
      fetchUsers();
    }
  }, [isFiltering, searchValue, searchType]);

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
      <div className="header-container">
        <Button
          label="Create New User"
          icon="pi pi-plus"
          style={{color: "white", backgroundColor: "green"}}
          onClick={() => setIsUserFormVisible(true)}
        />
        <Dropdown
          value={searchType}
          options={searchOptions}
          onChange={(e) => {
            setSearchType(e.value);
          }}
        />
        <InputNumber
          value={searchValue}
          onChange={(e) => {            
            setSearchValue(e.value);
            setIsFiltering(!!e.value);
          }}
          placeholder={
            searchType === FetchBy.PAGE ? "Enter Page Number" : "Enter User ID"
          }
        />
      </div>
      <UserTable users={isFiltering? filteredUsers :users} />
      {isUserFormVisible && (
        <ActionsUser user={null} onClose={() => setIsUserFormVisible(false)} />
      )}
    </div>
  );
};

export default Homepage;
